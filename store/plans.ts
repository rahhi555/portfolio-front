import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Plan, Member } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore, UserStore } from '~/utils/store-accessor'

const MODEL = '計画'

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

  public get currentUserMember() {
    const members = this.plansState?.flatMap(plan => plan.members)
    return members?.filter(member => member.userId === UserStore.currentUser.id)
  }

  @Mutation
  private setCurrentPlanMutation(plan: Plan) {
    this.currentPlanState = plan
  }

  @Mutation
  private setPlansMutation(plans: Plan[]) {
    this.plansState = plans
  }

  @Mutation
  private addPlansMutation(plan: Plan) {
    this.plansState?.push(plan)
  }

  @Mutation
  public addMember({id, member}: {id:number, member:Member}) {
    const index = this.plansState!.findIndex(plan => plan.id === id)
    console.log('index', index)
    console.log('target', this.plansState[index])
    this.plansState[index].members.push(member)
    console.log('target', this.plansState[index])
  }

  @Mutation
  private deletePlansMutation(id: number) {
    const index = this.plansState!.findIndex(plan => plan.id === id)
    this.plansState?.splice(index, 1)
  }

  @Action({ rawError: true })
  public async setCurrentPlan(planId: string) {
    if(this.currentPlanState?.id === Number.parseInt(planId)) return
    const plan = await $axios.$get(`/api/v1/plans/${planId}`)
    this.setCurrentPlanMutation(plan)
  }

  @Action({ rawError: true })
  public async indexPlans() {
    const plans = await $axios.$get(`/api/v1/plans`)
    this.setPlansMutation(plans)
  }

  @Action({ rawError: true })
  public async createPlan({ name, published }: { name: string, published: boolean }) {
    const plan = { name, published }
    await $axios
      .$post('/api/v1/plans', { plan })
      .then((post) => this.addPlansMutation(post))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({model: MODEL, crud: 'create'}))
  }

  @Action({ rawError: true })
  public async deletePlan(plan: Plan) {
    if(!confirm(`計画 ${plan.name} を削除してもよろしいですか？`)) {
      alert('キャンセルしました')
      return
    }
    await $axios
      .$delete(`/api/v1/plans/${plan.id}`)
      .then(() => this.deletePlansMutation(plan.id))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({model: MODEL, crud: 'delete'})) 
  }
}
