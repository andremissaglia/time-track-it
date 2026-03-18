import { ref } from 'vue'
import { db } from '../db.js'
import { groupEntriesByDay } from '../utils/time.js'

export function useTimeEntries() {
  const entries = ref([])
  const groupedEntries = ref([])

  async function loadEntries() {
    const all = await db.timeEntries.orderBy('startTime').reverse().toArray()
    entries.value = all
    groupedEntries.value = groupEntriesByDay(all)
  }

  async function deleteEntry(id) {
    await db.timeEntries.delete(id)
    await loadEntries()
  }

  async function updateEntry(id, changes) {
    await db.timeEntries.update(id, changes)
    await loadEntries()
  }

  async function deleteProject(projectName) {
    await db.timeEntries.where('project').equals(projectName).delete()
    await loadEntries()
  }

  async function renameProject(oldName, newName) {
    const trimmed = newName.trim()
    if (!trimmed || trimmed === oldName) return
    await db.timeEntries.where('project').equals(oldName).modify({ project: trimmed })
    await loadEntries()
  }

  async function clearAll() {
    await db.timeEntries.clear()
    await db.activeTimer.clear()
    await loadEntries()
  }

  async function exportData() {
    const all = await db.timeEntries.toArray()
    const json = JSON.stringify(all, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timetrackit-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importData(jsonStr) {
    const data = JSON.parse(jsonStr)
    const cleaned = data.map(({ id, ...rest }) => rest)
    await db.timeEntries.bulkAdd(cleaned)
    await loadEntries()
  }

  return {
    entries,
    groupedEntries,
    loadEntries,
    deleteEntry,
    deleteProject,
    renameProject,
    updateEntry,
    clearAll,
    exportData,
    importData,
  }
}
