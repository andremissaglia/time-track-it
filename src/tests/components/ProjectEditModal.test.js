import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectEditModal from '../../components/ProjectEditModal.vue'

describe('ProjectEditModal', () => {
  it('pre-fills input with the project name', () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    expect(wrapper.find('input').element.value).toBe('work')
  })

  it('save button is disabled when input is unchanged', () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeDefined()
  })

  it('save button is disabled when input is empty', async () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    await wrapper.find('input').setValue('')
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeDefined()
  })

  it('save button is enabled when input has a new name', async () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    await wrapper.find('input').setValue('newWork')
    expect(wrapper.find('.save-btn').attributes('disabled')).toBeUndefined()
  })

  it('emits "save" with oldName and newName on save click', async () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    await wrapper.find('input').setValue('newWork')
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('save')?.[0][0]).toEqual({
      oldName: 'work',
      newName: 'newWork',
    })
  })

  it('emits "close" on cancel click', async () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    await wrapper.find('.cancel-btn').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('trims whitespace before emitting save', async () => {
    const wrapper = mount(ProjectEditModal, { props: { projectName: 'work' } })
    await wrapper.find('input').setValue('  newWork  ')
    await wrapper.find('.save-btn').trigger('click')
    expect(wrapper.emitted('save')?.[0][0].newName).toBe('newWork')
  })
})
