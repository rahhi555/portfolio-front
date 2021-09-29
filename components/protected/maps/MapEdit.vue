<template>
  <svg-base
    @pointerMoveHandle="
      dragMiddle($event)
      resizeMiddle($event)
    "
    @pointerUpHandle="
      dragStop()
      resizeStop()
    "
    @pointerDownHandle="dragStart($event)"
    @keyDownHandle="moveRectArrowKey($event)"
    @deleteHandle="deleteSvg($event)"
    @contextMenuHandle="showMenu($event)"
    @dragEnterHandle="attachTodoListEnter($event)"
    @dragLeaveHandle="attachTodoListLeave()"
    @linePointerDownHandle="resizeStart($event)"
  >
    <svg-context-menu
    ></svg-context-menu>
  </svg-base>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { SVGRectMouseEvent, SVGRectKeyboardEvent } from 'interface'
import { debounce } from 'mabiki'
import { SvgsStore } from '~/store'
import Drag from '~/utils/helpers/svg-drag'
import Resize from '~/utils/helpers/svg-resize'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'
import TodoListAttach from '~/utils/helpers/todo-list-attach'
import ContextMenu from '~/utils/ui/svg-context-menu'
import SvgBase from '~/components/protected/maps/SvgBase.vue'
import SvgContextMenu from '~/components/protected/maps/SvgContextMenu.vue'

export default defineComponent({
  components: {
    SvgBase,
    SvgContextMenu,
  },

  setup() {
    // スペースキーの押下判定
    const isSpaceKeyPress = ref(AddEventSpaceKey.isSpaceKeyPress)

    // マウスのドラッグ操作
    const dragStart = (e: SVGRectMouseEvent) => {
      if (isSpaceKeyPress.value) return
      isShowMenu.value = false
      Drag.dragStart(e)
    }
    const dragMiddle = (e: SVGRectMouseEvent) => Drag.dragMiddle(e)
    const dragStop = () => Drag.dragStop()

    // 方向キーのドラッグ操作
    const moveRectArrowKey = (e: SVGRectKeyboardEvent) => {
      isShowMenu.value = false
      Drag.moveRectArrowKey(e)
    }

    // リサイズ操作
    const resizeStart = (e: SVGRectMouseEvent) => {
      if (isSpaceKeyPress.value) return
      isShowMenu.value = false
      Resize.resizeStart(e)
    }
    const resizeMiddle = (e: SVGRectMouseEvent) => Resize.resizeMiddle(e)
    const resizeStop = () => Resize.resizeStop()

    // --- svg削除 ---
    const deleteSvg = (e: SVGRectKeyboardEvent) => {
      SvgsStore.deleteSvg(e)
    }

    // --- コンテキストメニュー表示 ---
    const showMenu = (e: SVGRectMouseEvent) => ContextMenu.showMenu(e)
    const isShowMenu = ContextMenu.isShowMenu

    // オートセーブ
    const autosave = debounce(
      function () {
        SvgsStore.updateSvgs()
      },
      3000,
      { maxWait: 30000 }
    )
    watch(SvgsStore.allRects, () => autosave())

    return {
      dragStart,
      dragMiddle,
      dragStop,
      moveRectArrowKey,
      resizeStart,
      resizeMiddle,
      resizeStop,
      deleteSvg,
      showMenu,
      attachTodoListEnter: (e: DragEvent) =>
        TodoListAttach.attachTodoListEnter(e),
      attachTodoListLeave: () => TodoListAttach.attachTodoListLeave(),
    }
  },
})
</script>
