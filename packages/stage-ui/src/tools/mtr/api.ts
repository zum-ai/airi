import type { ResolvedStation } from './stations'

import { findLine, formatStation, listStations, MTR_LINES, resolveStations } from './stations'

export const MTR_NEXT_TRAIN_URL = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php'

export type MtrLang = 'EN' | 'TC'

export interface MtrTrainArrival {
  seq: string
  dest: string
  destNameEn?: string
  destNameTc?: string
  plat: string
  time: string
  /** Minutes until next train (API field ttnt). */
  minutes: string
  valid: string
  route?: string
  timeType?: string
}

export interface MtrScheduleResult {
  line: string
  station: string
  stationLabel: string
  currTime: string
  sysTime: string
  isDelay: boolean
  status: number
  message: string
  url?: string
  up: MtrTrainArrival[]
  down: MtrTrainArrival[]
}

interface RawTrain {
  seq?: string
  dest?: string
  plat?: string
  time?: string
  ttnt?: string
  valid?: string
  route?: string
  timetype?: string
}

interface RawScheduleResponse {
  status: number
  message?: string
  url?: string
  curr_time?: string
  cur_time?: string
  sys_time?: string
  isdelay?: string
  data?: Record<string, {
    curr_time?: string
    sys_time?: string
    UP?: RawTrain[]
    DOWN?: RawTrain[]
  }>
}

function stationLookup(): Map<string, ResolvedStation> {
  return new Map(listStations().map(station => [station.code, station]))
}

function mapTrain(train: RawTrain, stations: Map<string, ResolvedStation>): MtrTrainArrival {
  const dest = (train.dest ?? '').toUpperCase()
  const destStation = stations.get(dest)
  return {
    seq: train.seq ?? '',
    dest,
    destNameEn: destStation?.nameEn,
    destNameTc: destStation?.nameTc,
    plat: train.plat ?? '',
    time: train.time ?? '',
    minutes: train.ttnt ?? '',
    valid: train.valid ?? '',
    route: train.route,
    timeType: train.timetype,
  }
}

export async function fetchNextTrain(options: {
  line: string
  station: string
  lang?: MtrLang
  fetchImpl?: typeof fetch
}): Promise<MtrScheduleResult> {
  const line = options.line.toUpperCase()
  const station = options.station.toUpperCase()
  const lang = options.lang ?? 'EN'
  const fetchImpl = options.fetchImpl ?? globalThis.fetch

  const url = new URL(MTR_NEXT_TRAIN_URL)
  url.searchParams.set('line', line)
  url.searchParams.set('sta', station)
  url.searchParams.set('lang', lang)

  const response = await fetchImpl(url)
  if (!response.ok) {
    throw new Error(`MTR Next Train API HTTP ${response.status}`)
  }

  const json = await response.json() as RawScheduleResponse
  const stations = stationLookup()
  const stationInfo = stations.get(station)
  const key = `${line}-${station}`
  const block = json.data?.[key]

  return {
    line,
    station,
    stationLabel: stationInfo
      ? `${stationInfo.nameEn} / ${stationInfo.nameTc}`
      : station,
    currTime: block?.curr_time ?? json.curr_time ?? json.cur_time ?? '',
    sysTime: block?.sys_time ?? json.sys_time ?? '',
    isDelay: (json.isdelay ?? 'N').toUpperCase() === 'Y',
    status: json.status,
    message: json.message ?? '',
    url: json.url,
    up: (block?.UP ?? []).map(train => mapTrain(train, stations)),
    down: (block?.DOWN ?? []).map(train => mapTrain(train, stations)),
  }
}

function formatArrival(train: MtrTrainArrival): string {
  const dest = train.destNameEn
    ? `${train.destNameEn} / ${train.destNameTc} [${train.dest}]`
    : train.dest
  const parts = [
    `#${train.seq}`,
    `${train.minutes} min`,
    `plat ${train.plat}`,
    `→ ${dest}`,
    `at ${train.time}`,
  ]
  if (train.route)
    parts.push(`via ${train.route}`)
  if (train.timeType)
    parts.push(train.timeType === 'A' ? 'arrival' : train.timeType === 'D' ? 'departure' : train.timeType)
  return parts.join(' | ')
}

export function formatSchedule(result: MtrScheduleResult): string {
  if (result.status !== 1) {
    const alert = [
      `MTR alert for ${result.line}-${result.station}: ${result.message || 'special service arrangement'}`,
    ]
    if (result.url)
      alert.push(`More info: ${result.url}`)
    return alert.join('\n')
  }

  const lines = [
    `Next trains at ${result.stationLabel} [${result.station}] on ${result.line}`,
    `Current time: ${result.currTime || 'n/a'} | Delayed: ${result.isDelay ? 'yes' : 'no'}`,
  ]

  if (result.up.length === 0 && result.down.length === 0) {
    lines.push('No upcoming train data (service may have ended or data absent).')
    return lines.join('\n')
  }

  if (result.up.length > 0) {
    lines.push('UP direction:')
    for (const train of result.up)
      lines.push(`  - ${formatArrival(train)}`)
  }
  else {
    lines.push('UP direction: (none)')
  }

  if (result.down.length > 0) {
    lines.push('DOWN direction:')
    for (const train of result.down)
      lines.push(`  - ${formatArrival(train)}`)
  }
  else {
    lines.push('DOWN direction: (none)')
  }

  return lines.join('\n')
}

export function describeLines(): string {
  return MTR_LINES.map(line =>
    `${line.code}: ${line.nameEn} / ${line.nameTc} (${line.stations.length} stations)`,
  ).join('\n')
}

export function describeStations(query?: string, lineCode?: string): string {
  const stations = query
    ? resolveStations(query, lineCode)
    : listStations().filter(station =>
        !lineCode || station.lines.some(line => line.code === lineCode.toUpperCase()),
      )

  if (stations.length === 0)
    return `No MTR stations matched${query ? ` "${query}"` : ''}${lineCode ? ` on line ${lineCode}` : ''}.`

  return stations.map(formatStation).join('\n')
}

export async function nextTrainForQuery(options: {
  station: string
  line?: string
  lang?: MtrLang
  fetchImpl?: typeof fetch
}): Promise<string> {
  let line: string | undefined
  if (options.line) {
    const resolvedLine = findLine(options.line)
    if (!resolvedLine)
      return `Unknown MTR line "${options.line}". Use mtr_list_lines for valid line codes.`
    line = resolvedLine.code
  }

  const matches = resolveStations(options.station, line)

  if (matches.length === 0) {
    return `Could not resolve MTR station "${options.station}". Use mtr_search_stations to find valid codes/names.`
  }

  if (!line && matches.length > 1) {
    return [
      `Station query "${options.station}" is ambiguous. Pick one:`,
      ...matches.map(formatStation),
      'Call again with a more specific station name/code, or pass line.',
    ].join('\n')
  }

  const station = matches[0]!
  const lineCodes = line
    ? [line]
    : station.lines.map(l => l.code)

  if (line && !station.lines.some(l => l.code === line)) {
    return `Station ${formatStation(station)} is not on line ${line}. Serving lines: ${station.lines.map(l => l.code).join(', ')}`
  }

  // If the station is on multiple lines and no line was given, query all serving lines.
  const results: string[] = []
  for (const lineCode of lineCodes) {
    try {
      const schedule = await fetchNextTrain({
        line: lineCode,
        station: station.code,
        lang: options.lang,
        fetchImpl: options.fetchImpl,
      })
      results.push(formatSchedule(schedule))
    }
    catch (error) {
      results.push(`Failed to fetch ${lineCode}-${station.code}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return results.join('\n\n')
}
