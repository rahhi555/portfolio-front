import { InjectionKey, Ref } from '@nuxtjs/composition-api'
import { AppBarTab, AppBarFunc } from 'interface'

export const MiniVariantKey: InjectionKey<Ref<boolean>> = Symbol('MiniVariantKey')

export const DrawerKey: InjectionKey<Ref<boolean>> = Symbol('DrawerKey')

export const AppBarTabKey: InjectionKey<Ref<AppBarTab[]>> = Symbol('AppBarTabKey')

export const AppBarFuncKey: InjectionKey<Ref<AppBarFunc | null>> = Symbol('AppBarFuncKey')

export const AppBarDialogKey: InjectionKey<Ref<boolean>> = Symbol('AppBarDialogKey')