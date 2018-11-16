import {
  shallowMount
} from '@vue/test-utils'

import spinner from '@/components/app/spinner'

describe('loading-spinner.vue', () => {
  const wrapper = shallowMount(spinner)
  it('should render correct contents', () => {
    const div = wrapper.find('.spinner-control')
    expect(div.html()).toContain('vprogresscircular-stub')
    expect(div.attributes().style).toBe('display: none;')
  })
  it('should show when :loading is true', () => {
    wrapper.setProps({ active: true })
    const div = wrapper.find('.spinner-control')
    expect(div.attributes().style).toBe('')
  })
  it('should hide when :loading is false again', () => {
    wrapper.setProps({ active: false })
    const div = wrapper.find('.spinner-control')
    expect(div.attributes().style).toBe('display: none;')
  })

  it('should hide after timeout', () => {
    jest.useFakeTimers()

    const div = wrapper.find('.spinner-control')
    wrapper.setProps({ active: false })
    wrapper.setProps({ timeout: 10 })
    expect(wrapper.props().timeout).toBe(10)
    wrapper.setProps({ active: true })
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10)
    expect(div.attributes().style).toBe('')
    jest.runTimersToTime(12)
    expect(div.attributes().style).toBe('display: none;')
  })

})
