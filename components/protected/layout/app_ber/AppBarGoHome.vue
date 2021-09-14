<template>
  <v-btn height="45" width="45" dark color="blue lighten-5" class="ma-4" small>
    <v-avatar tile elevation="1" @click="pushPlans">
      <v-img
        max-height="30"
        max-width="30"
        :src="require('@/assets/logo.png')"
      />
    </v-avatar>
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
