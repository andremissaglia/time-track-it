import { describe, it, expect, beforeEach } from 'vitest'
import { useTimeEntries } from '../../composables/useTimeEntries.js'
import { createMockDb } from '../mockDb.js'

describe('useTimeEntries', () => {
  let db

  beforeEach(() => {
    db = createMockDb()
  })

  it('loadEntries populates entries and groupedEntries', async () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    db.timeEntries._seed([
      { project: 'work', startTime: ts, endTime: ts + 3600000, description: 'task' },
    ])
    const { entries, groupedEntries, loadEntries } = useTimeEntries(db)
    await loadEntries()
    expect(entries.value).toHaveLength(1)
    expect(groupedEntries.value).toHaveLength(1)
  })

  it('deleteEntry removes the entry and reloads', async () => {
    const ts = new Date('2026-03-18T10:00:00').getTime()
    db.timeEntries._seed([
      { id: 1, project: 'work', startTime: ts, endTime: ts + 1000, description: 'a' },
    ])
    const { entries, loadEntries, deleteEntry } = useTimeEntries(db)
    await loadEntries()
    expect(entries.value).toHaveLength(1)
    await deleteEntry(1)
    expect(entries.value).toHaveLength(0)
    expect(db.timeEntries.delete).toHaveBeenCalledWith(1)
  })

  it('renameProject does nothing when new name is empty', async () => {
    const { renameProject } = useTimeEntries(db)
    await renameProject('work', '')
    expect(db.timeEntries.where).not.toHaveBeenCalled()
  })

  it('renameProject does nothing when new name equals old name', async () => {
    const { renameProject } = useTimeEntries(db)
    await renameProject('work', 'work')
    expect(db.timeEntries.where).not.toHaveBeenCalled()
  })

  it('renameProject calls modify with new project name', async () => {
    const { renameProject } = useTimeEntries(db)
    await renameProject('work', 'newWork')
    expect(db.timeEntries.where).toHaveBeenCalledWith('project')
  })

  it('importData strips id and calls bulkAdd', async () => {
    const data = [
      { id: 99, project: 'imported', startTime: 1000, endTime: 2000, description: 'x' },
    ]
    const { importData } = useTimeEntries(db)
    await importData(JSON.stringify(data))
    expect(db.timeEntries.bulkAdd).toHaveBeenCalledWith([
      { project: 'imported', startTime: 1000, endTime: 2000, description: 'x' },
    ])
  })

  it('clearAll empties both tables', async () => {
    const { clearAll } = useTimeEntries(db)
    await clearAll()
    expect(db.timeEntries.clear).toHaveBeenCalled()
    expect(db.activeTimer.clear).toHaveBeenCalled()
  })
})
