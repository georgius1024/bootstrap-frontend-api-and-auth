<template>
  <v-snackbar
    top
    right
    multi-line
    :timeout="timeout"
    :color="color"
    :value="value"
    @input="input"
  >
    <span v-html="message"></span>
    <v-btn dark icon flat @click.native="input(false)">
      <v-icon>
        clear
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  data () {
    return {
      gotMessage: false
    }
  },
  computed: {
    color () {
      return this.level === 'error' ? 'error' : 'info'
    }
  },
  props: {
    message: {
      default: false
    },
    level: {
      default: false
    },
    value: {
      required: true
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    input (value) {
      this.$emit('input', value)
    }

  }
}
</script>
