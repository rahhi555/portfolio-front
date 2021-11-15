import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Map } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'

const MODEL = 'マップ'

interface MapParams {
  id?: number
  planId?: number
  name?: string
  isGoogleMap?: boolean
  address?: string
  bounds?: google.maps.LatLngBoundsLiteral
  heading?: number
  width?: number
  height?: number
}

@Module({
  name: 'modules/maps',
  stateFactory: true,
  namespaced: true,
})
export default class Maps extends VuexModule {
  private mapsState: Map[] = []

  private activeIndexState: number = 0

  private get currentPlanId() {
    const planIds = this.mapsState?.map((map) => map.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : false
  }

  public get maps() {
    return this.mapsState
  }

  public get activeIndex() {
    return this.activeIndexState
  }

  public get activeMap() {
    return this.mapsState[this.activeIndexState]
  }

  @Mutation
  public setActiveIndex(index: number) {
    this.activeIndexState = index
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
    if(index !== 0) {
      this.activeIndexState = index - 1
    }
  }

  @Mutation
  private updateMapMutation(newMap: Map) {
    const { id } = newMap
    const index = this.mapsState?.findIndex((map) => map.id === id)
    this.mapsState.splice(index, 1, newMap)
  }

  @Action
  public async indexMaps(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    await $axios
      .$get(`/api/v1/plans/${planId}/maps`)
      .then(maps => this.setMapsMutation(maps))
  }

  @Action
  public async createMap({ planId, name, isGoogleMap }: { planId: string, name: string, isGoogleMap: boolean }) {
    const map = { name, isGoogleMap }
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
  public async updateMap(params: MapParams) {
    const map = params
    await $axios
      .$patch(`/api/v1/maps/${params.id}`, { map })
      .then(res => this.updateMapMutation(res))
      .catch(() => SnackbarStore.catchError())
      .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'update' }))    
  }
}
