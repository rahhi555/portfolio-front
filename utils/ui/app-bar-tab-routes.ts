import { ref } from '@nuxtjs/composition-api'
import { AppBarTab } from 'interface'
import { PlansStore } from '~/store'

interface TabRoutes {
  [key: string]: AppBarTab[]
}

/** 全タブの雛形 */
const tabRoutes: TabRoutes = {
  dashboardPlans: [
    { name: '全計画', link: '', selected: true, activePlanIgnore: false },
    { name: 'マイ計画', link: '', selected: false, activePlanIgnore: false },
  ],
  dashboardPlansId: [
    { name: 'ホーム', link: '/dashboard/plans/:id', selected: false, activePlanIgnore: false },
    { name: 'マップ閲覧', link: '/dashboard/plans/:id/maps/show', selected: false, activePlanIgnore: false},
    { name: 'Todoリスト', link: '/dashboard/plans/:id/todo-list', selected: false, activePlanIgnore: true },
    { name: 'マップ編集', link: '/dashboard/plans/:id/maps/edit', selected: false, activePlanIgnore: true },
    { name: 'メンバー一覧', link: '/dashboard/plans/:id/members', selected: false, activePlanIgnore: true },
  ],
}

// 雛形を破壊しないためのコピー
let cloneTabRoutes = Object.assign({}, tabRoutes)

/** route name */
const routePear = {
  'dashboard-plans': cloneTabRoutes.dashboardPlans,
  'dashboard-plans-id': cloneTabRoutes.dashboardPlansId,
  'dashboard-plans-id-maps-show': cloneTabRoutes.dashboardPlansId,
  'dashboard-plans-id-todo-list': cloneTabRoutes.dashboardPlansId,
  'dashboard-plans-id-maps-edit': cloneTabRoutes.dashboardPlansId,
  'dashboard-plans-id-members': cloneTabRoutes.dashboardPlansId,
}

// tabRoutesの配列内の要素に対して処理するメソッド
const tabRoutesValuesMap = (func: (values: AppBarTab) => void) => {
  for(const tab in cloneTabRoutes) {
    for(const values of cloneTabRoutes[tab]) {
      func(values)
    }
  }  
}

/** 現在のペア */
export const appBarTab = ref<AppBarTab[]>()

export const setPear = () => {
  if(process.server) return

  cloneTabRoutes = Object.assign({}, tabRoutes)

  const routeName = window.$nuxt.$route.name
  const routePath = window.$nuxt.$route.path
  const paramsId = window.$nuxt.$route.params.id

  // アクセスしたパス名とlinkが同じならselectedをtrueにする
  // :idを実際のidに置換する
  if(paramsId) {
    tabRoutesValuesMap((values) => {
      values.link = values.link?.replace(/:id|\d+/, paramsId)

      if(values.link === routePath) {
        values.selected = true
      } else if(values.link) {
        values.selected = false
      }
    })
  }

  // 計画ページかつ計画が実行中の場合、activePlanIgnoreがtrueのrouteは除外する
  if(routeName !== 'dashboard-plans' && PlansStore.currentPlan?.active) {
    appBarTab.value = cloneTabRoutes.dashboardPlansId.filter((route) => {
      return !route.activePlanIgnore
    })
    return
  }

  // 計画ページかつスマホかタブレットなら、マップ編集を削除する
  const isMobileOrTablet = window.$nuxt.context.$device.isMobileOrTablet
  if(routeName !== 'dashboard-plans' && isMobileOrTablet) {
    appBarTab.value = cloneTabRoutes.dashboardPlansId.filter((route) => {
      return route.name !== 'マップ編集'
    })
    return
  }

  appBarTab.value = routePear[routeName!]
}