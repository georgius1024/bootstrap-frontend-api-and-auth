
import Message from '@/components/app/message'
import {
  mount,
  shallowMount
} from '@vue/test-utils'

const message = 'olololololo!'
describe('message.vue', () => {
  jest.useFakeTimers()
  const propsData = {
    level: '',
    message: '',
    value: false
  }

  it('Accept message property', () => {
    const wrapper = shallowMount(Message, { propsData })
    const element = wrapper.find('vsnackbar-stub')
    wrapper.setProps({ message })
    expect(element.html()).toContain(message)
    wrapper.setProps({ value: true })
  })

  it('Accept level property', () => {
    const wrapper = shallowMount(Message, { propsData })
    wrapper.setProps({ level: 'error' })
    const element = wrapper.find('vsnackbar-stub')
    expect(element.attributes().color).toBe('error')
    wrapper.setProps({ level: '' })
    expect(element.attributes().color).toBe('info')
  })

  it('Accept timeout property', () => {
    const wrapper = shallowMount(Message, { propsData })
    wrapper.setProps({ timeout: 10000 })
    const element = wrapper.find('vsnackbar-stub')
    expect(element.attributes().timeout).toBe('10000')
  })

  it('should show and hide by manipulation with input property', () => {
    const wrapper = shallowMount(Message, { propsData })
    expect(wrapper.attributes().value).toBeFalsy()
    wrapper.setProps({ message: message, timeout: 10000, value: true })
    expect(wrapper.attributes().value).toBeTruthy()
    wrapper.setProps({ value: false })
    expect(wrapper.attributes().value).toBeFalsy()
  })

  it('should close after timeout', () => {
    jest.useFakeTimers()
    const wrapper = mount(Message, { propsData })
    expect(wrapper.html()).toBeFalsy()
    wrapper.setProps({ message: message, timeout: 10, value: true })
    expect(wrapper.html()).toBeTruthy()
    jest.runTimersToTime(12)
    expect(wrapper.html()).toBeFalsy()
  })

  it('should emit input(false) on button click', () => {
    const wrapper = shallowMount(Message, { propsData })
    wrapper.setProps({ message: message, value: true })
    wrapper.find('vbtn-stub').trigger('click')
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input.length).toBe(1)
    expect(wrapper.emitted().input[0][0]).toBe(false)
  })
})
