import {
  shallowMount
} from '@vue/test-utils'
import view from '@/views/about'

describe('about.vue', () => {
  it('should render correct way async', async () => {
    const wrapper = shallowMount(view)
    expect(wrapper).toMatchSnapshot()
  })
})
