<template>
  <centered-layout>
    <v-flex md6 xs12 class="mt-3">
      <v-card class="elevation4">
        <v-toolbar class="primary" dark dense>
          <v-toolbar-title>О приложении</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout align-center row>
            <v-flex class="col-xs-2">
              <img src="@/assets/logo.png" class="logo">
            </v-flex>
            <v-flex class="pl-2 pt-2">
              <p>{{config.APP_NAME}}</p>
              <p>{{config.APP_COPYRIGHT}}</p>
              <p>Версия: {{config.APP_VERSION}}</p>
            </v-flex>
          </v-layout>
          <p></p>
        </v-card-text>
      </v-card>
    </v-flex>
  </centered-layout>
</template>
<style scoped>
  .logo {
    margin-top: 8px;
    height: 150px;
    width: auto;
    filter: brightness(18%);
  }

</style>

<script type="text/babel">
// import Api from '@/api'
import CenteredLayout from '@/components/layout/centered'
import config from '@/config'
import formatting from '@/traits/formatting'
export default {
  name: 'About',
  mixins: [formatting],
  data () {
    return {
      config
    }
  },
  components: {
    CenteredLayout
  }
}
</script>
