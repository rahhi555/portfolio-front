import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/ui/snackbar'
import User from '~/store/user'
import Roles from '~/store/modules/roles'
import Plans from '~/store/modules/plans'
import Members from '~/store/modules/members'
import Maps from '~/store/modules/maps'
import Svgs from '~/store/modules/svgs'

let SnackbarStore: Snackbar
let UserStore: User
let RolesStore: Roles
let PlansStore: Plans
let MembersStore: Members
let MapsStore: Maps
let SvgsStore: Svgs

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
  UserStore = getModule(User, store)
  RolesStore = getModule(Roles, store)
  PlansStore = getModule(Plans, store)
  MembersStore = getModule(Members, store)
  MapsStore = getModule(Maps, store)
  SvgsStore = getModule(Svgs, store)
}

export {
  initialiseStores,
  SnackbarStore,
  UserStore,
  RolesStore,
  PlansStore,
  MembersStore,
  MapsStore,
  SvgsStore
}
