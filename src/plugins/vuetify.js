import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Scroll } from 'vuetify/lib/directives'
import 'vuetify/src/stylus/app.styl'
Vue.use(Vuetify, {
  theme: {
    primary: '#0589FF',
    secondary: '#009688', // '#003666', // '#424242',
    accent: 'FF9800', // '#FFC107',
    error: '#FF5252',
    info: '#2196F3',
    success: '#2E7D32', // green darken-3 // '#4CAF50',
    warning: '#E65100' // 'orange darken-4' //'#FFC107'
  },
  directives: {
    Scroll
  },
  customProperties: true,
  iconfont: 'md'
})
