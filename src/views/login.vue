<template>
  <centered-layout>
    <v-flex md6 xs12 class="mt-3">
      <v-card class="elevation4">
        <v-toolbar class="primary" dark dense tabs>
          <v-toolbar-title>Вход</v-toolbar-title>
          <v-tabs
            slot="extension"
            v-model="active"
            color="primary"
            dark
            slider-color="accent"
          >
            <v-tab ripple :key="'login-traditional'">
              По паролю
            </v-tab>
            <v-tab ripple :key="'login-passwordless'">
              По ссылке
            </v-tab>
            <v-tab ripple :key="'reset-password'">
              Забыли пароль?
            </v-tab>
          </v-tabs>

        </v-toolbar>
        <v-tabs-items v-model="active">
          <v-tab-item :key="'login-traditional'">
            <v-card-text>
              <v-form v-model="validTraditional" ref="form-traditional">
                <v-text-field
                  label="Логин"
                  v-model="email"
                  required
                  :rules="[validation.emailIsRequired, validation.emailMustBeValid]"
                  :error-messages="errors('login')"
                  @input="clearErrors"
                ></v-text-field>
                <v-text-field
                  label="Пароль"
                  v-model="password"
                  required
                  type="password"
                  :rules="[validation.fieldIsRequired]"
                  :error-messages="errors('password')"
                  @input="clearErrors"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn dark class="primary" @click="loginTraditional">
                Войти
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-tab-item>
          <v-tab-item :key="'login-passwordless'">
            <v-card-text>
              <v-form v-model="validPasswordless" ref="form-passwordless">
                <p>
                  Введите свой e-mail и получите письмо со ссылкой для входа в приложение
                </p>
                <v-text-field
                  label="e-mail"
                  v-model="email"
                  required
                  :rules="[validation.emailIsRequired, validation.emailMustBeValid]"
                  :error-messages="errors('email')"
                  @input="clearErrors"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn dark class="primary" @click="loginPasswordless">
                Получить ссылку
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-tab-item>
          <v-tab-item :key="'reset-password'">
            <v-card-text>
              <v-form v-model="validReset" ref="form-reset">
                <p>
                  Введите свой e-mail и получите письмо со ссылкой для установки нового пароля
                </p>
                <v-text-field
                  label="e-mail"
                  v-model="email"
                  required
                  :rules="[validation.emailIsRequired, validation.emailMustBeValid]"
                  :error-messages="errors('email')"
                  @input="clearErrors"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn dark class="primary" @click="resetPassword">
                Новый пароль
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-tab-item>
        </v-tabs-items>

      </v-card>
    </v-flex>
  </centered-layout>
</template>
<script type="text/babel">
import _has from 'lodash.has'
import _get from 'lodash.get'
import validation from '@/lib/validation.js'
import eventBus from '@/event-bus'
import config from '@/config'
import Api from '@/api'
import CenteredLayout from '@/components/layout/centered'
import { mapMutations } from 'vuex'
import { getStored, putStored } from '@/lib/local-storage'

export default {
  name: 'Login',
  data () {
    return {
      active: 0,
      email: getStored(config.APP_ID + '-' + 'last-email', ''),
      password: '',
      validTraditional: false,
      validPasswordless: false,
      validReset: false,
      errorsData: [],
      validation
    }
  },
  methods: {
    loginTraditional () {
      this.clearErrors()
      this.$nextTick(() => {
        this._loginTraditional()
      })
    },
    loginPasswordless () {
      this.clearErrors()
      this.$nextTick(() => {
        this._loginPasswordless()
      })
    },
    resetPassword () {
      this.clearErrors()
      this.$nextTick(() => {
        this._resetPassword()
      })
    },
    _loginTraditional: async function () {
      try {
        this.$refs['form-traditional'].validate()
        if (!this.validTraditional) {
          return eventBus.error('Введите логин и пароль')
        }
      } catch (error) {
        this.validTraditional = true
      }

      try {
        const response = await Api.post('auth/login', {
          email: this.email,
          password: this.password
        })
        const user = response.data
        const auth = response.auth
        this.accountLogin({ user, auth })
        this.$router.push({ name: 'root' })
        putStored(config.APP_ID + '-' + 'last-email', this.email)
      } catch (error) {
        this.gatherErrors(error)
      }
    },

    _loginPasswordless: async function () {
      try {
        this.$refs['form-passwordless'].validate()
        if (!this.validPasswordless) {
          return eventBus.error('Введите правильный e-mail')
        }
      } catch (error) {
        this.validPasswordless = true
      }
      try {
        await Api.post('auth/passwordless/' + this.email)
        putStored(config.APP_ID + '-' + 'last-email', this.email)
      } catch (error) {
        this.gatherErrors(error)
      }
    },
    _resetPassword: async function () {
      try {
        this.$refs['form-reset'].validate()
        if (!this.validReset) {
          return eventBus.error('Введите правильный e-mail')
        }
      } catch (error) {
        this.validReset = true
      }
      try {
        await Api.post('auth/reset/' + this.email)
        putStored(config.APP_ID + '-' + 'last-email', this.email)
      } catch (error) {
        this.gatherErrors(error)
      }
    },

    clearErrors () {
      this.errorsData = []
    },
    gatherErrors (error) {
      if (_has(error, 'response.data.errors', [])) {
        this.errorsData = _get(error, 'response.data.errors', [])
      } else {
        this.errorsData = [
          {
            field: 'email',
            message: Api.message
          },
          {
            field: 'login',
            message: Api.message
          }
        ]
      }
    },

    errors (field) {
      if (Array.isArray(this.errorsData)) {
        return this.errorsData
          .filter(e => {
            return e.field === field
          })
          .map(e => {
            return e.message || e.error
          })
      }
    },
    ...mapMutations({
      accountLogin: 'account/login'
    })
  },
  components: {
    CenteredLayout
  }
}
</script>
