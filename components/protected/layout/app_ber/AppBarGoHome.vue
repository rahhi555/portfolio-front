<template>
  <v-btn height="45" width="45" :color="isPlanActive ? 'primary' : undefined" dark @click="pushPlans">
    <v-icon>mdi-home</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import common from '~/utils/ui/common'

export default defineComponent({
  setup() {
    const router = useRouter()

    const pushPlans = () => {
      router.push('/dashboard/plans')
    }

    return {
      pushPlans,
      isPlanActive: common.isPlanActive
    }
  },
})
</script>
