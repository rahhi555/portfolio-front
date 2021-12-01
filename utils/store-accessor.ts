/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Snackbar from '~/store/ui/snackbar'
import User from '~/store/user'
import Roles from '~/store/modules/roles'
import Plans from '~/store/modules/plans'
import Members from '~/store/modules/members'
import Maps from '~/store/modules/maps'
import Svgs from '~/store/modules/svgs'
import TodoLists from '~/store/modules/todoLists'
import TodoStatuses from '~/store/modules/todoStatuses'

let SnackbarStore: Snackbar
let UserStore: User
let RolesStore: Roles
let PlansStore: Plans
let MembersStore: Members
let MapsStore: Maps
let SvgsStore: Svgs
let TodoListsStore: TodoLists
let TodoStatusesStore: TodoStatuses

function initialiseStores(store: Store<any>): void {
  SnackbarStore = getModule(Snackbar, store)
  UserStore = getModule(User, store)
  RolesStore = getModule(Roles, store)
  PlansStore = getModule(Plans, store)
  MembersStore = getModule(Members, store)
  MapsStore = getModule(Maps, store)
  SvgsStore = getModule(Svgs, store)
  TodoListsStore = getModule(TodoLists, store)
  TodoStatusesStore = getModule(TodoStatuses, store)
}

export {
  initialiseStores,
  SnackbarStore,
  UserStore,
  RolesStore,
  PlansStore,
  MembersStore,
  MapsStore,
  SvgsStore,
  TodoListsStore,
  TodoStatusesStore
}
