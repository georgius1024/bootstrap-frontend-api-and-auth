import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'
import VueRouter from 'vue-router'
import Component from '@/components/layout/default'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

describe('default-layout.vue', () => {
  it('should render correct way', () => {
    const wrapper = shallowMount(Component, {
      localVue,
      router
    })
    expect(wrapper).toMatchSnapshot()
  })
})
