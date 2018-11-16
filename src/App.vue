<template>
  <v-app>
    <app-toolbar
      :title="config.APP_NAME"
      :profile="profile"
    />
    <div class="hopper grey lighten-5">
      <app-breadcrumbs :items="path"/>
    </div>
    <app-view-port/>
    <app-footer :location="location"/>
    <app-message :message="message" :level="level" v-model="showMessage"/>
    <app-spinner :active="spinner" :timeout="1000*7" @timeout="timedOut"/>
    <app-scroll-top :bottom="44" :right="4" :speed="20"/>
  </v-app>
</template>
<style>
  .hopper {
    position: fixed;
    left: 0;
    top: 64px;
    right: 0;
    z-index: 1;
    padding: 4px 12px;
    background-color: #fff;
  }
  @media (max-width: 959px) {
    .hopper {
      position: absolute;
      top: 56px;
    }
  }
</style>
<script>
import AppToolbar from '@/components/app/toolbar'
import AppFooter from '@/components/app/footer'
import AppMessage from '@/components/app/message'
import AppSpinner from '@/components/app/spinner'
import AppScrollTop from '@/components/app/scroll-top'
import AppViewPort from '@/components/app/view-port'
import AppBreadcrumbs from '@/components/app/breadcrumbs'
import { mapGetters, mapMutations } from 'vuex'
// import Api from '@/api'
import config from '@/config'
import eventBus from '@/event-bus'
const _truncate = require('lodash.truncate')

export default {
  name: 'App',
  data () {
    return {
      message: '',
      level: '',
      showMessage: false,
      spinner: false,
      location: config.APP_NAME,
      config,
      path: []
    }
  },
  created () {
    document.title = config.APP_NAME

    eventBus.on(eventBus.events.error, (error) => this.raiseError(error))
    eventBus.on(eventBus.events.message, (message) => this.raiseMessage(message))

    eventBus.on(eventBus.events.busy, () => this.startSpinner())
    eventBus.on(eventBus.events.idle, () => this.stopSpinner())
    eventBus.on(eventBus.events.path, (path) => {
      this.path = this.updatePath(path)
    })
  },
  mounted () {
    this.path = this.routePath()
  },
  watch: {
    '$route' () {
      this.path = this.routePath()
    }
  },
  computed: {
    profile () {
      return this.isAuthenticated ? this.user : false
    },
    ...mapGetters({
      user: 'account/user',
      isAuthenticated: 'account/isAuthenticated'
    })
  },
  methods: {
    updatePath (path) {
      let items = [{
        text: 'Начало',
        to: '/'
      }]
      if (Array.isArray(path)) {
        items = items.concat(path)
      }
      return items.map(e => {
        if (typeof e === 'string') {
          e = {
            text: e
          }
        }
        if (!e.to && !e.href) {
          e.disabled = true
        }
        e.text = _truncate(e.text, {
          length: 60
        })
        return e
      })
    },
    routePath () {
      return this.updatePath(this.$route.meta.path)
    },
    raiseMessage (message) {
      this.level = ''
      this.message = message
      this.showMessage = !!message
    },
    raiseError (error) {
      this.level = 'error'
      this.message = error
      this.showMessage = !!error
    },
    startSpinner () {
      this.spinner = true
    },
    stopSpinner () {
      this.spinner = false
    },
    timedOut () {
      this.spinner = false
      this.raiseError('Процесс завершился тайм-аутом')
    },
    messageAction () {
      eventBus.emit(eventBus.events.message, 'Сообщение пришло по шине')
    },
    errorAction () {
      eventBus.emit(eventBus.events.error, 'Сообщение об ошибке пришло по шине')
    },
    waitAction () {
      eventBus.emit(eventBus.events.busy)
    },
    ...mapMutations({
      login: 'account/login',
      logout: 'account/logout'
    })
  },
  components: {
    AppToolbar,
    AppFooter,
    AppMessage,
    AppSpinner,
    AppScrollTop,
    AppViewPort,
    AppBreadcrumbs
  }
}
</script>
