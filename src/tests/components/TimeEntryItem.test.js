import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeEntryItem from '../../components/TimeEntryItem.vue'

const entry = {
  id: 1,
  description: '#work fix bug',
  project: 'work',
  startTime: new Date('2026-03-18T10:00:00').getTime(),
  endTime: new Date('2026-03-18T11:00:00').getTime(),
}

describe('TimeEntryItem', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('renders the project tag', () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: { work: 0 } },
    })
    expect(wrapper.find('.project-tag').text()).toBe('work')
  })

  it('strips hashtags from description', () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    expect(wrapper.find('.entry-desc').text()).toBe('fix bug')
  })

  it('shows "No description" when description is only hashtag', () => {
    const wrapper = mount(TimeEntryItem, {
      props: {
        entry: { ...entry, description: '#work' },
        projectColorIndex: {},
      },
    })
    expect(wrapper.find('.entry-desc').text()).toBe('No description')
  })

  it('emits "replay" when replay button clicked', async () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    await wrapper.find('.play-btn').trigger('click')
    expect(wrapper.emitted('replay')?.[0][0]).toEqual(entry)
  })

  it('emits "edit" when edit button clicked', async () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    await wrapper.find('.edit-btn').trigger('click')
    expect(wrapper.emitted('edit')?.[0][0]).toEqual(entry)
  })

  it('first delete click enters confirming state', async () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.find('.delete-btn').text()).toBe('Confirm?')
    expect(wrapper.find('.delete-btn').classes()).toContain('confirming')
  })

  it('second delete click emits "delete" with entry id', async () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click') // enter confirming
    await wrapper.find('.delete-btn').trigger('click') // confirm
    expect(wrapper.emitted('delete')?.[0][0]).toBe(1)
  })

  it('confirming state auto-resets after 3 seconds', async () => {
    const wrapper = mount(TimeEntryItem, {
      props: { entry, projectColorIndex: {} },
    })
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.find('.delete-btn').classes()).toContain('confirming')
    vi.advanceTimersByTime(3001)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.delete-btn').classes()).not.toContain('confirming')
  })
})
