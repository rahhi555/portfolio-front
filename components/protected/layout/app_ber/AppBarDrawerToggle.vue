<template>
  <v-btn
    class="ml-3 mr-4"
    elevation="1"
    fab
    small
    @click="miniVariant = !miniVariant; drawer = true"
  >
    <v-icon>
      {{ miniVariant ? 'mdi-format-list-bulleted' : 'mdi-dots-vertical' }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
  import { defineComponent, inject } from '@nuxtjs/composition-api'
  import { MiniVariantKey, DrawerKey } from '~/types/injection-key'

  export default defineComponent({
    setup(){
      const miniVariant = inject(MiniVariantKey)
      const drawer = inject(DrawerKey)

      return {
        miniVariant,
        drawer
      }
    }
  })
</script>
