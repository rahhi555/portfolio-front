import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

type Colors = 'info'|'success'|'warning'|'error'
interface CRUDpayload {
  model: string,
  crud: 'read'|'create'|'update'|'delete'
}

export interface Payload {
  color: Colors;
  message: string;
}

interface SnackParams extends Payload {
  isVisible: boolean;
}

@Module({
  name: 'ui/snackbar',
  stateFactory: true,
  namespaced: true,
})
export default class Snackbar extends VuexModule {
  private snackState: SnackParams = {
    isVisible: false,
    color: 'success',
    message: 'info'
  }

  private isError: boolean = false

  public get snackParams() {
    return this.snackState
  }

  private get isErrorStatus(): Payload {
    const success: Payload = { color: 'success', message: '成功' }
    const error: Payload = { color: 'error', message: '失敗' }
    return this.isError ? error : success
  }

  @Mutation
  private visibleMutaion(payload: Payload) {
    this.snackState.isVisible = true
    this.snackState.color = payload.color
    this.snackState.message = payload.message
  }

  @Mutation
  private hiddenMutation() {
    this.snackState.isVisible = false
  }

  @Mutation
  public catchError() {
    this.isError = true
  }

  @Mutation
  private resetIsError() {
    this.isError = false
  }

  @Action({ rawError: true })
  public visible(payload: Payload) {
    this.visibleMutaion(payload)
  }

  @Action({ rawError: true })
  public hidden() {
    this.hiddenMutation()
  }

  @Action({ rawError: true })
  public CRUDvisible({ model, crud }: CRUDpayload){
    let crudMsg: string;
    switch (crud) {
      case 'read':
        crudMsg = '取得';
        break
      case 'create':
        crudMsg = '作成';
        break
      case 'update':
        crudMsg = '更新';
        break
      case 'delete':
        crudMsg = '削除';
        break
    }
  
    const message = `${model}の${crudMsg}に${this.isErrorStatus.message}しました`
    
    this.visible({ color: this.isErrorStatus.color, message })

    this.resetIsError()
  }

  // 画面右下に表示する小型のスナックバー
  private miniSnackState = {
    isVisible: false,
    message: ''
  }

  public get miniSnackbar() {
    return this.miniSnackState
  }

  @Mutation
  public miniSnackbarVisible(message: string) {
    this.miniSnackState.isVisible = true
    this.miniSnackState.message = message
  }

  @Mutation
  public miniSnackbarHidden() {
    this.miniSnackState.isVisible = false
    this.miniSnackState.message = ''
  }
}
