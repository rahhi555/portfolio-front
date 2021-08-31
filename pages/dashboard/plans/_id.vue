<template>
  <p @click="test">
    {{ id }}
    aaaaaaaaa
  </p>
</template>

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'protected',

  setup(){
    const route = useRoute()
    const test = () => {
      console.log(route.value)
    }
    const id = route.value.params.id

    return {
      id,
      test
    }
  }
})
</script>