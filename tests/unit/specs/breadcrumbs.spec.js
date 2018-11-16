import {
  shallowMount
} from '@vue/test-utils'

import component from '@/components/app/breadcrumbs'

describe('breadcrumbs.vue', () => {
  const wrapper = shallowMount(component)
  it('should render correct contents', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('should show items array', () => {
    wrapper.setProps({ items: [
      { text: 'one' },
      { text: 'two' }
    ] })
    expect(wrapper).toMatchSnapshot()
  })
})
