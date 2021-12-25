import { InjectionKey, Ref } from '@nuxtjs/composition-api'
import { AppBarFunc } from 'interface'

/** appBarの右上に表示されるボタンの関数 */
export const AppBarFuncKey: InjectionKey<Ref<AppBarFunc | null>> = Symbol('AppBarFuncKey')

/** appBarのダイアログ表示判定 */
export const AppBarDialogKey: InjectionKey<Ref<boolean>> = Symbol('AppBarDialogKey')

/** プロフィール画面の表示判定 */
export const AccountDialogKey: InjectionKey<Ref<boolean>> = Symbol('AccountDialogKey')

/** モバイル限定のドロワー表示判定 */
export const IsVisibleDrawerKey: InjectionKey<Ref<boolean>> = Symbol('IsVisibleDrawerKey')

/** モバイルかつ計画中でマップ閲覧画面にアクセスした際のappBar表示判定 */
export const IsVisibleAppBarKey: InjectionKey<Ref<boolean>> = Symbol('IsVisibleDrawerKey')

/** errorが発生したかの判定。error.vueからdefault.vueに送り、ヘッダーを隠す */
export const HasErrorKey: InjectionKey<Ref<boolean>> = Symbol('HasErrorKey')