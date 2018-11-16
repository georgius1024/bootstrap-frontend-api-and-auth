
import config from '@/config'
import { putStored } from '@/lib/local-storage'
import eventBus from '@/event-bus'

const user = {
  id: 1,
  name: 'Super-user-barabuser',
  status: 'reset'
}
const accessToken = 'token-token-access-broken'
const refreshToken = 'token-token-refresh-broken'
const auth = {
  accessToken,
  refreshToken
}

putStored(config.APP_ID + '-' + 'user', user)
putStored(config.APP_ID + '-' + 'access-token', accessToken)
putStored(config.APP_ID + '-' + 'refresh-token', refreshToken)

describe('store-account.js', () => {
  const loginCallback = jest.fn()
  const logoutCallback = jest.fn()

  eventBus.on(eventBus.events.login, loginCallback)
  eventBus.on(eventBus.events.logout, logoutCallback)

  const accountModule = require('@/store/modules/account').default

  it('Restore from previously stored state', () => {
    expect(accountModule.state).toBeTruthy()
    expect(accountModule.state.user).toEqual(user)
    expect(accountModule.state.accessToken).toBe(accessToken)
    expect(accountModule.state.refreshToken).toBe(refreshToken)
  })

  it('Getters works', () => {
    expect(accountModule.state.user).toEqual(accountModule.getters.user(accountModule.state))
    expect(accountModule.state.accessToken).toEqual(accountModule.getters.accessToken(accountModule.state))
    expect(accountModule.state.refreshToken).toEqual(accountModule.getters.refreshToken(accountModule.state))
    expect(accountModule.getters.isAuthenticated(accountModule.state)).toBe(true)
    expect(accountModule.getters.mustChangePassword(accountModule.state)).toBe(true)
    expect(accountModule.getters.mustChangePassword(accountModule.state)).toBeTruthy()
  })

  it('SetUser works', () => {
    const another = {
      id: 2,
      name: 'Another'
    }
    accountModule.mutations.setUser(accountModule.state, another)
    expect(accountModule.state.user).toEqual(another)
  })

  it('Logout works', () => {
    accountModule.mutations.logout(accountModule.state)
    expect(accountModule.getters.user(accountModule.state)).toEqual({})
    expect(accountModule.state.accessToken).toBe('')
    expect(accountModule.state.refreshToken).toBe('')
    expect(accountModule.getters.isAuthenticated(accountModule.state)).toBe(false)
    expect(accountModule.getters.mustChangePassword(accountModule.state)).toBeFalsy()
  })

  it('Login works', () => {
    accountModule.mutations.login(accountModule.state, { user, auth })
    expect(accountModule.state.user).toEqual(user)
    expect(accountModule.state.accessToken).toBe(accessToken)
    expect(accountModule.state.refreshToken).toBe(refreshToken)
  })

  it('clearMustChangePassword works', () => {
    expect(accountModule.getters.mustChangePassword(accountModule.state)).toBeTruthy()
    accountModule.mutations.clearMustChangePassword(accountModule.state)
    expect(accountModule.getters.mustChangePassword(accountModule.state)).toBeFalsy()
    expect(accountModule.state.user.mustChangePassword).toBeFalsy()
  })

  it('Fires "login" event', () => {
    expect(loginCallback).toBeCalled()
    expect(loginCallback).toBeCalledWith(user)
  })

  it('Fires "logout" event', () => {
    expect(logoutCallback).toBeCalled()
  })
})
