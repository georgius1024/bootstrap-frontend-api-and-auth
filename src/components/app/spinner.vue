<template>
    <transition name="fade">
        <div v-show="rolling" class="spinner-control">
            <div class="spinner-control-interior"></div>
            <v-progress-circular
                indeterminate
                :size="100"
                :width="8"
                class="v-spinner primary--text">
            </v-progress-circular>
        </div>
    </transition>
</template>
<style>
    .spinner-control {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 7001;
    }
    .spinner-control .spinner-control-interior {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0.3;
        background-color: #666;
        cursor: progress;
        z-index: 7002;
    }
    .spinner-control .v-spinner {
        position: fixed;
        left: 50%;
        top: 50%;
        margin-top: -50px;
        margin-left: -50px;
        z-index: 7003;
    }
</style>
<script type="text/babel">
export default {
  name: 'spinner',
  data () {
    return {
      rolling: false,
      timer: false
    }
  },
  watch: {
    active: function (value) {
      this.rolling = Boolean(value)
      if (this.rolling && this.timeout) {
        this.timer = setTimeout(() => {
          this.timedout()
        }, this.timeout)
      }
      if (!this.rolling && this.timer) {
        clearTimeout(this.timer)
        this.timer = false
      }
    }
  },
  props: {
    active: {
      default: false
    },
    timeout: {
      type: Number,
      default: 10 * 1000
    }
  },
  methods: {
    timedout () {
      this.rolling = false
      this.$emit('timeout')
    }
  }
}
</script>
