import config from '@/config'

describe('config.js', () => {
  it('should be object', () => {
    expect(config).toBeTruthy()
  })
  it('should contain APP_NAME prop', () => {
    expect(config).toHaveProperty('APP_NAME')
  })
  it('should contain APP_ID prop', () => {
    expect(config).toHaveProperty('APP_ID')
  })
  it('should contain API_URL prop', () => {
    expect(config).toHaveProperty('API_URL')
  })
  it('should contain APP_VERSION prop', () => {
    expect(config).toHaveProperty('APP_VERSION')
  })
  it('should contain APP_COPYRIGHT prop', () => {
    expect(config).toHaveProperty('APP_COPYRIGHT')
  })
})
