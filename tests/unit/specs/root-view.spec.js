import {
  shallowMount
} from '@vue/test-utils'

import router from '@/router'
import view from '@/views/root'

describe('root-view.vue', () => {
  it('should render correct contents ', async () => {
    const wrapper = shallowMount(view, {
      router
    })
    expect(wrapper).toMatchSnapshot()
  })
})
