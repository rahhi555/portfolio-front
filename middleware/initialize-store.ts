import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import { PlansStore, MapsStore, MembersStore, RolesStore, SvgsStore } from "~/store";

const initializeStore = async (planId: string): Promise<void> => {
  await Promise.all([
    PlansStore.setCurrentPlan(planId),
    MapsStore.indexMaps(planId),
    SvgsStore.indexSvgs(planId),
    MembersStore.indexMembers(planId),
    RolesStore.indexRoles(planId)
  ])
} 

export default defineNuxtMiddleware(async ({route, app}) => {
  const planId = route.params.id
  if(Number.parseInt(planId) === PlansStore.currentPlan?.id) return
  app.loading = true
  await initializeStore(planId)
  app.loading = false
})