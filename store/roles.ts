import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Role } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/store'

interface RoleParams {
  id?: number | string
  name: string
  description: string
  planId?: number | string
}

const MODEL = 'ロール'

@Module({
  name: 'roles',
  stateFactory: true,
  namespaced: true,
})
export default class Roles extends VuexModule {
  private rolesState: Role[] | null = null

  public get roles() {
    return this.rolesState
  }

  public get currentPlanId() {
    const planIds = this.rolesState?.map((role) => role.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : false
  }

  @Mutation
  private setRolesMutation(roles: Role[]) {
    this.rolesState = roles
  }

  @Mutation
  private addRoleMutation(role: Role) {
    this.rolesState?.push(role)
  }

  @Mutation
  private deleteRoleMutation(id: number) {
    const index = this.rolesState!.findIndex((role) => role.id === id)
    this.rolesState?.splice(index, 1)
  }

  @Mutation
  private updateRoleMutation(role: Role) {
    const { id, name, description } = role
    const target = this.rolesState?.find((value) => value.id === id)
    target!.name = name
    target!.description = description
  }

  @Action({ rawError: true })
  public async indexRoles(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    await $axios.$get(`/api/v1/plans/${planId}/roles`).then((roles) => {
      this.setRolesMutation(roles)
    })
  }

  @Action({ rawError: true })
  public async createRole({ planId, name, description }: RoleParams) {
    const role = { name, description }
    await $axios
      .$post(`/api/v1/plans/${planId}/roles`, { role })
      .then(res => this.addRoleMutation(res))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'create' }))
  }

  @Action({ rawError: true })
  public async deleteRole(id: number) {
    await $axios
      .$delete(`/api/v1/roles/${id}`)
      .then(() => this.deleteRoleMutation(id))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'delete' }))
  }

  @Action({ rawError: true })
  public async updateRole({ id, name, description }: RoleParams) {
    const role = { name, description }
    await $axios
      .$patch(`/api/v1/roles/${id}`, { role })
      .then(res => this.updateRoleMutation(res))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'update' }))    
  }
}
