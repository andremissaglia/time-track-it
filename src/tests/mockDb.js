/**
 * In-memory mock of the Dexie db interface used by composables.
 * All methods are vi.fn() wrappers over real in-memory state so both
 * call assertions and functional correctness work.
 */
export function createMockDb() {
  let timeEntriesStore = []
  let activeTimerStore = {}
  let nextId = 1

  const timeEntries = {
    orderBy: vi.fn(() => ({
      reverse: vi.fn(() => ({
        toArray: vi.fn(async () => [...timeEntriesStore].reverse()),
      })),
    })),
    add: vi.fn(async (entry) => {
      const id = nextId++
      timeEntriesStore.push({ ...entry, id })
      return id
    }),
    delete: vi.fn(async (id) => {
      timeEntriesStore = timeEntriesStore.filter((e) => e.id !== id)
    }),
    update: vi.fn(async (id, changes) => {
      const idx = timeEntriesStore.findIndex((e) => e.id === id)
      if (idx !== -1) timeEntriesStore[idx] = { ...timeEntriesStore[idx], ...changes }
    }),
    where: vi.fn((field) => ({
      equals: vi.fn((value) => ({
        delete: vi.fn(async () => {
          timeEntriesStore = timeEntriesStore.filter((e) => e[field] !== value)
        }),
        modify: vi.fn(async (changes) => {
          timeEntriesStore = timeEntriesStore.map((e) =>
            e[field] === value ? { ...e, ...changes } : e
          )
        }),
      })),
    })),
    clear: vi.fn(async () => {
      timeEntriesStore = []
    }),
    toArray: vi.fn(async () => [...timeEntriesStore]),
    bulkAdd: vi.fn(async (items) => {
      for (const item of items) {
        timeEntriesStore.push({ ...item, id: nextId++ })
      }
    }),
    // test helper to seed data without going through add()
    _seed(items) {
      timeEntriesStore = items.map((item) => ({
        id: item.id ?? nextId++,
        ...item,
      }))
    },
    _all() {
      return timeEntriesStore
    },
  }

  const activeTimer = {
    get: vi.fn(async (id) => activeTimerStore[id] ?? null),
    put: vi.fn(async (record) => {
      activeTimerStore[record.id] = record
    }),
    delete: vi.fn(async (id) => {
      delete activeTimerStore[id]
    }),
    clear: vi.fn(async () => {
      activeTimerStore = {}
    }),
  }

  return { timeEntries, activeTimer }
}
