import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/ui/snackbar'
import User from '~/store/user'
import Roles from '~/store/roles'
import Plans from '~/store/plans'
import Members from '~/store/members'

let SnackbarStore: Snackbar
let UserStore: User
let RolesStore: Roles
let PlansStore: Plans
let MembersStore: Members

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
  UserStore = getModule(User, store)
  RolesStore = getModule(Roles, store)
  PlansStore = getModule(Plans, store)
  MembersStore = getModule(Members, store)
}

export { initialiseStores, SnackbarStore, UserStore, RolesStore, PlansStore, MembersStore }