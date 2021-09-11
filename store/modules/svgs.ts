import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { SvgType, Rect } from 'interface'
import { MapsStore, SnackbarStore } from '~/utils/store-accessor'
import { $axios } from '~/utils/axios-accessor'

type SvgTypeKeys = keyof SvgType

@Module({
  name: 'modules/svgs',
  stateFactory: true,
  namespaced: true,
})
export default class Svgs extends VuexModule {
  private svgsState: SvgType[] = []

  // 移動中のrectのidを固定する変数。これがないと素早くマウスを動かした時にイベントターゲットが存在せずエラーになる。
  private targetId: number = 0

  private get currentPlanId() {
    const planIds = this.svgsState?.map((svg) => svg.planId)
    if (!planIds) return false
    const isAllEqual = planIds?.every((planId) => planId === planIds[0])
    return isAllEqual ? planIds[0] : false
  }

  public get activeMapRects(): Rect[] {
    const activeMapId = MapsStore.activeMap?.id
    const svgs =  this.svgsState.filter(svg => (svg.mapId === activeMapId && svg.type === 'Rect' )) as Rect[]
    return svgs.concat()
  }

  public get targetSvg(): SvgType | undefined {
    return this.svgsState.find((svg) => svg.id === this.targetId )
  }

  @Mutation
  private setSvgsMutation(svgs: SvgType[]) {
    this.svgsState = svgs
  }

  @Mutation
  public setTargetId(id: number) {
    this.targetId = id
  }

  @Mutation
  public changeSvg({ status, value }: {status: SvgTypeKeys, value: number | string }){
    const target = this.svgsState.find((svg) => svg.id === this.targetId )
    if(!target) return
    // @ts-ignore
    target[status] = value
  }

  @Mutation
  private addSvgMutation(svg: SvgType) {
    this.svgsState.push(svg)
  }

  @Action
  public async indexSvgs(planId: string) {
    if(this.currentPlanId === Number.parseInt(planId)) return
    await $axios
      .$get(`/api/v1/plans/${planId}/svgs`)
      .then(svgs => this.setSvgsMutation(svgs))
  }

  @Action
  public addRect() {
    const svg = {
      type: 'Rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      name: 'new Rect'
    }
    $axios
      .$post(`/api/v1/maps/${MapsStore.activeMap.id}/svgs`, { svg })
      .then((res) => this.addSvgMutation(res))
      .catch(() => SnackbarStore.visible({ color: 'error', message: 'エラーが発生しました' }))
  }
}