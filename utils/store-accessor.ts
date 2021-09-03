import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/snackbar'
import User from '~/store/user'
import Roles from '~/store/roles'

let SnackbarStore: Snackbar
let UserStore: User
let RolesStore: Roles

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
  UserStore = getModule(User, store)
  RolesStore = getModule(Roles, store)
}

export { initialiseStores, SnackbarStore, UserStore, RolesStore }