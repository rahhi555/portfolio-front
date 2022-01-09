<template>
  <TodosItems
    :cols="cols"
    :max-height="maxHeight"
    :bgColor="bgColor"
    >
  ></TodosItems>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const cols = {
      cols: 12,
      sm: 12,
      md: 12,
      lg: 12,
    }

    const bgColor = 'rgba(255,255,255, .8)'

    const maxHeight = '100vh'

    return {
      cols,
      bgColor,
      maxHeight
    }
  },
})
</script>
