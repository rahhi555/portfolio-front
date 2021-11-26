<template>
  <v-btn height="45" width="45" :color="isActive ? 'primary' : undefined" dark @click="pushPlans">
    <v-icon>mdi-home</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, useRouter, computed, useRoute } from '@nuxtjs/composition-api'
import { PlansStore } from '~/store'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()

    const pushPlans = () => {
      router.push('/dashboard/plans')
    }

    const isActive = computed(() => {
      const isNotPlansPage = route.value.name !== 'dashboard-plans'
      return PlansStore.currentPlan?.active && isNotPlansPage
    })

    return {
      pushPlans,
      isActive
    }
  },
})
</script>
