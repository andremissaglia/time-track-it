import { computed } from 'vue'

function getWeekStart(timestamp) {
  const d = new Date(timestamp)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getPeriodKey(timestamp, granularity) {
  const d = new Date(timestamp)
  if (granularity === 'days') {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } else if (granularity === 'weeks') {
    const monday = getWeekStart(timestamp)
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
  } else {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
}

function formatPeriodLabel(key, granularity) {
  if (granularity === 'days') {
    const d = new Date(key + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else if (granularity === 'weeks') {
    const start = new Date(key + 'T00:00:00')
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const s = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const e = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${s}–${e}`
  } else {
    const d = new Date(key + '-01T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}

export function useReports(entries, granularity) {
  const reportData = computed(() => {
    const matrix = {}
    const periodSet = new Set()
    const projectSet = new Set()
    const projectTotals = {}
    const periodTotals = {}
    let grandTotal = 0

    for (const entry of entries.value) {
      if (!entry.endTime) continue
      const duration = entry.endTime - entry.startTime
      if (duration <= 0) continue

      const project = entry.project || '(no project)'
      const periodKey = getPeriodKey(entry.startTime, granularity.value)

      periodSet.add(periodKey)
      projectSet.add(project)

      if (!matrix[project]) matrix[project] = {}
      matrix[project][periodKey] = (matrix[project][periodKey] || 0) + duration
      projectTotals[project] = (projectTotals[project] || 0) + duration
      periodTotals[periodKey] = (periodTotals[periodKey] || 0) + duration
      grandTotal += duration
    }

    const periods = [...periodSet].sort()
    const periodLabels = periods.map(k => formatPeriodLabel(k, granularity.value))
    const projects = [...projectSet].sort((a, b) => (projectTotals[b] || 0) - (projectTotals[a] || 0))

    return { matrix, periods, periodLabels, projects, projectTotals, periodTotals, grandTotal }
  })

  return { reportData }
}
