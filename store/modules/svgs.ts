import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  SvgType,
  Rect,
  SVGRectMouseEvent,
  SVGRectKeyboardEvent,
} from 'interface'
import { MapsStore, SnackbarStore } from '~/store'
import { $axios } from '~/utils/axios-accessor'

type SvgTypeKeys = keyof SvgType

@Module({
  name: 'modules/svgs',
  stateFactory: true,
  namespaced: true,
})
export default class Svgs extends VuexModule {
  private svgsState: SvgType[] = []

  // すべてのsvgを返す
  public get allRects(): Rect[] {
    return this.svgsState
  }

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

  // 操作中のsvgのElement。これを指定して表示順を操作する。
  private targetElement: SVGGElement | null = null

  @Mutation
  public setTargetId(e: SVGRectMouseEvent | SVGRectKeyboardEvent | number) {
    if (typeof e === 'number') {
      this.targetId = e
      this.targetElement = null
      return
    }
    const parentSVG = e.target.parentNode
    if (!(parentSVG instanceof SVGGElement)) {
      return
    }
    this.targetElement = parentSVG

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

  // svg更新(otherTargetIdが渡されなければtargetSvgを対象)
  @Mutation
  public changeSvg({
    status,
    value,
    otherTargetId,
  }: {
    status: SvgTypeKeys
    value: number | string
    otherTargetId?: number
  }) {
    let target: SvgType | undefined

    if (otherTargetId) {
      target = this.svgsState.find((svg) => svg.id === otherTargetId)
    } else {
      target = this.svgsState.find((svg) => svg.id === this.targetId)
    }

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
    for (const svg of this.svgsState) {
      if (svg.isUpdated) svg.isUpdated = false
    }
  }

  // isUpdatedがtrueの図形をすべてapiに更新リクエストする
  @Action
  public updateSvgs() {
    if (!this.updatedSvgs.length) {
      return
    }
    Promise.all(
      this.updatedSvgs.map((svg) => {
        // ストロングパラメータ用に余分な属性を削除
        const shallowSvg = Object.assign({}, svg)
        const invalidKeys = [
          'mapId',
          'todoListId',
          'createdAt',
          'updatedAt',
          'planId',
          'isUpdated',
        ]
        for (const key in invalidKeys) {
          delete shallowSvg[key]
        }
        return $axios.$patch(`/api/v1/svgs/${svg.id}`, { svg: shallowSvg })
      })
    )
      .then(() => {
        this.resetUpdated()
        SnackbarStore.miniSnackbarVisible('Update Success')
      })
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'エラーが発生しました',
        })
      )
  }

  // svg削除
  @Mutation
  private deleteSvgMutation() {
    const index = this.svgsState.findIndex((svg) => svg.id === this.targetId)
    this.svgsState.splice(index, 1)
  }

  @Action
  public async deleteSvg(e: SVGRectKeyboardEvent) {
    this.setTargetId(e)
    await $axios.$delete(`/api/v1/svgs/${this.targetId}`).then(() => {
      this.deleteSvgMutation()
    })
    this.setTargetId(0)
  }

  // svg並び替え
  @Mutation
  private sortSvgs(sort: SvgTypeKeys) {
    // @ts-ignore
    this.svgsState.sort((svg1, svg2) => svg1[sort] - svg2[sort])
  }

  // svg表示順変更
  @Action({ rawError: true })
  public changeOrder(order: 'top' | 'bottom' | 'up' | 'down') {
    if (!this.targetElement || !this.targetSvg) {
      return
    }
    const targetX = {
      start: this.targetSvg.x,
      end: this.targetSvg.x + this.targetSvg.width,
    }
    const targetY = {
      start: this.targetSvg.y,
      end: this.targetSvg.y + this.targetSvg.height,
    }
    // 現在操作している図形に重なっている図形
    const overlapRects: Rect[] = this.activeMapRects.filter((rect) => {
      if (rect.id === this.targetSvg?.id) return false

      const rectX = { start: rect.x, end: rect.x + rect.width }
      const rectY = { start: rect.y, end: rect.y + rect.height }
      return (
        ((rectX.start < targetX.start && targetX.start <= rectX.end) ||
          (targetX.start <= rectX.start && rectX.start <= targetX.end)) &&
        ((rectY.start < targetY.start && targetY.start <= rectY.end) ||
          (targetY.start <= rectY.start && rectY.start <= targetY.end))
      )
    })

    // 次に重なっている図形
    const getNextRect = () => {
      const sortRects = overlapRects
        .concat()
        .sort((svg1, svg2) => svg1.displayOrder - svg2.displayOrder)
      const nextRect = sortRects.find(
        (rect) => rect.displayOrder > this.targetSvg!.displayOrder
      )
      if (!nextRect) return
      return nextRect
    }
    const nextRect = getNextRect()

    // 前に重なっている図形
    const getPrevRect = () => {
      const sortRects = overlapRects
        .concat()
        .sort((svg1, svg2) => svg2.displayOrder - svg1.displayOrder)
      const prevRect = sortRects.find(
        (rect) => rect.displayOrder < this.targetSvg!.displayOrder
      )
      if (!prevRect) return
      return prevRect
    }
    const prevRect = getPrevRect()

    // 変更する前のdisplayOrderを取得。upとdownで入れ替えするために必要
    const targetDisplayOrder = this.targetSvg.displayOrder

    switch (order) {
      case 'top':
        if (!nextRect) return
        this.changeSvg({
          status: 'displayOrder',
          value: Math.max(...overlapRects.map((rect) => rect.displayOrder)) + 1,
        })
        break
      case 'bottom':
        this.changeSvg({
          status: 'displayOrder',
          value: Math.min(...overlapRects.map((rect) => rect.displayOrder)) - 1,
        })
        break
      case 'up':
        // 現在操作している図形と次の図形のdisplayOrderを入れ替える
        if (!nextRect) return
        this.changeSvg({
          status: 'displayOrder',
          value: nextRect!.displayOrder,
        })
        this.changeSvg({
          status: 'displayOrder',
          value: targetDisplayOrder,
          otherTargetId: nextRect!.id,
        })
        break
      case 'down':
        if (!prevRect) return
        this.changeSvg({
          status: 'displayOrder',
          value: prevRect!.displayOrder,
        })
        this.changeSvg({
          status: 'displayOrder',
          value: targetDisplayOrder,
          otherTargetId: prevRect!.id,
        })
        break
    }
    this.sortSvgs('displayOrder')
  }

  // todoリストをsvgにドラッグした際に塗りつぶす
  @Mutation
  public dragEnterMutaion() {
    const targetSvg = this.svgsState.find((svg) => svg.id === this.targetId)
    if(!targetSvg) return
    targetSvg.fill = 'red'
  }

  // 塗りつぶしを解除する
  @Mutation
  public dragLeaveMutaion() {
    const targetSvg = this.svgsState.find((svg) => svg.id === this.targetId)
    if(!targetSvg) return
    targetSvg.fill = 'white'
    this.targetId = 0
  }

  // svgにtodoリスト紐付け
  @Mutation
  private attachTodoListMutation(todoListId: number | null) {
    const target = this.svgsState.find(svg => svg.id === this.targetId)
    target!.todoListId = todoListId
  }

  @Action
  public async attachTodoList(todoListId: number | null) {
    if(!this.targetId) return
    await $axios.$patch(`/api/v1/svgs/${this.targetId}`, { svg: { todoListId } })
    .then(() => { 
      this.attachTodoListMutation(todoListId) 
      SnackbarStore.miniSnackbarVisible('Attach Success')
    })
    .catch(() => SnackbarStore.visible({ color: 'error', message: 'todoリストの紐付けに失敗しました' }))
  }
}
