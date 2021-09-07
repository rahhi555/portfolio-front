import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Plan } from 'interface'
import { $axios } from '~/utils/axios-accessor'

@Module({
  name: 'plans',
  stateFactory: true,
  namespaced: true,
})
export default class Plans extends VuexModule {
  private currentPlanState: Plan | null = null

  private plansState: Plan[] | null = null

  public get currentPlan() {
    return this.currentPlanState
  }

  public get plans() {
    return this.plansState
  }  

  @Mutation
  private setCurrentPlanMutation(plan: Plan) {
    this.currentPlanState = plan
  }

  @Mutation
  private setPlansMutation(plans: Plan[]) {
    this.plansState = plans
  }

  @Action({ rawError: true })
  public async setCurrentPlan(planId: string) {
    if(this.currentPlanState?.id === Number.parseInt(planId)) return
    const plan = await $axios.$get(`/api/v1/plans/${planId}`)
    this.setCurrentPlanMutation(plan)
  }

  @Action({ rawError: true })
  public async setPlans() {
    const plans = await $axios.$get(`/api/v1/plans`)
    this.setPlansMutation(plans)
  }
}
