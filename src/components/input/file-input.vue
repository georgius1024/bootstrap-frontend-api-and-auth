<template>
  <div>
    <v-text-field
        append-icon="attach_file"
        v-model="filename"
        :label="label"
        :required="required"
        @click.native="onFocus"
        :disabled="disabled"
        ref="fileTextField"
    />
    <input
        type="file"
        :name="name"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        ref="fileInput"
        @change="onFileChange"
        style="display: none"
    >
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: [Array, String]
      },
      accept: {
        type: String,
        default: '*'
      },
      label: {
        type: String,
        default: 'choose_file'
      },
      required: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: 'upload'
      }
    },
    data () {
      return {
        filename: ''
      }
    },
    watch: {
      value (v) {
        this.filename = v
      }
    },
    mounted () {
      this.filename = this.value
    },

    methods: {
      getFormData (files) {
        const forms = []
        for (const file of files) {
          const form = new FormData()
          form.append('data', file, file.name)
          forms.push(form)
        }
        return forms
      },
      onFocus () {
        if (!this.disabled) {
          this.$refs.fileInput.click()
        }
      },
      onFileChange ($event) {
        const files = $event.target.files || $event.dataTransfer.files
        // const form = this.getFormData(files)
        if (files) {
          if (files.length > 0) {
            this.filename = [...files].map(file => file.name).join(', ')
          } else {
            this.filename = null
          }
        } else {
          this.filename = $event.target.value.split('\\').pop()
        }
        this.$emit('input', this.filename)
      }
    }
  }
</script>
