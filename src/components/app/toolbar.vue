<template>
  <v-toolbar app fixed color="primary" class="main-menu" dark flat>
    <v-toolbar-title>
      <router-link :to="{name: 'root'}">
        <img src="@/assets/logo.png" class="logo">
      </router-link>
    </v-toolbar-title>

    <v-toolbar-title v-html="title" class="hidden-sm-and-down"/>
    <v-spacer/>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat icon :to="{name: 'about'}">
        <v-icon>
          info
        </v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items class="ml-4">
      <template v-if="profile">
        <v-menu offset-y >
          <v-btn
            flat
            small
            slot="activator"
          >
          <span>
            {{profile.name}}
          </span>
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile :to="{name: 'change-password'}">
              <v-list-tile-title>Сменить пароль</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{name: 'profile'}">
              <v-list-tile-title>Профайл</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="{name: 'logout'}">
              <v-list-tile-title>Выйти</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn
          flat
          :to="{name: 'login'}"
        >
        <span>
          Вход
        </span>
        </v-btn>
        <v-btn
          flat
          :to="{name: 'register'}"
        >
        <span>
          Регистрация
        </span>
        </v-btn>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>
<style>
  .main-menu .logo {
    height: 50px;
    width: auto;
    filter: grayscale(100%) contrast(0%) brightness(200%);
  }
</style>
<script type="text/babel">
export default {
  name: 'Toolbar',
  props: {
    title: {
      type: String,
      required: true
    },
    profile: {
      type: [Object, Boolean],
      required: false
    }
  }
}
</script>
