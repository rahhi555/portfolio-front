<template>
  <g
    :id="'svg-' + rect.id"
    :transform="'translate(' + rect.x + ',' + rect.y + ')'"
  >
    <rect
      :width="rect.width"
      :height="rect.height"
      :fill="fill(rect)" 
      :stroke="rect.stroke"
      tabindex="0"
      :class="{ 'grabbable': isEditPage && !isSomeTrueModes }"
      @pointerdown.left="
        dragStart($event)
        selectRect($event)
      "
      @keydown="moveRectArrowKey"
      @keydown.delete="deleteSvg"
      @contextmenu.prevent="showMenu"
      @dragenter="attachTodoListEnter"
      @dragleave="attachTodoListLeave"
    />
    <line
      x1="0"
      y1="0"
      :x2="rect.width"
      y2="0"
      :class="{'top-line': isEditPage && !isSomeTrueModes }"
      @pointerdown.stop="resizeStart"
    />
    <line
      :x1="rect.width"
      y1="0"
      :x2="rect.width"
      :y2="rect.height"
      :class="{ 'right-line': isEditPage && !isSomeTrueModes }"
      @pointerdown.stop="resizeStart"
    />
    <line
      x1="0"
      :y1="rect.height"
      :x2="rect.width"
      :y2="rect.height"
      :class="{ 'bottom-line': isEditPage && !isSomeTrueModes }"
      @pointerdown.stop="resizeStart"
    />
    <line
      x1="0"
      y1="0"
      x2="0"
      :y2="rect.height"
      :class="{ 'left-line': isEditPage && !isSomeTrueModes }"
      @pointerdown.stop="resizeStart"
    />
    <SvgsText :rect="rect"></SvgsText>
  </g>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SvgsStore, TodoListsStore } from '~/store'
import Drag from '~/utils/svgs/svg-drag'
import Resize from '~/utils/svgs/svg-resize'
import TodoListAttach from '~/utils/helpers/todo-list-attach'
import ContextMenu from '~/utils/ui/svg-context-menu'
import Cursor from '~/utils/ui/svg-cursor'
import CommonUI from '~/utils/ui/common'

export default defineComponent({
  props: {
    rect: {
      type: Object,
      default: null,
    },
  },

   setup() {
    // 編集ページ判定、ピン挿入モード判定、スクロールモード判定
    const modes = reactive({
      isEditPage: CommonUI.isEditPage.value,
      isSomeTrueModes: Cursor.isSomeTrueModes
    })
    
    // --- コンテキストメニュー表示 ---
    const showMenu = (e: PointerEvent) => { 
      if(!modes.isEditPage) return
      ContextMenu.showMenu(e)
    }
    const isShowMenu = ContextMenu.isShowMenu

    // Rectの位置操作操作
    const dragStart = (e: PointerEvent) => {
      if (!modes.isEditPage || modes.isSomeTrueModes) return
      isShowMenu.value = false
      Drag.dragStart(e)
    }

    // 方向キーのドラッグ操作
    const moveRectArrowKey = (e: KeyboardEvent) => {
      if(!modes.isEditPage) return
      isShowMenu.value = false
      Drag.moveRectArrowKey(e)
    }

    // リサイズ操作
    const resizeStart = (e: PointerEvent) => {
      if (!modes.isEditPage || modes.isSomeTrueModes) return
      isShowMenu.value = false
      Resize.resizeStart(e)
    }

    // --- svg削除 ---
    const deleteSvg = (e: KeyboardEvent) => {
      if(!modes.isEditPage) return
      SvgsStore.deleteSvg(e)
    }

    // svgの色。todoの進行状況によって変化する
    const { $config } = useContext()

    const fill = (rect: Rect) => {
      const { todoListId } = rect
      if (!todoListId) return $config.rectColors.NO_ATTACH_COLOR

      const todos = TodoListsStore.todoList.find(
        (todoList) => todoList.id === todoListId
      )?.todos
      if (!todos || !todos.length) return $config.rectColors.NO_ATTACH_COLOR
      if (todos.every((todo) => todo.status === 'todo')) {
        return $config.rectColors.TODO_COLOR
      } else if (todos.every((todo) => todo.status === 'done')) {
        return $config.rectColors.DONE_COLOR
      } else {
        return $config.rectColors.DOING_COLOR
      }
    }

    // 閲覧ページの場合にrectをクリックしたときの処理
    const selectRect = (e: PointerEvent) => {
      if(modes.isEditPage || modes.isSomeTrueModes) return
      SvgsStore.setTargetId(e)
      const targetRect = SvgsStore.targetSvg
      if(!targetRect) return
      const todoListIndex = TodoListsStore.todoList.findIndex(todoList => todoList.id === targetRect.todoListId) 
      if(todoListIndex === -1) {
        TodoListsStore.setSelectedTodoListIndex(null)
        return
      }
      TodoListsStore.setSelectedTodoListIndex(todoListIndex)
    }

    return {
      dragStart,
      moveRectArrowKey,
      resizeStart,
      deleteSvg,
      showMenu,
      attachTodoListEnter: (e: DragEvent) =>
        TodoListAttach.attachTodoListEnter(e),
      attachTodoListLeave: () => TodoListAttach.attachTodoListLeave(),
      fill,
      selectRect,
      isSomeTrueModes: Cursor.isSomeTrueModes,
      isEditPage: modes.isEditPage
    }
  },
})
</script>

<style scoped lang="sass">
.grabbable
  cursor: grab
.grabbable:active
  cursor: grabbing

// top-line,bottom-line,right-line,left-lineはリサイズ処理でそのクラス名を使用するので変更しないこと
.top-line, .bottom-line
  cursor: row-resize
  stroke-width: 15
  stroke: transparent
.right-line, .left-line
  cursor: col-resize
  stroke-width: 15
  stroke: transparent

</style>
