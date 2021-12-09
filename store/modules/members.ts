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
    if(!this.membersState) return
    const currentUserMember = this.membersState.find(member => member.userId === UserStore.currentUser.id)
    return currentUserMember?.accept
  }

  @Mutation
  public setMembersMutation(members: Member[]) {
    console.log(members)
    this.membersState = members
    console.log(members)
  }

  @Mutation
  private addMembersMutation(member: Member) {
    this.membersState?.push(member)
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

  @Action({ rawError: true })
  public async joinRequest(plan: Plan)  {
    if (!confirm('承認リクエストを送信してよろしいですか？')) {
      alert('承認リクエストをキャンセルしました')
      return
    }

    const member = { user_id: UserStore.currentUser.id, accept: false }

    const isIdPage = !!window.$nuxt.$route.params.id

    await $axios
      .$post(`/api/v1/plans/${plan.id}/members`, { member })
      .then((member: Member) => 
        // 計画一覧ページならPlansStoreに追加、計画ページならMembersStoreに追加
        isIdPage ? this.addMembersMutation(member) : PlansStore.addMember({ id: plan.id, member })       
      )
      .catch(() => SnackbarStore.catchError())
      .finally(() =>
        SnackbarStore.CRUDvisible({ model: '承認リクエスト', crud: 'create' })
      )
  }
}
