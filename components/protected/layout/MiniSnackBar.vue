<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="isVisible" right timeout="2000">
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { SnackbarStore } from '~/store'

const message = computed(() => SnackbarStore.miniSnackbar.message)

const isVisible = computed({
  get: () => SnackbarStore.miniSnackbar.isVisible,
  set: () => SnackbarStore.miniSnackbarHidden()
})
</script>
