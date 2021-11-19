import { AppBarTab } from 'interface'
import { PlansStore } from '~/store'

interface TabRoutes {
  [key: string]: AppBarTab[]
}

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

const routePear = {
  'dashboard-plans': tabRoutes.dashboardPlans,
  'dashboard-plans-id': tabRoutes.dashboardPlansId,
  'dashboard-plans-id-maps-show': tabRoutes.dashboardPlansId,
  'dashboard-plans-id-todo-list': tabRoutes.dashboardPlansId,
  'dashboard-plans-id-maps-edit': tabRoutes.dashboardPlansId,
  'dashboard-plans-id-members': tabRoutes.dashboardPlansId,
}

// tabRoutesの配列内の要素に対して処理するメソッド
const tabRoutesValuesMap = (func: (values: AppBarTab) => void) => {
  for(const tab in tabRoutes) {
    for(const values of tabRoutes[tab]) {
      func(values)
    }
  }  
}

export const getPear = () => {
  if(process.server) return
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
    const returnRoutes = tabRoutes.dashboardPlansId.filter((route) => {
      return !route.activePlanIgnore
    })
    return returnRoutes
  }

  // @ts-ignore
  return routePear[routeName]
}