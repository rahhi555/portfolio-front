import { InjectionKey, Ref } from '@nuxtjs/composition-api'

export const MiniVariantKey: InjectionKey<Ref<boolean>> = Symbol('MiniVariantKey')

export const DrawerKey: InjectionKey<Ref<boolean>> = Symbol('DrawerKey')