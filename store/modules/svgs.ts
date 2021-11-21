import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  AllSvgType,
  Rect,
} from 'interface'
import { MapsStore, SnackbarStore, SvgsStore } from '~/store'
import { $axios } from '~/utils/axios-accessor'

type AllSvgTypeKeys = keyof AllSvgType

export interface SvgParams {
  id?: number
  type?: 'Rect' | 'Path' | 'Polyline'
  userId?: number
  mapId?: number
  x?: number
  y?: number
  name?: string
  width?: number
  height?: number
  drawPoints?: string
  displayTime?: number
}

@Module({
  name: 'modules/svgs',
  stateFactory: true,
  namespaced: true,
})
export default class Svgs extends VuexModule {
  private svgsState: AllSvgType[] = []

  // すべてのsvgを返す
  public get allSvgs(): Rect[] {
    return this.svgsState
  }

  // 現在のマップのsvgを返す
  public get activeMapSvgs() {
    return (type: 'Rect' | 'Path' | 'Polyline') => {
      const activeMapId = MapsStore.activeMap?.id
      const svgs = this.svgsState.filter(
        (svg) => svg.mapId === activeMapId && svg.type === type
      )
      return svgs
    }
  }

  // 移動中のrectのidを固定する変数。これがないと素早くマウスを動かした時にイベントターゲットが存在せずエラーになる。
  private targetId: number = 0


  @Mutation
  public setTargetId(e: PointerEvent | KeyboardEvent | number) {
    if (typeof e === 'number') {
      this.targetId = e
      return
    }
    const target = e.target as SVGGElement
    const parentSVG = target.parentNode
    if (!(parentSVG instanceof SVGGElement)) {
      return
    }

    const id = Number(parentSVG?.id.replace('svg-', ''))
    this.targetId = id
  }

  public get targetSvg(): AllSvgType | undefined {
    return this.svgsState.find((svg) => svg.id === this.targetId)
  }

  // svg全取得
  @Mutation
  private setSvgsMutation(svgs: AllSvgType[]) {
    this.svgsState = svgs
  }

  @Action
  public async indexSvgs(planId: string) {
    await $axios
      .$get<AllSvgType[]>(`/api/v1/plans/${planId}/svgs`)
      .then((svgs) => {
        for (const svg of svgs) {
          svg.isUpdated = false
        }
        this.setSvgsMutation(svgs)
      })
  }

  // svg作成
  @Mutation
  public addSvgMutation(svg: AllSvgType) {
    // アクションケーブル処理は自分自身に跳ね返るので、idが重複する恐れがある。左記を防止するため、idが重複していればリターンする
    if(SvgsStore.svgsState.some(stateSvg => stateSvg.id === svg.id)) return
    
    svg.isUpdated = false
    this.svgsState.push(svg)
  }

  @Action
  public async addSvg(svg: SvgParams) {
    await $axios
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
    status: AllSvgTypeKeys
    value: number | string
    otherTargetId?: number
  }) {
    let target: AllSvgType | undefined

    if (otherTargetId) {
      target = this.svgsState.find((svg) => svg.id === otherTargetId)
    } else {
      target = this.svgsState.find((svg) => svg.id === this.targetId)
    }

    if (!target) return

    if(target.isUpdated !== undefined) {
      target.isUpdated = true
    }

    // @ts-ignore
    target[status] = value
  }

  private get updatedSvgs(): AllSvgType[] {
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
  public deleteSvgMutation(id?: number) {
    const targetId = id === undefined ? this.targetId : id
    const index = this.svgsState.findIndex((svg) => svg.id === targetId)
    this.svgsState.splice(index, 1)
  }

  @Action
  public async deleteSvg(e: KeyboardEvent | number | PointerEvent) {
    this.setTargetId(e)
    await $axios.$delete(`/api/v1/svgs/${this.targetId}`).then(() => {
      this.deleteSvgMutation()
    })
    this.setTargetId(0)
  }

  // svg並び替え
  @Mutation
  private sortSvgs(sort: AllSvgTypeKeys) {
    // @ts-ignore
    this.svgsState.sort((svg1, svg2) => svg1[sort] - svg2[sort])
  }

  // svg表示順変更
  @Action({ rawError: true })
  public changeOrder(order: 'top' | 'bottom' | 'up' | 'down') {
    if (!this.targetSvg) {
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
    const overlapRects: Rect[] = this.activeMapSvgs('Rect').filter((rect) => {
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

  // todoリストをsvgにアタッチまたはデタッチ
  @Mutation
  private attachTodoListMutation(svg: AllSvgType) {
    const target = this.svgsState.find(s => s.id === svg.id )
    target!.fill = svg.fill
    target!.todoListId = svg.todoListId
  }

  @Action
  public async attachTodoList(todoListId: number | null) {
    if(!this.targetId) return
    await $axios.$patch(`/api/v1/svgs/${this.targetId}`, { svg: { todoListId } })
    .then((res) => { 
      this.attachTodoListMutation(res) 
      SnackbarStore.miniSnackbarVisible('Attach Success')
    })
    .catch(() => SnackbarStore.visible({ color: 'error', message: 'todoリストの紐付けに失敗しました' }))
  }
}
