<template>
  <v-btn
    class="ml-3 mr-4"
    elevation="1"
    fab
    small
    @click="drawer = !drawer"
  >
    <v-icon>
      mdi-format-list-bulleted
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
  import { defineComponent, inject } from '@nuxtjs/composition-api'
  import { DrawerKey } from '~/types/injection-key'

  export default defineComponent({
    setup(){
      const drawer = inject(DrawerKey)

      return {
        drawer
      }
    }
  })
</script>