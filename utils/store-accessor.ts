import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/snackbar'

let SnackbarStore: Snackbar

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
}

export { initialiseStores, SnackbarStore }