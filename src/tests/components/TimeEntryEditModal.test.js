import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeEntryEditModal from '../../components/TimeEntryEditModal.vue'

const entry = {
  id: 7,
  description: '#work fix bug',
  project: 'work',
  startTime: new Date('2026-03-18T10:00:00').getTime(),
  endTime: new Date('2026-03-18T11:00:00').getTime(),
}

describe('TimeEntryEditModal', () => {
  it('pre-fills description field', () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    expect(wrapper.find('input[type="text"]').element.value).toBe('#work fix bug')
  })

  it('pre-fills start and end datetime-local inputs', () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    const inputs = wrapper.findAll('input[type="datetime-local"]')
    expect(inputs[0].element.value).not.toBe('')
    expect(inputs[1].element.value).not.toBe('')
  })

  it('emits "close" on cancel click', async () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    await wrapper.find('.cancel-btn').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits "save" with correct payload on save click', async () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    await wrapper.find('.save-btn').trigger('click')
    const saved = wrapper.emitted('save')?.[0][0]
    expect(saved.id).toBe(7)
    expect(saved.description).toBe('#work fix bug')
    expect(saved.project).toBe('work')
    expect(typeof saved.startTime).toBe('number')
    expect(typeof saved.endTime).toBe('number')
  })

  it('extracts project from description on save', async () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    await wrapper.find('input[type="text"]').setValue('#design create mockups')
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('save')?.[0][0].project).toBe('design')
  })

  it('emits empty project when no hashtag in description', async () => {
    const wrapper = mount(TimeEntryEditModal, { props: { entry } })
    await wrapper.find('input[type="text"]').setValue('plain description')
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('save')?.[0][0].project).toBe('')
  })
})
