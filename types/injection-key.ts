import { InjectionKey, Ref } from '@nuxtjs/composition-api'
import { AppBarTab, AppBarFunc } from 'interface'

export const AppBarTabKey: InjectionKey<Ref<AppBarTab[]>> = Symbol('AppBarTabKey')

export const AppBarFuncKey: InjectionKey<Ref<AppBarFunc | null>> = Symbol('AppBarFuncKey')

export const AppBarDialogKey: InjectionKey<Ref<boolean>> = Symbol('AppBarDialogKey')

export const AccountDialogKey: InjectionKey<Ref<boolean>> = Symbol('AccountDialogKey')
