export interface MtrStationRef {
  code: string
  nameEn: string
  nameTc: string
}

export interface MtrLine {
  code: string
  nameEn: string
  nameTc: string
  stations: MtrStationRef[]
}

/**
 * Station codes and English names follow MTR Next Train API Spec v1.7
 * (https://opendata.mtr.com.hk/doc/Next_Train_API_Spec_v1.7.pdf).
 * Traditional Chinese names are common public station names for lookup UX.
 */
export const MTR_LINES: MtrLine[] = [
  {
    code: 'AEL',
    nameEn: 'Airport Express',
    nameTc: '機場快綫',
    stations: [
      { code: 'HOK', nameEn: 'Hong Kong', nameTc: '香港' },
      { code: 'KOW', nameEn: 'Kowloon', nameTc: '九龍' },
      { code: 'TSY', nameEn: 'Tsing Yi', nameTc: '青衣' },
      { code: 'AIR', nameEn: 'Airport', nameTc: '機場' },
      { code: 'AWE', nameEn: 'AsiaWorld Expo', nameTc: '博覽館' },
    ],
  },
  {
    code: 'TCL',
    nameEn: 'Tung Chung Line',
    nameTc: '東涌綫',
    stations: [
      { code: 'HOK', nameEn: 'Hong Kong', nameTc: '香港' },
      { code: 'KOW', nameEn: 'Kowloon', nameTc: '九龍' },
      { code: 'OLY', nameEn: 'Olympic', nameTc: '奧運' },
      { code: 'NAC', nameEn: 'Nam Cheong', nameTc: '南昌' },
      { code: 'LAK', nameEn: 'Lai King', nameTc: '荔景' },
      { code: 'TSY', nameEn: 'Tsing Yi', nameTc: '青衣' },
      { code: 'SUN', nameEn: 'Sunny Bay', nameTc: '欣澳' },
      { code: 'TUC', nameEn: 'Tung Chung', nameTc: '東涌' },
    ],
  },
  {
    code: 'TML',
    nameEn: 'Tuen Ma Line',
    nameTc: '屯馬綫',
    stations: [
      { code: 'WKS', nameEn: 'Wu Kai Sha', nameTc: '烏溪沙' },
      { code: 'MOS', nameEn: 'Ma On Shan', nameTc: '馬鞍山' },
      { code: 'HEO', nameEn: 'Heng On', nameTc: '恆安' },
      { code: 'TSH', nameEn: 'Tai Shui Hang', nameTc: '大水坑' },
      { code: 'SHM', nameEn: 'Shek Mun', nameTc: '石門' },
      { code: 'CIO', nameEn: 'City One', nameTc: '第一城' },
      { code: 'STW', nameEn: 'Sha Tin Wai', nameTc: '沙田圍' },
      { code: 'CKT', nameEn: 'Che Kung Temple', nameTc: '車公廟' },
      { code: 'TAW', nameEn: 'Tai Wai', nameTc: '大圍' },
      { code: 'HIK', nameEn: 'Hin Keng', nameTc: '顯徑' },
      { code: 'DIH', nameEn: 'Diamond Hill', nameTc: '鑽石山' },
      { code: 'KAT', nameEn: 'Kai Tak', nameTc: '啟德' },
      { code: 'SUW', nameEn: 'Sung Wong Toi', nameTc: '宋皇臺' },
      { code: 'TKW', nameEn: 'To Kwa Wan', nameTc: '土瓜灣' },
      { code: 'HOM', nameEn: 'Ho Man Tin', nameTc: '何文田' },
      { code: 'HUH', nameEn: 'Hung Hom', nameTc: '紅磡' },
      { code: 'ETS', nameEn: 'East Tsim Sha Tsui', nameTc: '尖東' },
      { code: 'AUS', nameEn: 'Austin', nameTc: '柯士甸' },
      { code: 'NAC', nameEn: 'Nam Cheong', nameTc: '南昌' },
      { code: 'MEF', nameEn: 'Mei Foo', nameTc: '美孚' },
      { code: 'TWW', nameEn: 'Tsuen Wan West', nameTc: '荃灣西' },
      { code: 'KSR', nameEn: 'Kam Sheung Road', nameTc: '錦上路' },
      { code: 'YUL', nameEn: 'Yuen Long', nameTc: '元朗' },
      { code: 'LOP', nameEn: 'Long Ping', nameTc: '朗屏' },
      { code: 'TIS', nameEn: 'Tin Shui Wai', nameTc: '天水圍' },
      { code: 'SIH', nameEn: 'Siu Hong', nameTc: '兆康' },
      { code: 'TUM', nameEn: 'Tuen Mun', nameTc: '屯門' },
    ],
  },
  {
    code: 'TKL',
    nameEn: 'Tseung Kwan O Line',
    nameTc: '將軍澳綫',
    stations: [
      { code: 'NOP', nameEn: 'North Point', nameTc: '北角' },
      { code: 'QUB', nameEn: 'Quarry Bay', nameTc: '鰂魚涌' },
      { code: 'YAT', nameEn: 'Yau Tong', nameTc: '油塘' },
      { code: 'TIK', nameEn: 'Tiu Keng Leng', nameTc: '調景嶺' },
      { code: 'TKO', nameEn: 'Tseung Kwan O', nameTc: '將軍澳' },
      { code: 'LHP', nameEn: 'LOHAS Park', nameTc: '康城' },
      { code: 'HAH', nameEn: 'Hang Hau', nameTc: '坑口' },
      { code: 'POA', nameEn: 'Po Lam', nameTc: '寶琳' },
    ],
  },
  {
    code: 'EAL',
    nameEn: 'East Rail Line',
    nameTc: '東鐵綫',
    stations: [
      { code: 'ADM', nameEn: 'Admiralty', nameTc: '金鐘' },
      { code: 'EXC', nameEn: 'Exhibition Centre', nameTc: '會展' },
      { code: 'HUH', nameEn: 'Hung Hom', nameTc: '紅磡' },
      { code: 'MKK', nameEn: 'Mong Kok East', nameTc: '旺角東' },
      { code: 'KOT', nameEn: 'Kowloon Tong', nameTc: '九龍塘' },
      { code: 'TAW', nameEn: 'Tai Wai', nameTc: '大圍' },
      { code: 'SHT', nameEn: 'Sha Tin', nameTc: '沙田' },
      { code: 'FOT', nameEn: 'Fo Tan', nameTc: '火炭' },
      { code: 'RAC', nameEn: 'Racecourse', nameTc: '馬場' },
      { code: 'UNI', nameEn: 'University', nameTc: '大學' },
      { code: 'TAP', nameEn: 'Tai Po Market', nameTc: '大埔墟' },
      { code: 'TWO', nameEn: 'Tai Wo', nameTc: '太和' },
      { code: 'FAN', nameEn: 'Fanling', nameTc: '粉嶺' },
      { code: 'SHS', nameEn: 'Sheung Shui', nameTc: '上水' },
      { code: 'LOW', nameEn: 'Lo Wu', nameTc: '羅湖' },
      { code: 'LMC', nameEn: 'Lok Ma Chau', nameTc: '落馬洲' },
    ],
  },
  {
    code: 'SIL',
    nameEn: 'South Island Line',
    nameTc: '南港島綫',
    stations: [
      { code: 'ADM', nameEn: 'Admiralty', nameTc: '金鐘' },
      { code: 'OCP', nameEn: 'Ocean Park', nameTc: '海洋公園' },
      { code: 'WCH', nameEn: 'Wong Chuk Hang', nameTc: '黃竹坑' },
      { code: 'LET', nameEn: 'Lei Tung', nameTc: '利東' },
      { code: 'SOH', nameEn: 'South Horizons', nameTc: '海怡半島' },
    ],
  },
  {
    code: 'TWL',
    nameEn: 'Tsuen Wan Line',
    nameTc: '荃灣綫',
    stations: [
      { code: 'CEN', nameEn: 'Central', nameTc: '中環' },
      { code: 'ADM', nameEn: 'Admiralty', nameTc: '金鐘' },
      { code: 'TST', nameEn: 'Tsim Sha Tsui', nameTc: '尖沙咀' },
      { code: 'JOR', nameEn: 'Jordan', nameTc: '佐敦' },
      { code: 'YMT', nameEn: 'Yau Ma Tei', nameTc: '油麻地' },
      { code: 'MOK', nameEn: 'Mong Kok', nameTc: '旺角' },
      { code: 'PRE', nameEn: 'Prince Edward', nameTc: '太子' },
      { code: 'SSP', nameEn: 'Sham Shui Po', nameTc: '深水埗' },
      { code: 'CSW', nameEn: 'Cheung Sha Wan', nameTc: '長沙灣' },
      { code: 'LCK', nameEn: 'Lai Chi Kok', nameTc: '荔枝角' },
      { code: 'MEF', nameEn: 'Mei Foo', nameTc: '美孚' },
      { code: 'LAK', nameEn: 'Lai King', nameTc: '荔景' },
      { code: 'KWF', nameEn: 'Kwai Fong', nameTc: '葵芳' },
      { code: 'KWH', nameEn: 'Kwai Hing', nameTc: '葵興' },
      { code: 'TWH', nameEn: 'Tai Wo Hau', nameTc: '大窩口' },
      { code: 'TSW', nameEn: 'Tsuen Wan', nameTc: '荃灣' },
    ],
  },
  {
    code: 'ISL',
    nameEn: 'Island Line',
    nameTc: '港島綫',
    stations: [
      { code: 'KET', nameEn: 'Kennedy Town', nameTc: '堅尼地城' },
      { code: 'HKU', nameEn: 'HKU', nameTc: '香港大學' },
      { code: 'SYP', nameEn: 'Sai Ying Pun', nameTc: '西營盤' },
      { code: 'SHW', nameEn: 'Sheung Wan', nameTc: '上環' },
      { code: 'CEN', nameEn: 'Central', nameTc: '中環' },
      { code: 'ADM', nameEn: 'Admiralty', nameTc: '金鐘' },
      { code: 'WAC', nameEn: 'Wan Chai', nameTc: '灣仔' },
      { code: 'CAB', nameEn: 'Causeway Bay', nameTc: '銅鑼灣' },
      { code: 'TIH', nameEn: 'Tin Hau', nameTc: '天后' },
      { code: 'FOH', nameEn: 'Fortress Hill', nameTc: '炮台山' },
      { code: 'NOP', nameEn: 'North Point', nameTc: '北角' },
      { code: 'QUB', nameEn: 'Quarry Bay', nameTc: '鰂魚涌' },
      { code: 'TAK', nameEn: 'Tai Koo', nameTc: '太古' },
      { code: 'SWH', nameEn: 'Sai Wan Ho', nameTc: '西灣河' },
      { code: 'SKW', nameEn: 'Shau Kei Wan', nameTc: '筲箕灣' },
      { code: 'HFC', nameEn: 'Heng Fa Chuen', nameTc: '杏花邨' },
      { code: 'CHW', nameEn: 'Chai Wan', nameTc: '柴灣' },
    ],
  },
  {
    code: 'KTL',
    nameEn: 'Kwun Tong Line',
    nameTc: '觀塘綫',
    stations: [
      { code: 'WHA', nameEn: 'Whampoa', nameTc: '黃埔' },
      { code: 'HOM', nameEn: 'Ho Man Tin', nameTc: '何文田' },
      { code: 'YMT', nameEn: 'Yau Ma Tei', nameTc: '油麻地' },
      { code: 'MOK', nameEn: 'Mong Kok', nameTc: '旺角' },
      { code: 'PRE', nameEn: 'Prince Edward', nameTc: '太子' },
      { code: 'SKM', nameEn: 'Shek Kip Mei', nameTc: '石硤尾' },
      { code: 'KOT', nameEn: 'Kowloon Tong', nameTc: '九龍塘' },
      { code: 'LOF', nameEn: 'Lok Fu', nameTc: '樂富' },
      { code: 'WTS', nameEn: 'Wong Tai Sin', nameTc: '黃大仙' },
      { code: 'DIH', nameEn: 'Diamond Hill', nameTc: '鑽石山' },
      { code: 'CHH', nameEn: 'Choi Hung', nameTc: '彩虹' },
      { code: 'KOB', nameEn: 'Kowloon Bay', nameTc: '九龍灣' },
      { code: 'NTK', nameEn: 'Ngau Tau Kok', nameTc: '牛頭角' },
      { code: 'KWT', nameEn: 'Kwun Tong', nameTc: '觀塘' },
      { code: 'LAT', nameEn: 'Lam Tin', nameTc: '藍田' },
      { code: 'YAT', nameEn: 'Yau Tong', nameTc: '油塘' },
      { code: 'TIK', nameEn: 'Tiu Keng Leng', nameTc: '調景嶺' },
    ],
  },
  {
    code: 'DRL',
    nameEn: 'Disneyland Resort Line',
    nameTc: '迪士尼綫',
    stations: [
      { code: 'SUN', nameEn: 'Sunny Bay', nameTc: '欣澳' },
      { code: 'DIS', nameEn: 'Disneyland Resort', nameTc: '迪士尼' },
    ],
  },
]

