import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Map } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'

const MODEL = 'マップ'

@Module({
  name: 'maps',
  stateFactory: true,
  namespaced: true,
})
export default class Maps extends VuexModule {
  private mapsState: Map[] = []

  public get maps() {
    return this.mapsState
  }

  public get currentPlanId() {
    const planIds = this.mapsState?.map((map) => map.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : window.$nuxt.$route.params
  }

  @Mutation
  private setMapsMutation(maps: Map[]) {
    this.mapsState = maps
  }

  @Mutation
  private addMapMutation(map: Map) {
    this.mapsState.push(map)
  }

  @Mutation
  private deleteMapMutation(id: number) {
    const index = this.mapsState.findIndex(map => map.id === id)
    this.mapsState.splice(index, 1)
  }

  @Mutation
  private updateMapMutation(map: Map) {
    const { id, name } = map
    const target = this.mapsState?.find((value) => value.id === id)
    target!.name = name
  }

  @Action
  public async indexMaps(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    await $axios
      .$get(`/api/v1/plans/${planId}/maps`)
      .then(maps => this.setMapsMutation(maps))
  }

  @Action
  public async createMap({ planId, name }: { planId: string, name: string }) {
    const map = { name }
    await $axios
      .$post(`/api/v1/plans/${planId}/maps`, { map })
      .then(map => this.addMapMutation(map))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({model: MODEL, crud: 'create'}))
  }

  @Action({ rawError: true })
  public async deleteMap(id: number) {
    await $axios
      .$delete(`/api/v1/maps/${id}`)
      .then(() => this.deleteMapMutation(id))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'delete' }))
  }

  @Action({ rawError: true })
  public async updateMap({ id, name }: { id: number, name: string }) {
    const map = { name }
    await $axios
      .$patch(`/api/v1/maps/${id}`, { map })
      .then(res => this.updateMapMutation(res))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'update' }))    
  }
}
