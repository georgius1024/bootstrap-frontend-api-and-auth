import mockAxios from '../mocks/axios.mock'
import Api from '@/api'
import eventBus from '@/event-bus'

import activator from '@/router/activator'

Api.http = mockAxios

describe('activator.js', () => {
  let loginCallback, errorCallback, messageCallback, credentialsCallback, busyCallback, idleCallback

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

  it('should be function', () => {
    expect(activator).toBeTruthy()
  })

  it('should send Api request', async () => {
    const hash = 'oxxxxxxx'

    const returnData = {
      'status': 'error',
      'message': 'Неверный код'
    }

    mockAxios.intercept = (request) => {
      return mockAxios.error(returnData, 422)
    }
    const x = await activator(hash)
    expect(x).toBeFalsy()
    expect(Api.status).toBe(422)
    expect(Api.message).toBe(returnData.message)
    expect(Api.request.url).toBe('auth/once/' + hash)
    expect(Api.request.method).toBe('get')

  })

  it('should show error when Api call return error', async () => {
    const userName = 'fake2'
    const expiresAt = new Date().getTime()
    const hash = 'oxxxxxxx'
    const action = 'login'
    const returnData = {
      'status': 'error',
      'message': 'Поврежденная ссылка'
    }

    mockAxios.intercept = (request) => {
      return mockAxios.error(returnData, 422)
    }
    const x = await activator(userName, expiresAt, hash, action)
    expect(x).toBeFalsy()

    // Эта функция была вызвана
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(returnData.message)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
    // Эти две - нет
    expect(loginCallback).not.toBeCalled()
    expect(credentialsCallback).not.toBeCalled()
  })

  it('should login user on Api success', async () => {
    const userName = 'fake3'
    const expiresAt = new Date().getTime()
    const hash = 'oxxxxxxx'
    const action = 'login'

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
      return Promise.resolve({
        status: 200,
        data: returnData
      })
    }
    const x = await activator(userName, expiresAt, hash, action)
    expect(x).toBeTruthy()

    expect(loginCallback).toBeCalled()
    expect(credentialsCallback).toBeCalled()
    expect(loginCallback).toBeCalledWith(returnData.data)
    expect(credentialsCallback).toBeCalledWith(returnData.auth)
    expect(busyCallback).toBeCalled()
    expect(idleCallback).toBeCalled()
    // Ошибки не было
    expect(errorCallback).not.toBeCalled()
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
