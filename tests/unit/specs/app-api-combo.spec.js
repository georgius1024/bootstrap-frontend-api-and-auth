// TODO DELETE THIS TEST
import {
  createLocalVue,
  shallowMount
} from '@vue/test-utils'

import mockAxios from '../mocks/axios.mock'
import Api from '@/api'
import router from '@/router'
import store from '@/store'

import App from '@/App'

// import Api from '@/api'
// import mockAxios from '../mocks/axios.mock'

const localVue = createLocalVue()
localVue.use(store)
localVue.use(router)

describe('App.vue', () => {
  Api.http = mockAxios
  mockAxios.intercept = (request) => {
    return Promise.resolve({
      status: 200,
      data: {
        data: {
          organization: 'test'
        }
      }
    })
  }

  it('should run', async () => {
    shallowMount(App, {
      localVue,
      router,
      store
    })
  })
  it('can call own methods without error', () => {
    let errorCnt = 0
    const wrapper = shallowMount(App, {
      localVue,
      router,
      store
    })

    try {
      wrapper.vm.timedOut()
      expect(wrapper.vm.message).toBe('Процесс завершился тайм-аутом')
      wrapper.vm.messageAction()
      wrapper.vm.errorAction()
      wrapper.vm.waitAction()
    } catch (error) {
      console.error(error)
      errorCnt += 1
    }
    expect(errorCnt).toBe(0)
  })
})
