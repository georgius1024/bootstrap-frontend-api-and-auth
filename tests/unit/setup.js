import Vue from 'vue'
import Vuetify from 'vuetify'

import {} from './mocks/local-storage.mock'

import Api from '@/api'
import mockAxios from './mocks/axios.mock'
Vue.use(Vuetify)
Api.http = mockAxios

window.requestAnimationFrame = function () {}
window.scrollTo = function () {}
Vue.config.productionTip = false
