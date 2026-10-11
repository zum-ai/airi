import { tool } from '@xsai/tool'
import { z } from 'zod'

import { describeLines, describeStations, nextTrainForQuery } from './api'
import { findLine } from './stations'

const tools = [
  tool({
    name: 'mtr_list_lines',
    description: 'List Hong Kong MTR heavy-rail lines supported by the official Next Train open data API (Airport Express, Tung Chung, Tuen Ma, Tseung Kwan O, East Rail, South Island, Tsuen Wan, Island, Kwun Tong, Disneyland Resort). Does not cover Light Rail or buses.',
    execute: async () => describeLines(),
    parameters: z.object({}),
  }),
  tool({
    name: 'mtr_search_stations',
    description: 'Search Hong Kong MTR stations by English name, Traditional Chinese name, or 3-letter station code (e.g. Admiralty, 金鐘, ADM). Optionally filter by line code such as TWL or ISL.',
    execute: async ({ query, line }) => {
      if (line) {
        const resolved = findLine(line)
        if (!resolved)
          return `Unknown MTR line "${line}". Use mtr_list_lines for valid line codes.`
        return describeStations(query, resolved.code)
      }
      return describeStations(query)
    },
    parameters: z.object({
      query: z.string().optional().describe('Station name or code fragment. Omit to list all stations (optionally filtered by line).'),
      line: z.string().optional().describe('Optional line code/name to filter stations, e.g. TWL, Island Line, 荃灣綫'),
    }),
  }),
  tool({
    name: 'mtr_next_train',
    description: 'Get real-time next train arrivals for a Hong Kong MTR station using the official data.gov.hk Next Train API. Returns up to four upcoming trains per UP/DOWN direction. Prefer passing line when the station sits on multiple lines (e.g. Admiralty).',
    execute: async ({ station, line, lang }) => {
      return await nextTrainForQuery({
        station,
        line,
        lang: lang === 'TC' ? 'TC' : 'EN',
      })
    },
    parameters: z.object({
      station: z.string().describe('Station name or code, e.g. Admiralty, 金鐘, TKO, Causeway Bay'),
      line: z.string().optional().describe('Line code/name when known, e.g. TKL, ISL, Tuen Ma Line'),
      lang: z.enum(['EN', 'TC']).optional().describe('Response language hint for the API. EN (default) or TC'),
    }),
  }),
]

export const mtr = async () => Promise.all(tools)

export * from './api'
export * from './stations'
