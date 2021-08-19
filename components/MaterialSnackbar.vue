<template>
  <v-snackbar
    v-model="internalValue"
    class="v-snackbar--material"
    v-bind="{
      ...$attrs,
      'color': 'transparent'
    }"
  >
    <material-alert
      v-model="internalValue"
      :color="$attrs.color"
      :dismissible="dismissible"
      :type="type"
      class="ma-0"
      dark
    >
      <slot />
    </material-alert>
  </v-snackbar>
</template>

<script>
  import MaterialAlert from '~/components/MaterialAlert.vue'
  import { SnackbarStore } from '~/store'
  export default {
    name: 'MaterialSnackbar',
    components: {
      MaterialAlert
    },
    props: {
      dismissible: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: '',
      },
      value: Boolean,
    },

    computed: {
      internalValue: {
        get() {
          return SnackbarStore.getParams.isVisible
        },
        set() {
          SnackbarStore.hiddenAction()
        }
      }
    }
  }
</script>

<style lang="sass">
  .v-snackbar--material
    margin-top: 32px
    margin-bottom: 32px

    .v-alert
      padding: 32px 16px

    .v-alert--material,
    .v-snack__wrapper
      border-radius: 4px

    .v-snack__content
      overflow: visible
      padding: 0

    .v-snack__action
      display: none
</style>
