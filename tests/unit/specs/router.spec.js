import router from '@/router'
import store from '@/store'

describe('router', () => {
  store.commit('account/logout')
  it('should be object', () => {
    expect(router).toBeTruthy()
  })
  it('should prevent not authorized access', () => {
    expect(router.history.current.name).toBeFalsy()
    router.push({ name: 'root' })
    expect(router.history.current.name).toBe('login')
    router.push({ name: 'profile' })
    expect(router.history.current.name).toBe('login')
  })

  it('should allow authorized access', () => {
    const user = {
      name: 'Иванов Б.Л.'
    }
    const auth = {
      accessToken: 'a111',
      refreshToken: 'r222'
    }
    store.commit('account/login', { user, auth })
    router.push({ name: 'root' })
    expect(router.history.current.name).toBe('root')
    router.push({ name: 'profile' })
    expect(router.history.current.name).toBe('profile')
    router.push({ name: 'login' })
    expect(router.history.current.name).toBe('root')
  })
})
