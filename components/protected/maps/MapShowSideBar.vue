<template>
  <todos
    :cols="cols"
    :is-edit="false">
  </todos>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Todos from '~/components/protected/todos/Todos.vue'

export default defineComponent({
  components: {
    Todos,
  },

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
