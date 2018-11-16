const production = {
  APP_ID: 'bbt-web',
  APP_NAME: 'AWESOME FRONTEND APP',
  APP_VERSION: '1.0.0.0',
  APP_COPYRIGHT: '© 2018 Georgius 2018',
  API_URL: '/'
}

const development = Object.assign({}, production, {
  API_URL: 'http://localhost:3800/'
})

const test = Object.assign({}, development)

let config = {
  development,
  test,
  production
}

let env = process.env.NODE_ENV || 'development'
export default config[env]
