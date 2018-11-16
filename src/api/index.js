'use strict'

import axios from 'axios'
import eventBus from '@/event-bus'

const Api = {
  http: axios,
  status: '',
  message: false,
  error: false,
  request: false,
  response: false,
  accessToken: '',
  refreshToken: '',
  refreshEndPoint: 'auth/refresh'
}

eventBus.on(eventBus.events.credentials, (auth) => {
  Api.setAccessToken(auth.accessToken)
  Api.setRefreshToken(auth.refreshToken)
})

eventBus.on(eventBus.events.logout, () => {
  Api.clearAccessToken()
  Api.clearRefreshToken()
})

Api.setBaseUrl = (url) => {
  Api.http.defaults.baseURL = url
}

Api.setAccessToken = (token) => {
  Api.accessToken = token
  Api.http.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

Api.clearAccessToken = () => {
  Api.accessToken = ''
  delete Api.http.defaults.headers.common['Authorization']
}

Api.setRefreshToken = (token) => {
  Api.refreshToken = token
}

Api.clearRefreshToken = () => {
  Api.refreshToken = ''
}

Api.setRefreshEndpoint = (url) => {
  Api.refreshEndPoint = url
}

Api._success = (response) => {
  Api.response = response
  Api.status = response.status
  eventBus.emit(eventBus.events.idle)
  if (response.data) {
    if (response.data.message) {
      eventBus.emit(eventBus.events.message, response.data.message)
      Api.message = response.data.message
    }
    if (response.data.auth) {
      eventBus.emit(eventBus.events.credentials, response.data.auth)
      Api.setAccessToken(response.data.auth.accessToken)
      Api.setRefreshToken(response.data.auth.refreshToken)
    }
  }
}

Api._error = (error) => {
  Api.message = error.message || 'Общая ошибка'
  if (Api.message === 'Network Error') {
    Api.message = 'Ошибка сети'
  }
  Api.status = 900
  eventBus.emit(eventBus.events.idle)
  if (error.response) {
    if (error.response.data && error.response.data.message) {
      Api.message = error.response.data.message
    }
    Api.status = error.response.status
  } else if (error.code === 'ECONNREFUSED') {
    Api.status = ''
    Api.message = 'Пропала связь с сервером'
  }
  Api.error = error
  Api.response = error.response
  eventBus.emit(eventBus.events.error, String(Api.message))

  if (Api.status === 401) { // На самом деле, пользователь не валидный
    eventBus.emit(eventBus.events.logout)
    Api.clearAccessToken()
    Api.clearRefreshToken()
  }
}

Api.execute = (request) => {
  return new Promise((resolve, reject) => {
    eventBus.emit(eventBus.events.busy)
    Api.request = request
    Api.error = null
    Api.message = null
    Api.status = null
    Api.response = null
    Api.http(request)
      .then(response => {
        Api._success(response)
        resolve(response.data)
      })
      .catch(error => {
        const originalRequest = error.config
        if (
          error.code !== 'ECONNABORTED' && // С того адреса отвечают
          error.response && // Есть отклик
          error.response.status === 401 && // Именно 401 ошибка и только она
          Api.refreshToken && // Мы приготовили токен обновления
          Api.refreshEndPoint && // И знаем, что с ним делать
          !originalRequest._restoring // И мы это делаем однократно
        ) {
        // Далее следует попытка восстановить аутентификацию через refresh
          originalRequest._restoring = true
          Api.clearAccessToken() // Старый токен более не используем
          return Api.http({
            url: Api.refreshEndPoint,
            method: 'post',
            data: {
              token: Api.refreshToken
            }
          })
            .then(response => {
              Api._success(response)
              // Получен новый токен. Сейчас повторю запрос
              originalRequest.headers['Authorization'] = 'Bearer ' + Api.accessToken
              Api.http(originalRequest)
                .then(response => {
                  Api._success(response)
                  resolve(response.data)
                })
                .catch(error => {
                  Api._error(error)
                  reject(error)
                })
            })
            .catch(error => {
              // вероятно, неправильный refresh-token
              Api._error(error)
              reject(error)
            })
        } else {
          Api._error(error)
          reject(error)
        }
      })
  })
}

Api.get = (url) => {
  const request = {
    url,
    method: 'get'
  }
  return Api.execute(request)
}

Api.post = (url, data) => {
  const request = {
    url,
    data,
    method: 'post'
  }
  return Api.execute(request)
}

Api.put = (url, data) => {
  const request = {
    url,
    data,
    method: 'put'
  }
  return Api.execute(request)
}

Api.delete = (url, data) => {
  const request = {
    url,
    data,
    method: 'delete'
  }
  return Api.execute(request)
}

export default Api
