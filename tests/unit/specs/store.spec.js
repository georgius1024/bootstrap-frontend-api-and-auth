import config from '@/config'

// eslint-disable-next-line
import { hasStored, getStored, putStored, deleteStored, deleteAll } from '@/lib/local-storage'
import eventBus from '@/event-bus'

const user = {
  id: 1,
  name: 'Super-user-barabuser'
}
const accessToken = 'token-token-access-broken'
const refreshToken = 'token-token-refresh-broken'

putStored(config.APP_ID + '-' + 'user', user)
putStored(config.APP_ID + '-' + 'access-token', accessToken)
putStored(config.APP_ID + '-' + 'refresh-token', refreshToken)

describe('store-account.js', () => {
  const restoreCallback = jest.fn()
  const credentialsCallback = jest.fn()

  eventBus.on(eventBus.events.restore, restoreCallback)
  eventBus.on(eventBus.events.credentials, credentialsCallback)

  const store = require('@/store').default

  it('Restore from previously stored state', () => {
    expect(store.getters.user).toEqual(user)
    expect(store.getters.isAuthenticated).toBe(true)
  })
  it('Fires "restore" event', () => {
    expect(restoreCallback).toBeCalled()
    expect(restoreCallback).toBeCalledWith(user)
  })
  it('Fires "credentials" event', () => {
    expect(credentialsCallback).toBeCalled()
    expect(credentialsCallback).toBeCalledWith({ accessToken, refreshToken })
  })
})
