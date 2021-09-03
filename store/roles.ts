import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Role } from 'interface'
import { $axios } from '~/utils/axios-accessor'


interface RoleParams {
  name: string
  description: string
  planId: string
}

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

  @Mutation
  private setRolesMutation(roles: Role[]) {
    this.rolesState = roles
  }

  @Mutation
  private addRoleMutation(role: Role) {
    this.rolesState?.push(role)
  }

  @Action({ rawError: true })
  public indexRoles(planId: string) {
    $axios.$get(`/api/v1/plans/${planId}/roles`).then(roles => {
      this.setRolesMutation(roles)
    })
  }

  @Action({ rawError: true })
  public createRole({ planId, name, description }: RoleParams) {
    const role = { name, description }
    $axios.$post(`/api/v1/plans/${planId}/roles`, { role }).then(res => {
      this.addRoleMutation(res)
    })
  }
}
