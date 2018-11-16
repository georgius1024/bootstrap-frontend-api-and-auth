/**
 * Created by georgius on 20.10.18.
 */
'use strict'

const mockAxios = function (request) {
  return new Promise((resolve, reject) => {
    mockAxios.intercept(request)
      .then(response => {
        response.status = response.status || 200
        return resolve(response)
      })
      .catch(error => {
        request.headers = request.headers || {}
        error.config = request
        return reject(error)
      })
  })
}

mockAxios.success = function (data, status = 200) {
  // eslint-disable-next-line
  return Promise.resolve({
    status,
    data
  })
}

mockAxios.error = function (data, status = 500) {
  // eslint-disable-next-line
  return Promise.reject({
    response: {
      status,
      data
    }
  })
}

mockAxios.defaultIntercept = function () {
  return mockAxios.success({
    status: 'success'
  }, 200)
}

mockAxios.intercept = mockAxios.defaultIntercept

mockAxios.defaults = {
  baseUrl: '',
  headers: {
    common: []
  }

}
export default mockAxios
