import { InjectionKey, Ref } from '@nuxtjs/composition-api'
import { AppBarFunc } from 'interface'

export const AppBarFuncKey: InjectionKey<Ref<AppBarFunc | null>> = Symbol('AppBarFuncKey')

export const AppBarDialogKey: InjectionKey<Ref<boolean>> = Symbol('AppBarDialogKey')

export const AccountDialogKey: InjectionKey<Ref<boolean>> = Symbol('AccountDialogKey')

export const DrawerKey: InjectionKey<Ref<boolean>> = Symbol('DrawerKey')
