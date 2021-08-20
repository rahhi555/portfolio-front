import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

type Colors = 'info'|'success'|'warning'|'error'

export interface Payload {
  color: Colors;
  message: string;
}

interface SnackParams extends Payload {
  isVisible: boolean;
}

@Module({
  name: 'snackbar',
  stateFactory: true,
  namespaced: true,
})
export default class Snackbar extends VuexModule {
  private snackParams: SnackParams = {
    isVisible: false,
    color: 'info',
    message: ''
  }

  public get getParams() {
    return this.snackParams
  }

  @Mutation
  private visible(payload: Payload) {
    this.snackParams.isVisible = true
    this.snackParams.color = payload.color
    this.snackParams.message = payload.message
  }

  @Mutation
  private hidden() {
    this.snackParams.isVisible = false
  }

  @Action({ rawError: true })
  public visibleAction(payload: Payload) {
    this.visible(payload)
  }

  @Action({ rawError: true })
  public hiddenAction() {
    this.hidden()
  }
}
