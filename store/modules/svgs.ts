import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { SvgType, Rect, SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'
import { MapsStore, SnackbarStore } from '~/utils/store-accessor'
import { $axios } from '~/utils/axios-accessor'

type SvgTypeKeys = keyof SvgType

const MODEL: string = '図形'

@Module({
  name: 'modules/svgs',
  stateFactory: true,
  namespaced: true,
})
export default class Svgs extends VuexModule {
  private svgsState: SvgType[] = []

  // 現在のマップのsvgを返す
  public get activeMapRects(): Rect[] {
    const activeMapId = MapsStore.activeMap?.id
    const svgs = this.svgsState.filter(
      (svg) => svg.mapId === activeMapId && svg.type === 'Rect'
    ) as Rect[]
    return svgs.concat()
  }

  // 移動中のrectのidを固定する変数。これがないと素早くマウスを動かした時にイベントターゲットが存在せずエラーになる。
  private targetId: number = 0

  @Mutation
  public setTargetId(e: SVGRectMouseEvent | SVGRectKeyboardEvent | number) {
    if(typeof(e) === 'number') { 
      this.targetId = e 
      return
    }
    const parentSVG = e.target.parentNode
    if (!(parentSVG instanceof SVGGElement)) {
      return
    }
    const id = Number(parentSVG?.id.replace('rect-', ''))
    this.targetId = id
  }

  public get targetSvg(): SvgType | undefined {
    return this.svgsState.find((svg) => svg.id === this.targetId)
  }

  // svg全取得
  @Mutation
  private setSvgsMutation(svgs: SvgType[]) {
    this.svgsState = svgs
  }

  @Action
  public async indexSvgs(planId: string) {
    await $axios
      .$get<SvgType[]>(`/api/v1/plans/${planId}/svgs`)
      .then((svgs) => {
        for (const svg of svgs) {
          svg.isUpdated = false
        }
        this.setSvgsMutation(svgs)
      })
  }

  // svg作成
  @Mutation
  private addSvgMutation(svg: SvgType) {
    this.svgsState.push(svg)
  }

  @Action
  public addRect() {
    const svg = {
      type: 'Rect',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      name: 'new Rect',
    }
    $axios
      .$post(`/api/v1/maps/${MapsStore.activeMap.id}/svgs`, { svg })
      .then((res) => this.addSvgMutation(res))
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'エラーが発生しました',
        })
      )
  }

  // svg更新
  @Mutation
  public changeSvg({
    status,
    value,
  }: {
    status: SvgTypeKeys
    value: number | string
  }) {
    const target = this.svgsState.find((svg) => svg.id === this.targetId)
    if (!target) return
    target.isUpdated = true
    // @ts-ignore
    target[status] = value
  }

  private get updatedSvgs(): SvgType[] {
    return this.svgsState.filter((svg) => svg.isUpdated)
  }

  @Mutation
  private resetUpdated() {
    for(const svg of this.svgsState) {
      if(svg.isUpdated) svg.isUpdated = false
    }
  }

  @Action
  public updateSvgs() {
    Promise.all(
      this.updatedSvgs.map(svg => {
        const svgParams = {
          type: svg.type,
          x: svg.x,
          y: svg.y,
          fill: svg.fill,
          stroke: svg.stroke,
          name: svg.name,
          width: svg.width,
          height: svg.height,
          display_time: svg.displayTime,
          draw_points: svg.drawPoints,
        }
        return $axios.$patch(`/api/v1/svgs/${svg.id}`, { svg: svgParams })
      })
    )
    .then(() => this.resetUpdated())
    .catch(() => SnackbarStore.catchError)
    .finally(() => SnackbarStore.CRUDvisible({ model: MODEL, crud: 'update' }))
  }

  // svg削除
  @Mutation
  private deleteSvgMutation() {
    const index = this.svgsState.findIndex(svg => svg.id === this.targetId)
    this.svgsState.splice(index, 1)
  }

  @Action
  public async deleteSvg(e: SVGRectKeyboardEvent) {
    this.setTargetId(e)
    await $axios.$delete(`/api/v1/svgs/${this.targetId}`)
      .then(() => { 
        this.deleteSvgMutation() 
      })
    this.setTargetId(0)
  }
}
