<template>
  <v-btn
    class="ml-3 mr-4"
    elevation="1"
    fab
    small
    @click="toggleDrawer"
    :color="isPlanActive ? 'primary' : ''"
  >
    <v-icon>
      mdi-format-list-bulleted
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { IsVisibleDrawerKey } from '~/types/injection-key'
import { isPlanActive } from '~/utils/ui/common'

const drawer = inject(IsVisibleDrawerKey)!
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>