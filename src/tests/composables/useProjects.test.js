import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useProjects } from '../../composables/useProjects.js'

function makeEntries(list) {
  return ref(list)
}

describe('useProjects', () => {
  it('returns empty projects when no entries', () => {
    const { projects } = useProjects(makeEntries([]))
    expect(projects.value).toEqual([])
  })

  it('aggregates total time per project', () => {
    const entries = makeEntries([
      { project: 'work', startTime: 0, endTime: 3600000 },
      { project: 'work', startTime: 3600000, endTime: 7200000 },
      { project: 'play', startTime: 0, endTime: 1800000 },
    ])
    const { projects } = useProjects(entries)
    const work = projects.value.find((p) => p.name === 'work')
    const play = projects.value.find((p) => p.name === 'play')
    expect(work.totalMs).toBe(7200000)
    expect(play.totalMs).toBe(1800000)
  })

  it('sorts projects by total time descending', () => {
    const entries = makeEntries([
      { project: 'quick', startTime: 0, endTime: 1000 },
      { project: 'long', startTime: 0, endTime: 9000 },
    ])
    const { projects } = useProjects(entries)
    expect(projects.value[0].name).toBe('long')
    expect(projects.value[1].name).toBe('quick')
  })

  it('ignores entries without a project', () => {
    const entries = makeEntries([
      { project: '', startTime: 0, endTime: 1000 },
      { project: null, startTime: 0, endTime: 1000 },
    ])
    const { projects } = useProjects(entries)
    expect(projects.value).toHaveLength(0)
  })

  it('filterProjects is case-insensitive', () => {
    const entries = makeEntries([
      { project: 'MyProject', startTime: 0, endTime: 1000 },
      { project: 'other', startTime: 0, endTime: 1000 },
    ])
    const { filterProjects } = useProjects(entries)
    expect(filterProjects('myp')).toEqual(['MyProject'])
    expect(filterProjects('MY')).toEqual(['MyProject'])
  })

  it('projectColorIndex assigns lower indices to earlier first-seen times', () => {
    const entries = makeEntries([
      { project: 'second', startTime: 2000, endTime: 3000 },
      { project: 'first', startTime: 1000, endTime: 2000 },
    ])
    const { projectColorIndex } = useProjects(entries)
    expect(projectColorIndex.value['first']).toBe(0)
    expect(projectColorIndex.value['second']).toBe(1)
  })
})
