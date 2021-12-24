<template>
  <v-btn
    class="ml-3 mr-4"
    elevation="1"
    fab
    small
    @click="toggleDrawer"
  >
    <v-icon>
      mdi-format-list-bulleted
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { DrawerKey } from '~/types/injection-key'

const drawer = inject(DrawerKey)!
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>