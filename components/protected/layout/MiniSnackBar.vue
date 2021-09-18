<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="isVisible" right timeout="2000">
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SnackbarStore } from '~/store'

export default defineComponent({
  computed: {
    message() {
      return SnackbarStore.miniSnackbar.message
    },

    isVisible: {
      get() {
        return SnackbarStore.miniSnackbar.isVisible
      },
      set() {
        SnackbarStore.miniSnackbarHidden()
      },
    },
  },
})
</script>
