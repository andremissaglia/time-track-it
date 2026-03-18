import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  formatDuration,
  formatDurationShort,
  formatDayLabel,
  formatTime,
  groupEntriesByDay,
} from '../../utils/time.js'

describe('formatDuration', () => {
  it('formats zero as 00:00:00', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('formats negative as 00:00:00', () => {
    expect(formatDuration(-5000)).toBe('00:00:00')
  })

  it('formats 90 minutes', () => {
    expect(formatDuration(90 * 60 * 1000)).toBe('01:30:00')
  })

  it('formats 3661 seconds', () => {
    expect(formatDuration(3661 * 1000)).toBe('01:01:01')
  })
})

describe('formatDurationShort', () => {
  it('shows only minutes when under one hour', () => {
    expect(formatDurationShort(45 * 60 * 1000)).toBe('45m')
  })

  it('shows hours and minutes when over one hour', () => {
    expect(formatDurationShort(90 * 60 * 1000)).toBe('1h 30m')
  })

  it('shows 0m for zero ms', () => {
    expect(formatDurationShort(0)).toBe('0m')
  })
})

describe('formatDayLabel', () => {
  const FIXED_NOW = new Date('2026-03-18T12:00:00').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Today" for today\'s date', () => {
    expect(formatDayLabel('2026-03-18')).toBe('Today')
  })

  it('returns "Yesterday" for yesterday\'s date', () => {
    expect(formatDayLabel('2026-03-17')).toBe('Yesterday')
  })

  it('returns formatted date for older dates', () => {
    const label = formatDayLabel('2026-03-10')
    expect(label).not.toBe('Today')
    expect(label).not.toBe('Yesterday')
    expect(label).toContain('Mar')
  })
})

describe('formatTime', () => {
  it('returns HH:MM formatted time', () => {
    // Use a known UTC timestamp; local formatting will vary, so just check shape
    const result = formatTime(new Date('2026-03-18T14:30:00').getTime())
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('groupEntriesByDay', () => {
  it('returns empty array for no entries', () => {
    expect(groupEntriesByDay([])).toEqual([])
  })

  it('groups entries by calendar day', () => {
    const entries = [
      { id: 1, startTime: new Date('2026-03-18T10:00:00').getTime() },
      { id: 2, startTime: new Date('2026-03-18T15:00:00').getTime() },
      { id: 3, startTime: new Date('2026-03-17T09:00:00').getTime() },
    ]
    const result = groupEntriesByDay(entries)
    expect(result).toHaveLength(2)
    // sorted descending
    expect(result[0].date).toBe('2026-03-18')
    expect(result[0].entries).toHaveLength(2)
    expect(result[1].date).toBe('2026-03-17')
    expect(result[1].entries).toHaveLength(1)
  })

  it('sorts groups descending by date', () => {
    const entries = [
      { id: 1, startTime: new Date('2026-03-15T10:00:00').getTime() },
      { id: 2, startTime: new Date('2026-03-17T10:00:00').getTime() },
    ]
    const result = groupEntriesByDay(entries)
    expect(result[0].date).toBe('2026-03-17')
    expect(result[1].date).toBe('2026-03-15')
  })
})
