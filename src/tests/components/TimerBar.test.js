import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimerBar from '../../components/TimerBar.vue'

const defaultProps = {
  isRunning: false,
  elapsed: 0,
  modelDescription: '',
  modelProject: '',
  filterProjects: () => [],
}

describe('TimerBar', () => {
  it('shows "Start" button when not running', () => {
    const wrapper = mount(TimerBar, { props: defaultProps })
    expect(wrapper.find('.timer-btn').text()).toBe('Start')
    expect(wrapper.find('.timer-btn').classes()).toContain('start')
  })

  it('shows "Stop" button when running', () => {
    const wrapper = mount(TimerBar, { props: { ...defaultProps, isRunning: true } })
    expect(wrapper.find('.timer-btn').text()).toBe('Stop')
    expect(wrapper.find('.timer-btn').classes()).toContain('stop')
  })

  it('emits "start" when Start button clicked', async () => {
    const wrapper = mount(TimerBar, { props: defaultProps })
    await wrapper.find('.timer-btn').trigger('click')
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('emits "stop" when Stop button clicked', async () => {
    const wrapper = mount(TimerBar, { props: { ...defaultProps, isRunning: true } })
    await wrapper.find('.timer-btn').trigger('click')
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('displays formatted elapsed time', () => {
    const wrapper = mount(TimerBar, { props: { ...defaultProps, elapsed: 3661000 } })
    expect(wrapper.find('.timer-display').text()).toBe('01:01:01')
  })

  it('timer-display has "running" class when isRunning', () => {
    const wrapper = mount(TimerBar, { props: { ...defaultProps, isRunning: true } })
    expect(wrapper.find('.timer-display').classes()).toContain('running')
  })
})
