import { computed } from "@nuxtjs/composition-api"
import { PlansStore } from "~/store"

// editページ判定
export const isEditPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('edit')
})

// showページ判定
export const isShowPage = computed(() => {
  if (process.server) return false
  return window.$nuxt.$route.name?.endsWith('show')
})

/** 計画IDページかつ計画がアクティブかどうか */
export const isPlanActive = computed(() => {
  if(process.server) return false
  const isNotPlansPage = window.$nuxt.$route.name !== 'dashboard-plans'
  return !!PlansStore.currentPlan?.active && isNotPlansPage
})

/** smAndDownかつ閲覧しているページが計画詳細ページ  */
export const isSmAndDownWithPlanShow = computed(() => {
  if(process.server) return false
  
  return window.$nuxt.$route.name?.endsWith('show') && window.$nuxt.$vuetify.breakpoint.smAndDown
})