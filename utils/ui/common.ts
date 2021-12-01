import { computed } from "@nuxtjs/composition-api"
import { PlansStore } from "~/store"

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

/** 計画IDページかつ計画がアクティブかどうか */
const isPlanActive = computed(() => {
  if(process.server) return false
  const isNotPlansPage = window.$nuxt.$route.name !== 'dashboard-plans'
  return !!PlansStore.currentPlan?.active && isNotPlansPage
})

export default {
  isEditPage,
  isShowPage,
  isPlanActive,
}