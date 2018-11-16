<template>
  <v-fade-transition>
    <v-btn
      v-show="visible"
      class="scroll-top elevation4"
      :style="style"
      icon
      flat
      @click="scrollTop()"
      v-scroll="scrollObserver"
    >
      <v-icon>
        keyboard_arrow_up
      </v-icon>
    </v-btn>
  </v-fade-transition>
</template>
<style scoped>
  .scroll-top {
    background-color: rgba(90, 90, 90, 0.8) !important;
    color: rgba(255, 255, 255, 0.8) !important;
    margin: 0 !important;
    position: fixed;
    z-index: 100;
  }
</style>

<script type="text/babel">
export default {
  name: 'ScrollTop',
  data () {
    return {
      visible: false
    }
  },
  props: {
    bottom: {
      type: [String, Number],
      default: 32
    },
    right: {
      type: [String, Number],
      default: 32
    },
    speed: {
      type: [String, Number],
      default: 50
    }
  },
  computed: {
    style () {
      return {
        right: this.right + 'px',
        bottom: this.bottom + 'px'
      }
    }
  },
  methods: {
    scrollObserver () {
      this.visible = Boolean(window.scrollY)
    },
    scrollTop () {
      let scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, -Number(this.speed))
        } else {
          clearInterval(scrollInterval)
        }
      }, 25)
    }
  }
}
</script>
