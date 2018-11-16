<template>
  <centered-layout>
    <v-scale-transition>
      <v-flex xs12 sm8 lg6 v-show="show" class="my-4">
        <v-card  color="secondary lighten-5"> <!--class="elevation4 teal white--text">=-->
          <v-card-text class="px-5 pb-5">
            <img src="@/assets/logo.png" class="logo hidden-md-and-down">
            <p class="hidden-md-and-down text-xs-center">
              {{config.APP_NAME}}

            </p>
            <v-divider class="my-2 hidden-md-and-down"/>
            <v-layout column>
              <v-btn large block class="primary" disabled>
                Action 1
              </v-btn>
              <v-btn large block class="primary" disabled>
                Action 2
              </v-btn>
              <v-btn large block class="primary" disabled>
                Action 3
              </v-btn>
              <v-btn large block class="primary" disabled>
                Action 4
              </v-btn>
            </v-layout>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-scale-transition>
  </centered-layout>
</template>
<style>
  .logo {
    display: block;
    margin: 0px auto;
  }
</style>

<script type="text/babel">
import CenteredLayout from '@/components/layout/centered'
import config from '@/config'
export default {
  name: 'Root',
  data () {
    return {
      show: false,
      config
    }
  },
  mounted () {
    this.show = true
  },
  components: {
    CenteredLayout
  }
}
</script>
