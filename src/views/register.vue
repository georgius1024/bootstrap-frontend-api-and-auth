<template>
  <centered-layout>
    <v-flex md6 xs12 class="mt-3">
      <v-card>
        <v-toolbar class="primary" dark dense>
          <v-toolbar-title>Регистрация</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field
                autofocus
                label="Email"
                v-model="email"
                required
                counter="80"
                :rules="[validation.fieldIsRequired, validation.emailMustBeValid]"
                :error-messages="errors('email')"
            ></v-text-field>
            <v-text-field
                label="Пароль"
                v-model="password"
                ref="password"
                required
                type="password"
                counter="20"
                :rules="passwordRules"
                :error-messages="errors('password')"
            ></v-text-field>
            <v-text-field
                label="Повтор пароля"
                v-model="password_retype"
                password
                required
                type="password"
                counter="20"
                :rules="passwordConfirmationRules"
                :error-messages="errors('password_retype')"
            ></v-text-field>
            <v-text-field
                label="Имя"
                v-model="name"
                required
                counter="80"
                :rules="[validation.fieldIsRequired, validation.maximumLength(250)]"
                :error-messages="errors('name')"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="register" :disabled="registered">Регистрация</v-btn>
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
  // TODO тестировать регистрацию
  export default {
    name: 'Register',
    data () {
      return {
        email: '',
        password: '',
        password_retype: '',
        name: '',
        valid: false,
        registered: false,
        validation,
        passwordRules: [
          validation.fieldIsRequired,
          validation.minimumLength(6),
          validation.maximumLength(20)
        ],
        passwordConfirmationRules: [
          validation.confirmPasswordIsRequired,
          (value) => value === this.password || 'Пароль не совпал'
        ],
        errorsData: [],
      }
    },
    methods: {
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
      clearErrors (e) {
        this.errorsData = []
      },
      gatherErrors (e) {
        if (e.response && e.response.data) {
          if (Array.isArray(e.response.data.errors) && e.response.data.errors.length) {
            this.errorsData = e.response.data.errors
          } else {
            this.errorsData = [
              {
                field: 'email',
                message: e.response.data.message
              }
            ]
          }
        } else {
          this.errorsData = [
            {
              field: 'email',
              message: e.message
            }
          ]
        }
      },
      focusPassword () {
        this.$refs.password.focus()
      },
      register () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        Api.post('/auth/register', {
          email: this.email,
          password: this.password,
          password_retype: this.password_retype,
          name: this.name,
        })
          .then((response) => {
            this.registered = true
          })
          .catch(error => {
            this.gatherErrors(error)
          })
      }
    },
    components: {
      CenteredLayout
    }
  }
</script>
