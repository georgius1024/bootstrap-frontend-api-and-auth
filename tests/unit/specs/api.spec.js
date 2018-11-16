'use strict'
import mockAxios from '../mocks/axios.mock'
import Api from '@/api'
import config from '@/config'
import eventBus from '@/event-bus'
Api.http = mockAxios

const tokens = {
  oldAccessToken: '100',
  oldRefreshToken: '100',
  newAccessToken: 'new-access-token',
  newRefeshToken: 'new-refresh-token'
}

const securedEndPoint = (request) => {
  if (request.url === 'bad-request') {
    return mockAxios.error({
      message: 'Not found'
    }, 404)
  }
  if (request.url === 'impossible') {
    return mockAxios.error({
      message: 'Shall not pass!!!'
    }, 401)
  }
  if (request.url === Api.refreshEndPoint && request.method === 'post') { // Запрос на обновление
    if (request.data.token === tokens.oldRefreshToken) { // Пришла правильная refreshToken
      // Возвращаем новые токены
      return mockAxios.success({
        auth: {
          accessToken: tokens.newAccessToken,
          refreshToken: tokens.newRefeshToken
        }
      })
    } else {
      // Возвращаем 401
      return mockAxios.error({
        message: 'Невозможно обновить токен, перелогиньтесь, пожалуйста'
      }, 401)
    }
  } else {
    if (Api.http.defaults.headers.common['Authorization'] === 'Bearer ' + tokens.newAccessToken) {
      // Запрос пришел с правильным токеном
      return mockAxios.success({
        message: 'OK'
      })
    } else {
      // Неправильный токен
      return mockAxios.error({
        message: 'Authentication Error'
      }, 401)
    }
  }
}

