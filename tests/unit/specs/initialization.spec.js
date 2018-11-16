
import config from '@/config'
import Api from '@/api'
import { putStored } from '@/lib/local-storage'
const accessToken = 'token-token-access-broken'
const refreshToken = 'token-token-refresh-broken'

putStored(config.APP_ID + '-' + 'access-token', accessToken)
putStored(config.APP_ID + '-' + 'refresh-token', refreshToken)

describe('initialization.js', () => {
  it('really initialize app', () => {
    expect(Api.http.defaults.baseURL).toBeFalsy()
    expect(Api.accessToken).toBeFalsy()
    require('@/initialization')
    expect(Api.http.defaults.baseURL).toBe(config.API_URL)
    expect(Api.accessToken).toBe(accessToken)
    expect(Api.refreshToken).toBe(refreshToken)
  })
})
