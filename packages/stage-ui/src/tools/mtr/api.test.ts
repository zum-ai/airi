import { describe, expect, it, vi } from 'vitest'

import { fetchNextTrain, formatSchedule, nextTrainForQuery } from './api'

describe('mtr api helpers', () => {
  it('parses next-train payloads and formats arrivals', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({
      sys_time: '2026-10-11 15:50:09',
      curr_time: '2026-10-11 15:50:00',
      data: {
        'TKL-TKO': {
          curr_time: '2026-10-11 15:50:00',
          sys_time: '2026-10-11 15:50:09',
          UP: [{
            seq: '1',
            dest: 'POA',
            plat: '1',
            time: '2026-10-11 15:51:00',
            ttnt: '1',
            valid: 'Y',
          }],
          DOWN: [{
            seq: '1',
            dest: 'NOP',
            plat: '2',
            time: '2026-10-11 15:52:00',
            ttnt: '2',
            valid: 'Y',
          }],
        },
      },
      isdelay: 'N',
      status: 1,
      message: 'successful',
    }), { status: 200 })) as unknown as typeof fetch

    const result = await fetchNextTrain({ line: 'TKL', station: 'TKO', fetchImpl })
    expect(result.up[0]?.destNameEn).toBe('Po Lam')
    expect(result.down[0]?.destNameTc).toBe('北角')

    const text = formatSchedule(result)
    expect(text).toContain('Tseung Kwan O')
    expect(text).toContain('Po Lam')
    expect(text).toContain('North Point')
  })

  it('surfaces special-service alerts', () => {
    const text = formatSchedule({
      line: 'TKL',
      station: 'TKO',
      stationLabel: 'Tseung Kwan O / 將軍澳',
      currTime: '',
      sysTime: '',
      isDelay: false,
      status: 0,
      message: 'Special train service arrangements are now in place on this line.',
      url: 'https://www.mtr.com.hk/alert/alert_title_wap.html',
      up: [],
      down: [],
    })

    expect(text).toContain('MTR alert')
    expect(text).toContain('https://www.mtr.com.hk/alert/alert_title_wap.html')
  })

  it('queries every line for multi-line stations when line is omitted', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      const line = new URL(url).searchParams.get('line')
      return new Response(JSON.stringify({
        status: 1,
        message: 'successful',
        isdelay: 'N',
        curr_time: '2026-10-11 12:00:00',
        sys_time: '2026-10-11 12:00:00',
        data: {
          [`${line}-ADM`]: {
            curr_time: '2026-10-11 12:00:00',
            sys_time: '2026-10-11 12:00:00',
            UP: [],
            DOWN: [],
          },
        },
      }), { status: 200 })
    }) as unknown as typeof fetch

    const text = await nextTrainForQuery({ station: '金鐘', fetchImpl })
    expect(text).toContain('ADM')
    expect(fetchImpl).toHaveBeenCalled()
    expect((fetchImpl as any).mock.calls.length).toBeGreaterThanOrEqual(2)
  })
})
