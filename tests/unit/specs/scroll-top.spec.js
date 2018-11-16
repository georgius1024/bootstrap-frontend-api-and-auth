import {
  shallowMount
} from '@vue/test-utils'

import Component from '@/components/app/scroll-top'

describe('footer.vue', () => {
  const wrapper = shallowMount(Component, {
    propsData: {
      right: 100,
      bottom: 100,
      speed: 20
    }
  })
  it('should render correct props', () => {
    expect(wrapper.props().right).toBe(100)
    expect(wrapper.props().bottom).toBe(100)
    expect(wrapper.props().speed).toBe(20)
  })
  it('component\'s ScrollObserver works', () => {
    window.scrollY = 100
    wrapper.vm.scrollObserver()
    expect(wrapper.vm.visible).toBeTruthy()
    window.scrollY = 0
    wrapper.vm.scrollObserver()
    expect(wrapper.vm.visible).toBeFalsy()
  })

  it('really scrolls to top', async () => {
    const mockScroll = jest.fn()
    window.scrollBy = function scrolBy (dX, dY) {
      window.scrollY += dY
      mockScroll(dY)
    }
    jest.useFakeTimers()
    window.scrollY = 100
    wrapper.vm.scrollTop()
    jest.runTimersToTime(1000)
    expect(mockScroll.mock.calls.length).toBe(5)
  })
})
