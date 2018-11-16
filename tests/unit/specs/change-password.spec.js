import {
  createLocalVue,
  shallowMount
} from '@vue/test-utils'
import flushPromises from 'flush-promises'

import mockAxios from '../mocks/axios.mock'

import router from '@/router'
import store from '@/store'
import api from '@/api'
import eventBus from '@/event-bus'

import view from '@/views/change-password'

api.http = mockAxios

const localVue = createLocalVue()
localVue.use(store)
localVue.use(router)

const fakeOldPassword = '123-old-password'
const fakePassword = '123-password'

describe('change-password.vue', () => {
  let wrapper, errorCallback, messageCallback

  beforeAll(async () => {
    wrapper = shallowMount(view, {
      localVue,
      router,
      store
    })
  })

  beforeEach(() => {
    errorCallback = jest.fn()
    messageCallback = jest.fn()

    eventBus.on(eventBus.events.error, errorCallback)
    eventBus.on(eventBus.events.message, messageCallback)
  })

  it('should start with default empty data', async () => {
    // eslint-disable-next-line
    const sample = { old_password: '', password: '', password_retype: '' }
    // eslint-disable-next-line
    const { old_password, password, password_retype } = wrapper.vm
    // eslint-disable-next-line
    const x = { old_password, password, password_retype }
    expect(x).toEqual(sample)
  })

  it('Can set form values', async () => {
    // eslint-disable-next-line
    const sample = { old_password: fakeOldPassword, password: fakePassword, password_retype: '' }
    wrapper.setData(sample)
    // eslint-disable-next-line
    const { old_password, password, password_retype } = wrapper.vm
    // eslint-disable-next-line
    const x = { old_password, password, password_retype }
    expect(x).toEqual(sample)
  })

  it('can post values to Api', async () => {
    const sample = { old_password: fakeOldPassword, password: fakePassword, password_retype: '' }
    wrapper.setData(sample)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'private/change-password',
        data: sample,
        method: 'post'
      })
    }
    await wrapper.vm.changePassword()
    await flushPromises()
  })

  it('can handle errors posted from Api', async () => {
    const sample = { old_password: fakeOldPassword, password: fakePassword, password_retype: '' }
    wrapper.setData(sample)
    const returnData = {
      'status': 'error',
      'message': 'Пароль не совпал',
      errors: [{
        error: 'Пароль не совпал',
        field: 'password_retype'
      }]
    }

    mockAxios.intercept = (request) => {
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 422,
          data: returnData
        }
      })
    }
    await wrapper.vm.changePassword()
    await flushPromises()
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
  })

  it('can handle success posted from Api', async () => {
    const another = {
      id: 2,
      name: 'Another',
      status: 'reset'
    }
    store.commit('account/setUser', another)
    expect(store.getters['account/mustChangePassword']).toBeTruthy()
    // eslint-disable-next-line
    const sample = { old_password: fakeOldPassword, password: fakePassword, password_retype: fakePassword }
    wrapper.setData(sample)
    const returnData = {
      'status': 'success',
      'message': 'Пароль изменен'
    }

    mockAxios.intercept = (request) => {
      return Promise.resolve({
        status: 200,
        data: returnData
      })
    }
    await wrapper.vm.changePassword()
    await flushPromises()

    expect(errorCallback).not.toBeCalled()

    expect(messageCallback).toBeCalled()
    expect(messageCallback).toBeCalledWith(returnData.message)

    expect(store.getters['account/mustChangePassword']).toBeFalsy()
  })

  afterEach(async () => {
    eventBus.off(eventBus.events.error, errorCallback)
    eventBus.off(eventBus.events.message, messageCallback)
  })
})
