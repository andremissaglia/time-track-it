import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../db.js'

export function useTimer(onStop) {
  const isRunning = ref(false)
  const description = ref('')
  const project = ref('')
  const startTime = ref(null)
  const elapsed = ref(0)

  let tickInterval = null

  function startTick() {
    stopTick()
    tickInterval = setInterval(() => {
      if (startTime.value) {
        elapsed.value = Date.now() - startTime.value
      }
    }, 1000)
  }

  function stopTick() {
    if (tickInterval) {
      clearInterval(tickInterval)
      tickInterval = null
    }
  }

  async function loadActiveTimer() {
    const active = await db.activeTimer.get(1)
    if (active) {
      description.value = active.description || ''
      project.value = active.project || ''
      startTime.value = active.startTime
      isRunning.value = true
      elapsed.value = Date.now() - active.startTime
      startTick()
    }
  }

  async function start() {
    const now = Date.now()
    startTime.value = now
    isRunning.value = true
    elapsed.value = 0
    await db.activeTimer.put({
      id: 1,
      description: description.value,
      project: project.value,
      startTime: now,
    })
    startTick()
  }

  async function stop() {
    if (!startTime.value) return
    const entry = {
      description: description.value,
      project: project.value,
      startTime: startTime.value,
      endTime: Date.now(),
      createdAt: Date.now(),
    }
    await db.timeEntries.add(entry)
    await db.activeTimer.delete(1)
    isRunning.value = false
    startTime.value = null
    elapsed.value = 0
    description.value = ''
    project.value = ''
    stopTick()
    if (onStop) onStop()
  }

  async function updateActiveTimer() {
    if (isRunning.value) {
      await db.activeTimer.put({
        id: 1,
        description: description.value,
        project: project.value,
        startTime: startTime.value,
      })
    }
  }

  onMounted(loadActiveTimer)
  onUnmounted(stopTick)

  return {
    isRunning,
    description,
    project,
    startTime,
    elapsed,
    start,
    stop,
    updateActiveTimer,
  }
}
