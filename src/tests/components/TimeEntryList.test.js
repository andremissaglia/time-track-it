import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeEntryList from '../../components/TimeEntryList.vue'

const entry = {
  id: 1,
  description: 'task',
  project: 'work',
  startTime: new Date('2026-03-18T10:00:00').getTime(),
  endTime: new Date('2026-03-18T11:00:00').getTime(),
}

describe('TimeEntryList', () => {
  it('shows empty state when no entries', () => {
    const wrapper = mount(TimeEntryList, { props: { groupedEntries: [] } })
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state').text()).toContain('No time entries')
  })

  it('does not show empty state when entries exist', () => {
    const wrapper = mount(TimeEntryList, {
      props: {
        groupedEntries: [{ date: '2026-03-18', entries: [entry] }],
        projectColorIndex: {},
      },
    })
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('renders one day-group per group', () => {
    const wrapper = mount(TimeEntryList, {
      props: {
        groupedEntries: [
          { date: '2026-03-18', entries: [entry] },
          { date: '2026-03-17', entries: [{ ...entry, id: 2 }] },
        ],
        projectColorIndex: {},
      },
    })
    expect(wrapper.findAll('.day-group')).toHaveLength(2)
  })

  it('passes delete event up', async () => {
    const wrapper = mount(TimeEntryList, {
      props: {
        groupedEntries: [{ date: '2026-03-18', entries: [entry] }],
        projectColorIndex: {},
      },
    })
    // Click delete once (confirming), then again (emit)
    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})
