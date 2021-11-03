import { computed } from "@nuxtjs/composition-api"

// editページ判定
const isEditPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('edit')
})

export default {
  isEditPage
}