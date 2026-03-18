import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useTimer } from '../../composables/useTimer.js'
import { createMockDb } from '../mockDb.js'

function withSetup(composableFn) {
  let result
  const Wrapper = defineComponent({
    setup() {
      result = composableFn()
      return {}
    },
    render() {
      return h('div')
    },
  })
  const wrapper = mount(Wrapper)
  return { result, wrapper }
}

describe('useTimer', () => {
  let db

  beforeEach(() => {
    db = createMockDb()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with isRunning false and elapsed 0', () => {
    const { result } = withSetup(() => useTimer(null, db))
    expect(result.isRunning.value).toBe(false)
    expect(result.elapsed.value).toBe(0)
  })

  it('start() sets isRunning true and writes to activeTimer', async () => {
    const { result } = withSetup(() => useTimer(null, db))
    await result.start()
    expect(result.isRunning.value).toBe(true)
    expect(db.activeTimer.put).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    )
  })

  it('stop() sets isRunning false and adds entry to timeEntries', async () => {
    const { result } = withSetup(() => useTimer(null, db))
    await result.start()
    await result.stop()
    expect(result.isRunning.value).toBe(false)
    expect(db.timeEntries.add).toHaveBeenCalledOnce()
    expect(db.activeTimer.delete).toHaveBeenCalledWith(1)
  })

  it('stop() calls onStop callback', async () => {
    const onStop = vi.fn()
    const { result } = withSetup(() => useTimer(onStop, db))
    await result.start()
    await result.stop()
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('stop() is a no-op when not running', async () => {
    const { result } = withSetup(() => useTimer(null, db))
    await result.stop()
    expect(db.timeEntries.add).not.toHaveBeenCalled()
  })

  it('elapsed ticks after start', async () => {
    const { result } = withSetup(() => useTimer(null, db))
    await result.start()
    vi.advanceTimersByTime(3000)
    expect(result.elapsed.value).toBeGreaterThanOrEqual(3000)
  })

  it('loadActiveTimer restores running state from db', async () => {
    const now = Date.now()
    await db.activeTimer.put({ id: 1, description: 'restored', project: 'work', startTime: now - 5000 })
    const { result } = withSetup(() => useTimer(null, db))
    // onMounted fires synchronously in mount
    await Promise.resolve()
    expect(result.isRunning.value).toBe(true)
    expect(result.description.value).toBe('restored')
    expect(result.elapsed.value).toBeGreaterThanOrEqual(5000)
  })
})
