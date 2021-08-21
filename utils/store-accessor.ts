import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/snackbar'
import User from '~/store/user'

let SnackbarStore: Snackbar
let UserStore: User

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
  UserStore = getModule(User, store)
}

export { initialiseStores, SnackbarStore, UserStore }