<template>
  <v-btn data-tutorial="finish-tutorial" height="45" width="45" :color="isPlanActive ? 'primary' : undefined" dark @click="pushPlans">
    <v-icon>mdi-home</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, useRouter, useContext } from '@nuxtjs/composition-api'
import common from '~/utils/ui/common'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { $tutorial } = useContext()

    const pushPlans = () => {
      if($tutorial.isRunningTutorial.value) return

      router.push('/dashboard/plans')
    }

    return {
      pushPlans,
      isPlanActive: common.isPlanActive
    }
  },
})
</script>
