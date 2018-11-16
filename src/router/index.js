import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import eventBus from '@/event-bus'
import activator from './activator'
Vue.use(Router)

function load (component) {
  return require(`@/views/${component}.vue`).default
}

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (store.getters['account/mustChangePassword']) {
      eventBus.error('Необходимо установить новый пароль!')
      next('/reset-password')
    } else {
      next()
    }
    return
  }
  next('/login')
}
const ifMustChangePassword = (to, from, next) => {
  if (store.getters['account/mustChangePassword']) {
    next()
    return
  }
  next('/')
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: load('root'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/profile',
      name: 'profile',
      component: load('profile'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: load('login'),
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/register',
      name: 'register',
      component: load('register'),
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: load('change-password'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: load('reset-password'),
      beforeEnter: ifMustChangePassword
    },
    {
      path: '/about',
      name: 'about',
      component: load('about'),
      meta: {
        path: ['О приложении']
      }
    },
    {
      path: '/activate',
      name: 'activator',
      beforeEnter: async (to, from, next) => {
        const success = await activator(to.query['code'])
        if (success) {
          next('/')
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async (to, from, next) => {
        if (store.getters.isAuthenticated) {
          const Api = require('@/api').default
          await Api.get('/private/logout')
          store.commit('account/logout')
        }
        next('/login')
      }
    },
    {
      path: '*',
      component: load('404')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition && savedPosition.y) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
