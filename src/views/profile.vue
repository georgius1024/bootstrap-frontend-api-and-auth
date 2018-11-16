<template>
  <centered-layout>
    <v-flex md6 xs12 class="mt-3">
      <v-card>
        <v-toolbar class="primary" dark dense tabs>
          <v-toolbar-title>Профайл</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form" name="profile">
            <v-text-field
                label="Email"
                v-model="profile.email"
                name="email"
                required
                :rules="[validation.emailIsRequired, validation.emailMustBeValid]"
                :error-messages="errors('email')"
            ></v-text-field>
            <v-text-field
                label="Имя"
                v-model="profile.name"
                name="name"
                required
                counter="80"
                :rules="[validation.fieldIsRequired, validation.maximumLength(80)]"
                :error-messages="errors('name')"
            ></v-text-field>
            <v-textarea
              label="О себе"
              v-model="profile.about"
              counter="250"
              name="about"
              multi-line
              :rules="[validation.maximumLength(250)]"
              :error-messages="errors('about')"
            ></v-textarea>
            <img
              v-if="profile.oldAvatar"
              :src="profile.oldAvatar"
              class="avatar elevation-10"
            >
            <file-input
              v-model="profile.avatar"
              name="avatar"
              label="Файл с аватаркой"
            />
          </v-form>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn block color="primary" @click="updateProfile">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </centered-layout>
</template>
<style>
  .avatar {
    border-raduius: 50%;
    object-fit: cover;
    height: 150px;
    width: 150px;
    margin: 32px auto;
    display: block;
  }
</style>
<script type="text/babel">
  import _has from 'lodash.has'
  import _get from 'lodash.get'
  import eventBus from '@/event-bus'
  import Api from '@/api'
  import validation from '@/lib/validation.js'
  import CenteredLayout from '@/components/layout/centered'
  import { mapMutations } from 'vuex'
  import FileInput from '@/components/input/file-input.vue'

  export default {
    name: 'Profile',
    data () {
      return {
        profile: {
          email: '',
          name: '',
          about: '',
          avatar: '',
          oldAvatar: ''
        },
        valid: false,
        errorsData: [],
        validation
      }
    },
    mounted () {
      this.getProfile()
    },
    methods: {
      errors (field) {
        if (Array.isArray(this.errorsData)) {
          return this.errorsData
          .filter(e => {
            return e.field === field
          })
          .map(e => {
            return e.message
          })
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
              message: this.message.text
            }
          ]
        }
      },
      getProfile () {
        Api.get('/private/profile')
          .then(response => {
            this.profile = response.data
            this.profile.oldAvatar = this.profile.avatar + '?ts=' + new Date().getTime()
            this.profile.avatar = ''
          })
      },
      updateProfile () {
        this.errorsData = []
        this.$refs.form.validate()
        if (!this.valid) {
          eventBus.error('Исправьте ошибки')
          return
        }
        const formData = new FormData(document.forms['profile'])
        Api.post('/private/profile', formData)
          .then(response => {
            this.accountSetUser(response.data)
            this.$router.push({name: 'root'})
          })
          .catch(error => this.gatherErrors(error))
      },
      ...mapMutations({
        accountSetUser: 'account/setUser'
      })
    },
    components: {
      CenteredLayout,
      FileInput
    }
  }
</script>
