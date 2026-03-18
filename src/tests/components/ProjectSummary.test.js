import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectSummary from '../../components/ProjectSummary.vue'

const projects = [
  { name: 'work', totalMs: 7200000 },
  { name: 'play', totalMs: 1800000 },
]

describe('ProjectSummary', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows empty state when no projects', () => {
    const wrapper = mount(ProjectSummary, { props: { projects: [] } })
    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('renders a row for each project', () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: { work: 0, play: 1 } },
    })
    expect(wrapper.findAll('.project-row')).toHaveLength(2)
  })

  it('emits "select-project" on row click', async () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {} },
    })
    await wrapper.find('.project-row').trigger('click')
    expect(wrapper.emitted('select-project')?.[0][0]).toBe('work')
  })

  it('emits "edit-project" on edit button click', async () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {} },
    })
    await wrapper.find('.edit-btn').trigger('click')
    expect(wrapper.emitted('edit-project')?.[0][0]).toBe('work')
  })

  it('first delete click enters confirming state', async () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.find('.delete-btn').classes()).toContain('confirming')
  })

  it('second delete click emits "delete-project"', async () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click') // confirming
    await wrapper.find('.delete-btn').trigger('click') // confirm
    expect(wrapper.emitted('delete-project')?.[0][0]).toBe('work')
  })

  it('confirming auto-resets after 3 seconds', async () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.find('.delete-btn').classes()).toContain('confirming')
    vi.advanceTimersByTime(3001)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.delete-btn').classes()).not.toContain('confirming')
  })

  it('marks selected project row with "selected" class', () => {
    const wrapper = mount(ProjectSummary, {
      props: { projects, projectColorIndex: {}, selectedProject: 'work' },
    })
    const rows = wrapper.findAll('.project-row')
    expect(rows[0].classes()).toContain('selected')
    expect(rows[1].classes()).not.toContain('selected')
  })
})
