import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Member } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'

const MODEL = 'メンバー'

@Module({
  name: 'modules/members',
  stateFactory: true,
  namespaced: true,
})
export default class Members extends VuexModule {
  private membersState: Member[] | null = null

  public get members() {
    return this.membersState
  }

  public get currentPlanId() {
    const planIds = this.membersState?.map((member) => member.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : false
  }

  @Mutation
  private setMembersMutation(members: Member[]) {
    this.membersState = members
  }

  @Mutation
  private exitMembersMutation(id: number){
    const index = this.membersState!.findIndex(member => member.id === id)
    this.membersState?.splice(index, 1)
  }

  @Mutation
  private updateMemberMutation(member: Member){
    const index = this.membersState!.findIndex(m => m.id === member.id)
    this.membersState?.splice(index, 1, member)
  }

  @Action({ rawError: true })
  public async indexMembers(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    const members = await $axios.$get(`/api/v1/plans/${planId}/members`)
    this.setMembersMutation(members)
  }

  @Action({ rawError: true })
  public async exitMembers(id: number) {
    await $axios
    .$delete(`/api/v1/members/${id}`)
    .then(() => this.exitMembersMutation(id))
    .catch(() => SnackbarStore.catchError())
    .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'delete' }))
  }

  @Action({ rawError: true })
  public async updateMember({id, roleId , accept}: { id: number, roleId?: number , accept?: boolean }) {
    const member = { roleId, accept }

    await $axios
    .$patch(`/api/v1/members/${id}`, { member })
    .then(member => this.updateMemberMutation(member))
    .catch(() => SnackbarStore.catchError())
    .finally(() => SnackbarStore.CRUDvisible({model: MODEL, crud: 'update'}))
  }
}
