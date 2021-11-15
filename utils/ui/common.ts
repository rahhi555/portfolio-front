import { computed } from "@nuxtjs/composition-api"

// editページ判定
const isEditPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('edit')
})

// showページ判定
const isShowPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('show')
})

export default {
  isEditPage,
  isShowPage
}