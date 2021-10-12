<template>
  <TodosItems
    :cols="cols"
    :is-edit="false">
  ></TodosItems>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const cols = {
      cols: 12,
      sm: 6,
      md: 12,
      lg: 12,
    }

    return {
      cols
    }
  },
})
</script>
