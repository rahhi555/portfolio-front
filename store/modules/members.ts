import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Member, Plan } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore, UserStore, PlansStore } from '~/utils/store-accessor'

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

  public get currentUserAccept() {
    if (!this.membersState) return
    const currentUserMember = this.membersState.find((member) => member.userId === UserStore.currentUser.id)
    return currentUserMember?.accept
  }

  @Mutation
  public setMembersMutation(members: Member[]) {
    this.membersState = members
  }

  @Mutation
  public addMembersMutation(member: Member) {
    this.membersState?.push(member)
  }

  @Mutation
  private exitMembersMutation(member: Member) {
    const index = this.membersState!.findIndex(m => m.id === member.id)

    this.membersState?.splice(index, 1)

    const parentPlan = PlansStore.plans.find((plan) => plan.id === member!.planId)
    if (!parentPlan) return

    PlansStore.updateOrDeleteMember({member, deleteFlg: true})
  }

  @Mutation
  public updateMemberMutation(member: Member) {
    const index = this.membersState!.findIndex((m) => m.id === member.id)
    this.membersState?.splice(index, 1, member)

    const parentPlan = PlansStore.plans.find((plan) => plan.id === member.planId)
    if (!parentPlan) return

    PlansStore.updateOrDeleteMember({member})
  }

  @Action({ rawError: true })
  public async indexMembers(planId: string) {
    const members = await $axios.$get(`/api/v1/plans/${planId}/members`)
    this.setMembersMutation(members)
  }

  @Action({ rawError: true })
  public async exitMembers(member: Member) {
    await $axios
      .$delete(`/api/v1/members/${member.id}`)
      .then(() => this.exitMembersMutation(member))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'delete' }))
  }

  @Action({ rawError: true })
  public async updateMember({ id, roleId, accept }: { id: number; roleId?: number; accept?: boolean }) {
    const member = { roleId, accept }

    await $axios
      .$patch(`/api/v1/members/${id}`, { member })
      .then((member) => this.updateMemberMutation(member))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'update' }))
  }

  @Action({ rawError: true })
  public async joinRequest(plan: Plan) {
    if (!confirm('承認リクエストを送信してよろしいですか？')) {
      alert('承認リクエストをキャンセルしました')
      return
    }

    const member = { user_id: UserStore.currentUser.id, accept: false }

    await $axios
      .$post(`/api/v1/plans/${plan.id}/members`, { member })
      .then((member: Member) => PlansStore.addMember({ id: plan.id, member }))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: '承認リクエスト', crud: 'create' }))
  }
}
