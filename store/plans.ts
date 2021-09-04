import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Plan } from 'interface'
import { $axios } from '~/utils/axios-accessor'

@Module({
  name: 'plans',
  stateFactory: true,
  namespaced: true,
})
export default class Plans extends VuexModule {
  private planState: Plan | null = null

  public get plan() {
    return this.planState
  }

  @Mutation
  private setPlanMutation(plan: Plan) {
    this.planState = plan
  }

  @Action({ rawError: true })
  public async setPlan(planId: string) {
    const plan = await $axios.$get(`/api/v1/plans/${planId}`)
    this.setPlanMutation(plan)
  }
}
