<template>
  <v-btn
    data-tutorial="finish-tutorial"
    height="45"
    width="45"
    :color="isPlanActive ? 'primary' : undefined"
    dark
    @click="pushPlans"
  >
    <v-icon>mdi-home</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { isPlanActive } from '~/utils/ui/common'

const router = useRouter()
const { $tutorial } = useContext()

const pushPlans = () => {
  if ($tutorial.isRunningTutorial.value) return

  router.push('/dashboard/plans')
}
</script>
