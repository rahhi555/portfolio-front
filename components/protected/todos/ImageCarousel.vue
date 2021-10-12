<template>
  <v-dialog :value="imageDialog" max-width="1000" max-height="560" @click:outside="$emit('imageClose')">
    <v-carousel>
      <v-carousel-item v-for="(image, i) in images" :key="i" :src="image" contain>
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    imageDialog: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      default: null,
    },
  },
})
</script>