import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import { PlansStore, MapsStore, MembersStore, RolesStore, SvgsStore, TodoListsStore, TodoStatusesStore } from "~/store";

const initializeStore = async (planId: string): Promise<void> => {
  await Promise.all([
    PlansStore.setCurrentPlan(planId),
    MapsStore.indexMaps(planId),
    SvgsStore.indexSvgs(planId),
    MembersStore.indexMembers(planId),
    RolesStore.indexRoles(planId),
    TodoListsStore.indexTodoLists(planId)
  ])
  // 取得した計画がアクティブだったならtodoステータスを取得する
  if (PlansStore.currentPlan?.active) await TodoStatusesStore.indexTodoStatuses(planId)
} 

export default defineNuxtMiddleware(async ({route, app, redirect, res}) => {
  const planId = route.params.id

  if(Number.parseInt(planId) === PlansStore.currentPlan?.id) return
  app.loading = true
  await initializeStore(planId)
  // 計画が非公開かつユーザーが非承認なら計画一覧ページに飛ばす
  if(!PlansStore.currentPlan?.published && !MembersStore.currentUserAccept) {
    const snackbarPayload = JSON.stringify({ color: 'warning', message: '非公開の計画は承認なしで閲覧できません' })
    const encodedPayload = encodeURI(snackbarPayload)

    // 'snackbar'キーでクッキーをセットすることで、MaterialSnackbar.vueのonMounted処理でスナックバーを表示できる
    res.setHeader('Set-Cookie', `snackbar=${encodedPayload};Path=/`)
    redirect('/dashboard/plans')
  }
  app.loading = false
})