export interface ResolvedStation {
  code: string
  nameEn: string
  nameTc: string
  lines: Array<{ code: string, nameEn: string, nameTc: string }>
}

function normalizeQuery(input: string): string {
  return input.trim().toLowerCase().replace(/[\s\-_/]+/g, '')
}

/** Build unique stations with the lines that serve them. */
export function listStations(): ResolvedStation[] {
  const byCode = new Map<string, ResolvedStation>()

  for (const line of MTR_LINES) {
    for (const station of line.stations) {
      const existing = byCode.get(station.code)
      if (existing) {
        if (!existing.lines.some(l => l.code === line.code)) {
          existing.lines.push({ code: line.code, nameEn: line.nameEn, nameTc: line.nameTc })
        }
        continue
      }

      byCode.set(station.code, {
        code: station.code,
        nameEn: station.nameEn,
        nameTc: station.nameTc,
        lines: [{ code: line.code, nameEn: line.nameEn, nameTc: line.nameTc }],
      })
    }
  }

  return [...byCode.values()].sort((a, b) => a.nameEn.localeCompare(b.nameEn))
}

export function findLine(lineQuery: string): MtrLine | undefined {
  const q = normalizeQuery(lineQuery)
  if (!q)
    return undefined

  const exactCode = MTR_LINES.find(line => normalizeQuery(line.code) === q)
  if (exactCode)
    return exactCode

  const exactName = MTR_LINES.find(line =>
    normalizeQuery(line.nameEn) === q
    || normalizeQuery(line.nameTc) === q,
  )
  if (exactName)
    return exactName

  // Prefer the shortest name that contains the query so "Island Line"
  // resolves to ISL instead of SIL (South Island Line).
  const partial = MTR_LINES
    .filter(line =>
      normalizeQuery(line.nameEn).includes(q)
      || normalizeQuery(line.nameTc).includes(q)
      || q.includes(normalizeQuery(line.code)),
    )
    .sort((a, b) => normalizeQuery(a.nameEn).length - normalizeQuery(b.nameEn).length)

  return partial[0]
}

/**
 * Resolve a station name/code. Prefers exact code/name matches, then substring matches.
 * When `lineCode` is set, only stations on that line are considered.
 */
export function resolveStations(stationQuery: string, lineCode?: string): ResolvedStation[] {
  const q = normalizeQuery(stationQuery)
  if (!q)
    return []

  const stations = listStations().filter(station =>
    !lineCode || station.lines.some(line => line.code === lineCode.toUpperCase()),
  )

  const exact = stations.filter(station =>
    normalizeQuery(station.code) === q
    || normalizeQuery(station.nameEn) === q
    || normalizeQuery(station.nameTc) === q,
  )
  if (exact.length > 0)
    return exact

  return stations.filter(station =>
    normalizeQuery(station.code).includes(q)
    || normalizeQuery(station.nameEn).includes(q)
    || normalizeQuery(station.nameTc).includes(q),
  )
}

export function formatStation(station: ResolvedStation): string {
  const lines = station.lines.map(l => `${l.nameEn} (${l.code})`).join(', ')
  return `${station.nameEn} / ${station.nameTc} [${station.code}] — ${lines}`
}
