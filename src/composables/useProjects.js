import { computed } from 'vue'

export function useProjects(entries) {
  const projects = computed(() => {
    const map = {}
    for (const entry of entries.value) {
      const name = entry.project
      if (!name) continue
      if (!map[name]) map[name] = 0
      map[name] += (entry.endTime || Date.now()) - entry.startTime
    }
    return Object.entries(map)
      .map(([name, totalMs]) => ({ name, totalMs }))
      .sort((a, b) => b.totalMs - a.totalMs)
  })

  const projectNames = computed(() => projects.value.map((p) => p.name))

  function filterProjects(query) {
    const q = query.toLowerCase()
    return projectNames.value.filter((name) => name.toLowerCase().includes(q))
  }

  return { projects, projectNames, filterProjects }
}
