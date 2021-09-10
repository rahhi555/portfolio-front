import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { SvgType } from 'interface'
import { MapsStore } from '~/utils/store-accessor'
import { $axios } from '~/utils/axios-accessor'

@Module({
  name: 'modules/svgs',
  stateFactory: true,
  namespaced: true,
})
export default class Svgs extends VuexModule {
  private svgsState: SvgType[] = []

  private get currentPlanId() {
    const planIds = this.svgsState?.map((svg) => svg.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : false
  }

  public get activeMapSvgs() {
    const activeMapId = MapsStore.activeMap?.id
    return this.svgsState.filter(svg => svg.mapId === activeMapId)
  }

  @Mutation
  private setSvgsMutation(svgs: SvgType[]) {
    this.svgsState = svgs
  }

  @Action
  public async indexSvgs(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    await $axios
      .$get(`/api/v1/plans/${planId}/svgs`)
      .then(svgs => this.setSvgsMutation(svgs))
  }
}