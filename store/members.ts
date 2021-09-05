import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Member } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'

const MODEL = 'メンバー'

@Module({
  name: 'members',
  stateFactory: true,
  namespaced: true,
})
export default class Members extends VuexModule {
  private membersState: Member[] | null = null

  public get members() {
    return this.membersState
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

  @Action({ rawError: true })
  public async setMembers(planId: string) {
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
}
