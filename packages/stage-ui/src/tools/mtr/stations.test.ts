import { describe, expect, it } from 'vitest'

import { findLine, formatStation, listStations, resolveStations } from './stations'

describe('mtr stations', () => {
  it('lists unique stations with serving lines', () => {
    const stations = listStations()
    const admiralty = stations.find(station => station.code === 'ADM')
    expect(admiralty).toBeTruthy()
    expect(admiralty!.nameTc).toBe('金鐘')
    expect(admiralty!.lines.map(line => line.code).sort()).toEqual(['EAL', 'ISL', 'SIL', 'TWL'])
  })

  it('resolves English, Chinese, and code queries', () => {
    expect(resolveStations('金鐘').map(s => s.code)).toEqual(['ADM'])
    expect(resolveStations('Admiralty').map(s => s.code)).toEqual(['ADM'])
    expect(resolveStations('adm').map(s => s.code)).toEqual(['ADM'])
    expect(resolveStations('Tseung Kwan O').some(s => s.code === 'TKO')).toBe(true)
  })

  it('filters by line when resolving', () => {
    const onTkl = resolveStations('Yau Tong', 'TKL')
    expect(onTkl).toHaveLength(1)
    expect(onTkl[0]!.code).toBe('YAT')

    const onMissing = resolveStations('Yau Tong', 'AEL')
    expect(onMissing).toHaveLength(0)
  })

  it('finds lines by code or localized name', () => {
    expect(findLine('TWL')?.nameEn).toBe('Tsuen Wan Line')
    expect(findLine('荃灣綫')?.code).toBe('TWL')
    expect(findLine('Island Line')?.code).toBe('ISL')
  })

  it('formats station labels for tools', () => {
    const [adm] = resolveStations('ADM')
    expect(formatStation(adm!)).toContain('Admiralty')
    expect(formatStation(adm!)).toContain('金鐘')
    expect(formatStation(adm!)).toContain('[ADM]')
  })
})
