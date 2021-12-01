import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { TodoStatus } from 'interface'
import { SnackbarStore } from '~/store'
import { $axios } from '~/utils/axios-accessor'
import { setPear } from '~/utils/ui/app-bar-tab-routes'

export interface ChangeStatusParams {
  id: number
  status: 'todo' | 'doing' | 'done'
}

@Module({
  name: 'modules/todoStatuses',
  stateFactory: true,
  namespaced: true
})

export default class TodoStatuses extends VuexModule {
  private todoStatusesState: TodoStatus[] = []

  @Mutation
  private setTodoStatusesMutation(todoStatuses: TodoStatus[]) {
    this.todoStatusesState = todoStatuses
  }

  /** todoStatusesを返すゲッター */
  public get getAllTodoStatuses() {
    return this.todoStatusesState
  }

  /** svgIdを渡すと、それに紐付けられたtodoステータスが返ってくるゲッター */
  public get getTodoStatusesBySvgId() {
    return (svgId: number): TodoStatus[]  => {
      return this.todoStatusesState.filter(todoStatus => todoStatus.svgId === svgId)
    }
  }

  /** 計画実行時に詳細ページにアクセスしていた場合のメソッド。
   * アクションケーブルから送られるtodoStatusesをStateに代入し、スナックバーを表示させ、タブを切り替える
   **/
  @Mutation
  public initTodoStatuses(todoStatuses: TodoStatus[]) {
    this.todoStatusesState = todoStatuses
    SnackbarStore.visible({color: 'success', message: '計画が開始されました。頑張りましょう！'})
    setPear()
  }

  /** 計画終了時に詳細ページをにアクセスしていた場合のメソッド。
   * todoステータス情報をすべて削除する
   */
  @Mutation
  public clearTodoStatuses() {
    this.todoStatusesState = []
    setPear()
  }

  /** 計画実行後に詳細ページを開く場合のメソッド。todoStatusesを取得する。 */
  @Action
  public async indexTodoStatuses(planId: string) {
    await $axios
      .$get(`/api/v1/plans/${planId}/todo_statuses`)
      .then(res => this.setTodoStatusesMutation(res)
      )
      .catch(() => SnackbarStore.visible({ color: 'error', message: 'todoステータスの取得に失敗しました' }))
  }

  /** todoステータス切り替えメソッド */
  @Mutation
  public changeTodoStatus({ id, status }: ChangeStatusParams) {
    const todoStatus = this.todoStatusesState.find(todoStatus => todoStatus?.id === id)
    todoStatus!.status = status
  }
}