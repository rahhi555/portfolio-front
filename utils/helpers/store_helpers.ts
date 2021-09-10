import { PlansStore, MapsStore, MembersStore, RolesStore, SvgsStore } from "~/store";

export const initializeStore = async (planId: string): Promise<void> => {
  await Promise.all([
    PlansStore.setCurrentPlan(planId),
    MapsStore.indexMaps(planId),
    SvgsStore.indexSvgs(planId),
    MembersStore.indexMembers(planId),
    RolesStore.indexRoles(planId)
  ])
} 