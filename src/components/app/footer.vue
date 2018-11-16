<template>
  <v-footer app dark v-if="location">
    <div class="mx-4" v-html="location"/>
    <v-spacer></v-spacer>
    <div class="mx-4" v-if="userName" v-html="userName"/>
 </v-footer>
</template>

<script type="text/babel">
export default {
  name: 'Footer',
  props: {
    location: {
      type: [ String, Boolean ],
      required: true
    },
    userName: {
      type: [ String, Boolean ],
      required: false,
      default: false
    }
  }
}
</script>
