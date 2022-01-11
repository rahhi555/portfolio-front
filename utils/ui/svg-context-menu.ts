import { ref, nextTick } from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'
import { isEditPage } from '~/utils/ui/common'

/** コンテキストメニューが表示かどうか */
export const isShowMenu = ref(false)

/** コンテキストメニュー表示位置 */
export const position = { x: 0, y: 0 }

/** コンテキストメニュー表示 */
export const showMenu = (e: MouseEvent) => {
  if (!isEditPage.value) return

  isShowMenu.value = false
  SvgsStore.setTargetId(e as PointerEvent)
  position.x = e.clientX
  position.y = e.clientY
  nextTick(() => {
    isShowMenu.value = true
  })
}
