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
  private snackState: SnackParams = {
    isVisible: false,
    color: 'info',
    message: ''
  }

  public get snackParams() {
    return this.snackState
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

  @Action({ rawError: true })
  public visible(payload: Payload) {
    this.visibleMutaion(payload)
  }

  @Action({ rawError: true })
  public hidden() {
    this.hiddenMutation()
  }
}
