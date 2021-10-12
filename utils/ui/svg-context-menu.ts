import { ref, nextTick } from '@nuxtjs/composition-api'
import { PointerEvent } from 'interface'
import { SvgsStore } from '~/store'

// --- コンテキストメニュー表示 ---
const isShowMenu = ref(false)
const position = { x: 0, y: 0 }

export default {
  showMenu(e: PointerEvent) {
    isShowMenu.value = false
    SvgsStore.setTargetId(e)
    position.x = e.clientX
    position.y = e.clientY
    nextTick(() => {
      isShowMenu.value = true
    })
  },

  isShowMenu,

  position
}
