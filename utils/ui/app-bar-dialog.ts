import { ref, inject, provide } from '@nuxtjs/composition-api'
import { AppBarDialogKey, AppBarFuncKey } from '~/types/injection-key'

export default function setAppBarTabDialog(name: string) {
  const dialog = ref(false)
  provide(AppBarDialogKey, dialog)

  const visibleModal = () => {
    dialog.value = true
  }

  const appBarFunc = inject(AppBarFuncKey)
  appBarFunc!.value = { func: visibleModal, name }
}