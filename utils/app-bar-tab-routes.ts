import { AppBarTab } from 'interface'

interface TabRoutes {
  [key: string]: AppBarTab[]
}

const tabRoutes: TabRoutes = {
  dashboardPlans: [
    { name: '全計画', link: '', selected: true },
    { name: 'マイ計画', link: '', selected: false },
  ],
  dashboardPlansId: [
    { name: 'ホーム', link: '/dashboard/plans/:id'},
    { name: 'メンバー一覧', link: '/dashboard/plans/:id/member' },
    { name: 'マップ編集', link: '' },
  ],
}

const routePear = {
  'dashboard-plans': tabRoutes.dashboardPlans,
  'dashboard-plans-id': tabRoutes.dashboardPlansId,
  'dashboard-plans-id-member': tabRoutes.dashboardPlansId
}

export const getPear = () => {
  if(process.server) return
  const routeName = window.$nuxt.$route.name 
  const paramsId = window.$nuxt.$route.params.id

  // :idを実際のidに置換する
  if(paramsId) {
    for(const tab in tabRoutes) {
      for(const values of tabRoutes[tab]) {
        values.link = values.link?.replace(/:id/, paramsId)
      }
    }
  }
  // @ts-ignore
  return routePear[routeName]
}