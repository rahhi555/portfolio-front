<template>
  <v-btn height="45" width="45" dark @click="pushPlans">
    <v-icon>mdi-home</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const router = useRouter()

    const pushPlans = () => {
      router.push('/dashboard/plans')
    }

    return {
      pushPlans,
    }
  },
})
</script>
