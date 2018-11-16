<template>
  <centered-layout>
    <v-flex md6 xs12 class="mt-3">
      <v-card class="elevation4">
        <v-toolbar class="primary" dark dense>
          <v-toolbar-title>Установка нового пароля</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-text-field
                label="Новый пароль"
                v-model="password"
                required
                type="password"
                @input="clearErrors"
                :rules="validation.passwordRules"
                :error-messages="errors('password')"
              ></v-text-field>
              <v-text-field
                label="Повтор пароля"
                v-model="password_retype"
                password
                required
                type="password"
                @input="clearErrors"
                :rules="validation.passwordRetypeRules"
                :error-messages="errors('password_retype')"
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn dark class="primary" @click="resetPassword">
            Установить пароль
          </v-btn>
          <v-spacer/>
        </v-card-actions>
      </v-card>
    </v-flex>
  </centered-layout>
</template>

<script type="text/babel">
import validation from '@/lib/validation'
import eventBus from '@/event-bus'
import Api from '@/api'
import CenteredLayout from '@/components/layout/centered'
import _get from 'lodash.get'
import _has from 'lodash.has'
import { mapMutations } from 'vuex'

export default {
  name: 'ResetPassword',
  data () {
    return {
      active: 0,
      password: '',
      password_retype: '',
      valid: false,
      errorsData: [],
      validation: {
        passwordRules: [
          validation.passwordIsRequired,
          validation.minimumLength(6),
          validation.maximumLength(20)
        ],
        passwordRetypeRules: [
          validation.confirmPasswordIsRequired,
          (value) => value === this.password || 'Пароль не совпал'
        ]
      }
    }
  },
  methods: {
    resetPassword () {
      this.clearErrors()
      this.$nextTick(() => {
        this._resetPassword()
      })
    },
    _resetPassword: async function () {
      try {
        this.$refs['form'].validate()
        if (!this.valid) {
          return eventBus.error('Введите пароль и подтверждение')
        }
      } catch (error) {
        this.valid = true
      }

      try {
        await Api.post('private/change-password', {
          password: this.password,
          password_retype: this.password_retype
        })
        this.clearMustChangePassword()
        this.$router.push({ name: 'root' })
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
            field: 'password',
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
      clearMustChangePassword: 'account/clearMustChangePassword'
    })
  },
  components: {
    CenteredLayout
  }
}
</script>
