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

import view from '@/views/login'

api.http = mockAxios

const localVue = createLocalVue()
localVue.use(store)
localVue.use(router)

const fakeEmail = '123-login@host.nowhere'
const fakePassword = '123-password'

describe('Login.vue', () => {
  let wrapper, loginCallback, errorCallback, messageCallback, credentialsCallback, busyCallback, idleCallback

  beforeAll(async () => {
    wrapper = shallowMount(view, {
      localVue,
      router,
      store
    })
  })

  beforeEach(() => {
    loginCallback = jest.fn()
    errorCallback = jest.fn()
    messageCallback = jest.fn()
    credentialsCallback = jest.fn()
    busyCallback = jest.fn()
    idleCallback = jest.fn()

    eventBus.on(eventBus.events.login, loginCallback)
    eventBus.on(eventBus.events.credentials, credentialsCallback)
    eventBus.on(eventBus.events.error, errorCallback)
    eventBus.on(eventBus.events.message, messageCallback)
    eventBus.on(eventBus.events.busy, busyCallback)
    eventBus.on(eventBus.events.idle, idleCallback)
  })

  it('should start with default empty data', async () => {
    const sample = { active: 0, email: '', password: ''}
    const { active, password, email } = wrapper.vm
    const x = { active, password, email }
    expect(x).toEqual(sample)
  })

  it('Can not reset password with empty email', async () => {
    const email = ''
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'error',
      'message': 'Неправильный адрес электронной почты'
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/reset/' + email,
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.resetPassword()
    await flushPromises()

    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
  })

  it('Can not reset password with wrong email', async () => {
    const email = 'wrong!'
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'error',
      'message': 'Неправильный адрес электронной почты'
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/reset/' + email,
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.resetPassword()
    await flushPromises()

    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
  })

  it('Can reset password with proper email', async () => {
    const email = 'perfect@e-ma.il'
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'success',
      'message': `Сейчас на Ваш адрес "${email}" придет письмо со ссылкой для установким нового пароля. Если письмо не придет в течении 10 минут, проверьте папку "Спам"`
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/reset/' + email,
        method: 'post'
      })
      return Promise.resolve({
        status: 200,
        data: returnData
      })
    }
    await wrapper.vm.resetPassword()
    await flushPromises()

    expect(errorCallback).not.toBeCalled()
    expect(messageCallback).toBeCalled()
    expect(messageCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()

    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('Can not login passwordless with empty email', async () => {
    const email = ''
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'error',
      'message': 'Неправильный адрес электронной почты'
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/passwordless/' + email,
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.loginPasswordless()
    await flushPromises()

    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
  })

  it('Can not login passwordless with wrong email', async () => {
    const email = 'wrong!'
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'error',
      'message': 'Неправильный адрес электронной почты'
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/passwordless/' + email,
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.loginPasswordless()
    await flushPromises()

    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
  })

  it('Can login passwordless with proper email', async () => {
    const email = 'perfect@e-ma.il'
    wrapper.setData({
      email
    })
    const returnData = {
      'status': 'success',
      'message': `Сейчас на Ваш адрес "${email}" придет письмо со ссылкой для входа. Если письмо не придет в течении 10 минут, проверьте папку "Спам"`
    }
    expect(wrapper.vm.email).toEqual(email)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/passwordless/' + email,
        method: 'post'
      })
      return Promise.resolve({
        status: 200,
        data: returnData
      })
    }
    await wrapper.vm.loginPasswordless()
    await flushPromises()

    expect(errorCallback).not.toBeCalled()
    expect(messageCallback).toBeCalled()
    expect(messageCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()

    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('Can not login with empty login', async () => {
    wrapper.setData({
      email: '',
      password: fakePassword
    })
    const returnData = {
      'status': 'error',
      'message': 'Требуется логин и пароль'
    }
    expect(wrapper.vm.email).toEqual('')
    expect(wrapper.vm.password).toEqual(fakePassword)
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/login',
        data: { email: '', password: fakePassword },
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.loginTraditional()
    await flushPromises()

    // Эта функция была вызвана
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('Can not login with empty password', async () => {
    wrapper.setData({
      email: fakeEmail,
      password: ''
    })
    const returnData = {
      'status': 'error',
      'message': 'Требуется логин и пароль'
    }
    expect(wrapper.vm.email).toEqual(fakeEmail)
    expect(wrapper.vm.password).toEqual('')
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/login',
        data: { email: fakeEmail, password: '' },
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.loginTraditional()
    await flushPromises()

    // Эта функция была вызвана
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('Can not login with wrong password', async () => {
    wrapper.setData({
      email: fakeEmail,
      password: 'wrong!'
    })
    const returnData = {
      'status': 'error',
      'message': 'Неправильно введен пароль или логин'
    }
    expect(wrapper.vm.email).toEqual(fakeEmail)
    expect(wrapper.vm.password).toEqual('wrong!')
    mockAxios.intercept = (request) => {
      // eslint-disable-next-line
      expect(request).toEqual({
        url: 'auth/login',
        data: { email: fakeEmail, password: 'wrong!' },
        method: 'post'
      })
      // eslint-disable-next-line
      return Promise.reject({
        response: {
          status: 404,
          data: returnData
        }
      })
    }
    await wrapper.vm.loginTraditional()
    await flushPromises()

    // Эта функция была вызвана
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('Can successfully login with valid credentials', async () => {
    wrapper.setData({
      email: fakeEmail,
      password: fakePassword
    })
    expect(wrapper.vm.email).toEqual(fakeEmail)
    expect(wrapper.vm.password).toEqual(fakePassword)
    const returnData = {
      'status': 'success',
      'data': {
        'name': 'Иванов Богдан Эдуардович',
        'id': 971,
        'email': 'sir-georgius@yandex.ru',
        'role': 'user',
        'status': 'active'
      },
      'auth': {
        'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNob3J0TmFtZSI6ItCY0LLQsNC90L7QsiDQkS4g0K0uIiwiZnVsbE5hbWUiOiLQmNCy0LDQvdC-0LIg0JHQvtCz0LTQsNC9INCt0LTRg9Cw0YDQtNC-0LLQuNGHIiwibGFzdE5hbWUiOiLQmNCy0LDQvdC-0LIiLCJmaXJzdE5hbWUiOiLQkdC-0LPQtNCw0L0iLCJtaWRkbGVOYW1lIjoi0K3QtNGD0LDRgNC00L7QstC40YciLCJpZCI6OTcxLCJ1c2VyTmFtZSI6InRlc3QtYWRtaW4iLCJlbWFpbCI6InNpci1nZW9yZ2l1c0B5YW5kZXgucnUiLCJwb3NpdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiT3JnYW5pemF0aW9uIjp7ImlkIjozNTIsIm5hbWUiOiLQotC10YHRgtC-0LLQsNGPINC-0YDQs9Cw0L3QuNC30LDRhtC40Y8iLCJwYXRoIjoi0JLQvdC1INGI0YLQsNGC0LAv0LrQsNC90LTQuNC00LDRgtGLL9Ci0LXRgdGC0L7QstCw0Y8g0L7RgNCz0LDQvdC40LfQsNGG0LjRjyIsInBhcmVudHMiOlszXX0sIkFjY2Vzc1JvbGUiOnsiaWQiOjEsIm5hbWUiOiLQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgNGLIiwicm9sZSI6MTB9LCJGdW5jdGlvbmFsUm9sZSI6eyJpZCI6MjMsIm5hbWUiOiLQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9C1INGC0LXRhdC90L7Qu9C-0LPQuNC4In0sIlRlYW1zIjpbXSwiaXNBZG1pbiI6dHJ1ZSwiY2FuVGVzdGluZyI6dHJ1ZSwiY2FuVmlld1Rlc3RpbmdSZXN1bHRzIjp0cnVlLCJjYW5WaWV3VGVzdGluZ0Vycm9ycyI6dHJ1ZX0sImp0aSI6IjJjOGU1ZWQwLWQ2OTEtMTFlOC1hNDU4LTY3ZGUwOGRmOTUyNSIsImlhdCI6MTU0MDI3Nzk2NCwiZXhwIjoxNTQwMzM3OTY0fQ.pWpUOULUbET0Z9FS1Tgq_thOUsEG2dEzVh7bqNrtX1Y',
        'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYzhlNWVkMS1kNjkxLTExZTgtYTQ1OC02N2RlMDhkZjk1MjUiLCJpYXQiOjE1NDAyNzc5NjQsImV4cCI6OTMxNjI3Nzk2NH0.IWPVxkOSshyM94G6wyu6rbKjyyACV8TdkgOl2krih74'
      },
      'message': 'Здравствуйте, Иванов Богдан Эдуардович'
    }
    mockAxios.intercept = (request) => {
      expect(request).toEqual({
        url: 'auth/login',
        data: { email: fakeEmail, password: fakePassword },
        method: 'post'
      })
      return Promise.resolve({
        status: 200,
        data: returnData
      })
    }

    await wrapper.vm.loginTraditional()
    await flushPromises()

    expect(loginCallback).toBeCalled()
    expect(credentialsCallback).toBeCalled()
    expect(loginCallback).toBeCalledWith(returnData.data)
    expect(credentialsCallback).toBeCalledWith(returnData.auth)
    // Ошибки не было
    expect(errorCallback).not.toBeCalled()

    expect(router.history.current.name).toBe('root')
  })

  afterEach(async () => {
    eventBus.off(eventBus.events.login, loginCallback)
    eventBus.off(eventBus.events.credentials, credentialsCallback)
    eventBus.off(eventBus.events.error, errorCallback)
    eventBus.off(eventBus.events.message, messageCallback)
    eventBus.off(eventBus.events.busy, busyCallback)
    eventBus.off(eventBus.events.idle, idleCallback)
  })
})
