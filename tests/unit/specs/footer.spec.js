import {
  shallowMount
} from '@vue/test-utils'

import Footer from '@/components/app/footer'

describe('footer.vue', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(Footer, {
      propsData: {
        location: 'LOCATION-NAME',
        userName: 'USER-NAME'
      }
    })
    expect(wrapper.html()).toContain('LOCATION-NAME')
    expect(wrapper.html()).toContain('USER-NAME')
    expect(wrapper.element).toMatchSnapshot()
  })
})
