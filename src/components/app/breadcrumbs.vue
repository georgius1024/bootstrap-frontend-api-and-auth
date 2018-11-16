<template>
  <v-breadcrumbs :items="items"/>
</template>
<style>
  .v-breadcrumbs {
    padding: 0px !important;
  }

  @media print
  {
    .breadcrumbs
    {
      display: none !important;
    }
  }
</style>
<script type="text/babel">
export default {
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array,
      default: function () {
        return [{
          text: 'Начало',
          to: { name: 'root' }
        }]
      }
    }
  }
}
</script>
