import Dexie from 'dexie'

export const db = new Dexie('TimeTrackIt')

db.version(1).stores({
  timeEntries: '++id, description, project, startTime, endTime, createdAt',
  activeTimer: 'id',
})