describe('Api client', () => {
  it('Can set Base Url', () => {
    Api.setBaseUrl(config.API_URL)
    expect(Api.http.defaults.baseURL).toBe(config.API_URL)
  })

  it('Can set accessToken', () => {
    Api.setAccessToken(tokens.oldAccessToken)
    expect(Api.http.defaults.headers.common['Authorization']).toBe('Bearer ' + tokens.oldAccessToken)
  })

  it('Can set refreshToken', () => {
    Api.setRefreshToken(tokens.oldRefreshToken)
    expect(Api.refreshToken).toBe(tokens.oldRefreshToken)
  })

  it('Can set setRefreshEndpoint', () => {
    const old = Api.refreshEndPoint
    Api.setRefreshEndpoint('-')
    expect(Api.refreshEndPoint).toBe('-')
    Api.setRefreshEndpoint(old)
  })

  it('Can clear token', () => {
    Api.clearAccessToken()
    expect(Api.http.defaults.headers.common['Authorization']).toBeFalsy()
  })

  it('Can send request with various methods and recieve response', async () => {
    const methods = ['get', 'post', 'put', 'delete']
    const returnData = {
      data: 'Some data',
      status: 'success',
      message: '123'
    }
    mockAxios.intercept = () => {
      return mockAxios.success(returnData)
    }
    await Promise.all(methods.map(async (method) => {
      const x = await Api[method]('about')
      expect(x).toBeTruthy()
      expect(x).toBe(returnData)
      expect(Api.message).toBe(returnData.message)
      expect(Api.status).toBe(200)
    }))
  })
  it('Can emit message event', async () => {
    const messageCallback = jest.fn()
    eventBus.on(eventBus.events.message, messageCallback)

    const message = 'Api-Message'
    mockAxios.intercept = () => {
      return mockAxios.success({
        message
      })
    }
    await Api.get('about')
    expect(messageCallback).toBeCalled()
    expect(messageCallback).toBeCalledWith(message)
    eventBus.off(eventBus.events.message, messageCallback)
  })

  it('Can hande network error', async () => {
    const errorCallback = jest.fn()
    eventBus.on(eventBus.events.error, errorCallback)
    mockAxios.intercept = () => {
      // eslint-disable-next-line
      return Promise.reject({
        code: 'ECONNREFUSED'
      })
    }
    try {
      await Api.get('about')
    } catch (error) {
      expect(error.code).toBe('ECONNREFUSED')
    }
    expect(Api.message).toBe('Пропала связь с сервером')
    expect(Api.status).toBe('')
    expect(Api.error.code).toBe('ECONNREFUSED')
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(Api.message)
    eventBus.off(eventBus.events.error, errorCallback)
  })

  it('Can hande server error', async () => {
    const errorCallback = jest.fn()
    eventBus.on(eventBus.events.error, errorCallback)
    const message = 'Api-error'
    mockAxios.intercept = () => {
      return mockAxios.error({
        status: 'error',
        message
      }, 500)
    }
    try {
      await Api.get('about')
    } catch (error) {
      expect(error.response).toBeTruthy()
    }
    expect(Api.message).toBe(message)
    expect(Api.status).toBe(500)
    expect(errorCallback).toBeCalled()
    expect(errorCallback).toBeCalledWith(Api.message)
    eventBus.off(eventBus.events.error, errorCallback)
  })
  it('Can get access with valid access token', async () => {
    Api.setAccessToken(tokens.newAccessToken)
    mockAxios.intercept = securedEndPoint
    await Api.get('about')
    expect(Api.message).toBe('OK')
    expect(Api.status).toBe(200)
  })

  it('Can not get access without valid access token', async () => {
    Api.setAccessToken(tokens.oldAccessToken)
    Api.clearRefreshToken() // Не используктся refreshToken
    mockAxios.intercept = securedEndPoint
    try {
      await Api.get('about')
    } catch (error) {
      expect(error.response).toBeTruthy()
    }
    expect(Api.message).toBe('Authentication Error')
    expect(Api.status).toBe(401)
  })

  it('Can restore access with valid refresh token', async () => {
    try {
      Api.setAccessToken(tokens.oldAccessToken)
      Api.setRefreshToken(tokens.oldRefreshToken)
      await Api.get('about')
      expect(Api.message).toBe('OK')
      expect(Api.status).toBe(200)
      expect(Api.accessToken).toBe(tokens.newAccessToken)
      expect(Api.refreshToken).toBe(tokens.newRefeshToken)
    } catch (error) {
      console.error(error)
    }
  })

  it('Can not restore access with invalid refresh token', async () => {
    Api.setAccessToken(tokens.oldAccessToken)
    Api.setRefreshToken('Wrong token')

    expect(Api.accessToken).toBe(tokens.oldAccessToken)
    expect(Api.http.defaults.headers.common['Authorization']).toBe('Bearer ' + Api.accessToken)

    try {
      await Api.get('about')
    } catch (error) {
      expect(error.response).toBeTruthy()
      expect(error.response.status).toBe(401)
    }
    expect(Api.message).toBe('Невозможно обновить токен, перелогиньтесь, пожалуйста')
    expect(Api.status).toBe(401)
  })

  it('Can handle 404 error', async () => {
    try {
      await Api.get('bad-request')
    } catch (error) {
      expect(error.response).toBeTruthy()
      expect(error.response.status).toBe(404)
    }
    expect(Api.message).toBe('Not found')
    expect(Api.status).toBe(404)
  })

  it('If restore fails, it can return last error', async () => {
    Api.setAccessToken(tokens.oldAccessToken)
    Api.setRefreshToken(tokens.oldRefreshToken)

    expect(Api.accessToken).toBe(tokens.oldAccessToken)
    expect(Api.http.defaults.headers.common['Authorization']).toBe('Bearer ' + Api.accessToken)

    try {
      await Api.get('impossible')
    } catch (error) {
      expect(error.response).toBeTruthy()
      expect(error.response.status).toBe(401)
    }
    expect(Api.message).toBe('Shall not pass!!!')
    expect(Api.status).toBe(401)
  })
})
