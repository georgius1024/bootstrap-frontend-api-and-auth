import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import eventBus from '@/event-bus'

Vue.use(Vuex)

const state = {}
const getters = {
  user: state => state.account.user,
  isAuthenticated: state => Boolean(state.account.accessToken)
}
const mutations = {}

const actions = {}

const store = new Vuex.Store({
  modules: {
    account
  },
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV === 'production'
})

eventBus.on(eventBus.events.credentials, (auth) => {
  store.commit('account/setAccessToken', auth.accessToken)
  store.commit('account/setRefreshToken', auth.refreshToken)
})

eventBus.on(eventBus.events.logout, (auth) => {
  store.commit('account/setAccessToken', '')
  store.commit('account/setRefreshToken', '')
  store.commit('account/setUser', {})
})

if (account.state.accessToken) {
  Vue.nextTick(() => {
    eventBus.emit(eventBus.events.restore, account.state.user)
    const { accessToken, refreshToken } = account.state
    eventBus.emit(eventBus.events.credentials, { accessToken, refreshToken })
  })
}

export default store
