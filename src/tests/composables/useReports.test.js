import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useReports } from '../../composables/useReports.js'

function setup(entriesList, gran) {
  const entries = ref(entriesList)
  const granularity = ref(gran)
  return useReports(entries, granularity)
}

describe('useReports', () => {
  it('returns empty structure for no entries', () => {
    const { reportData } = setup([], 'days')
    expect(reportData.value.projects).toEqual([])
    expect(reportData.value.periods).toEqual([])
    expect(reportData.value.grandTotal).toBe(0)
  })

  it('skips entries without endTime', () => {
    const { reportData } = setup(
      [{ project: 'work', startTime: 1000, endTime: null }],
      'days'
    )
    expect(reportData.value.grandTotal).toBe(0)
  })

  it('skips entries with zero or negative duration', () => {
    const { reportData } = setup(
      [{ project: 'work', startTime: 2000, endTime: 2000 }],
      'days'
    )
    expect(reportData.value.grandTotal).toBe(0)
  })

  it('period key format for days is YYYY-MM-DD', () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [{ project: 'work', startTime: ts, endTime: ts + 3600000 }],
      'days'
    )
    expect(reportData.value.periods[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('period key format for weeks is YYYY-MM-DD (Monday)', () => {
    // 2026-03-18 is a Wednesday; Monday should be 2026-03-16
    const ts = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [{ project: 'work', startTime: ts, endTime: ts + 3600000 }],
      'weeks'
    )
    expect(reportData.value.periods[0]).toBe('2026-03-16')
  })

  it('period key format for months is YYYY-MM', () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [{ project: 'work', startTime: ts, endTime: ts + 3600000 }],
      'months'
    )
    expect(reportData.value.periods[0]).toMatch(/^\d{4}-\d{2}$/)
  })

  it('assigns "(no project)" to entries without a project', () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [{ project: '', startTime: ts, endTime: ts + 1000 }],
      'days'
    )
    expect(reportData.value.projects).toContain('(no project)')
  })

  it('builds matrix with correct durations', () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [
        { project: 'work', startTime: ts, endTime: ts + 3600000 },
        { project: 'work', startTime: ts + 3600000, endTime: ts + 7200000 },
      ],
      'days'
    )
    const key = reportData.value.periods[0]
    expect(reportData.value.matrix['work'][key]).toBe(7200000)
  })

  it('sorts periods ascending', () => {
    const ts1 = new Date('2026-03-17T10:00:00').getTime()
    const ts2 = new Date('2026-03-18T10:00:00').getTime()
    const { reportData } = setup(
      [
        { project: 'a', startTime: ts2, endTime: ts2 + 1000 },
        { project: 'a', startTime: ts1, endTime: ts1 + 1000 },
      ],
      'days'
    )
    expect(reportData.value.periods[0]).toBe('2026-03-17')
    expect(reportData.value.periods[1]).toBe('2026-03-18')
  })
})
