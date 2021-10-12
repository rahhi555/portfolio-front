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
      :class="rectCursorClass"
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
      :class="[{'top-line': isEditPage }, rectCursorClass]"
      @pointerdown.stop="resizeStart"
    />
    <line
      :x1="rect.width"
      y1="0"
      :x2="rect.width"
      :y2="rect.height"
      :class="[{ 'right-line': isEditPage }, rectCursorClass]"
      @pointerdown.stop="resizeStart"
    />
    <line
      x1="0"
      :y1="rect.height"
      :x2="rect.width"
      :y2="rect.height"
      :class="[{ 'bottom-line': isEditPage }, rectCursorClass]"
      @pointerdown.stop="resizeStart"
    />
    <line
      x1="0"
      y1="0"
      x2="0"
      :y2="rect.height"
      :class="[{ 'left-line': isEditPage }, rectCursorClass]"
      @pointerdown.stop="resizeStart"
    />
    <SvgsText :rect="rect" :is-edit-page="isEditPage"></SvgsText>
  </g>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SvgsStore, TodoListsStore } from '~/store'
import Drag from '~/utils/helpers/svg-drag'
import Resize from '~/utils/helpers/svg-resize'
import TodoListAttach from '~/utils/helpers/todo-list-attach'
import ContextMenu from '~/utils/ui/svg-context-menu'
import Path from '~/utils/helpers/svg-add-path'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'

export default defineComponent({
  props: {
    rect: {
      type: Object,
      default: null,
    },
    isEditPage: {
      type: Boolean
    },
  },

   setup(props) {
    // 編集ページ判定、ピン挿入モード判定、スクロールモード判定
    const isEditPage = props.isEditPage
    const isAddPathMode = Path.isAddPathMode
    const isSpaceKeyPress = AddEventSpaceKey.isSpaceKeyPress

    // モードごとにカーソルのクラスを返す
    const rectCursorClass = computed(() => {
      if(isSpaceKeyPress.value) {
        return 'move'
      } else if (isAddPathMode.value) {
        return 'add-path-mode'
      } else if (isEditPage) {
        return 'grabbable'
      }
    })

    // --- コンテキストメニュー表示 ---
    const showMenu = (e: PointerEvent) => { 
      if(!isEditPage) return
      ContextMenu.showMenu(e)
    }
    const isShowMenu = ContextMenu.isShowMenu

    // Rectの位置操作操作
    const dragStart = (e: PointerEvent) => {
      if (isSpaceKeyPress.value || !isEditPage) return
      isShowMenu.value = false
      Drag.dragStart(e)
    }

    // 方向キーのドラッグ操作
    const moveRectArrowKey = (e: KeyboardEvent) => {
      if(!isEditPage) return
      isShowMenu.value = false
      Drag.moveRectArrowKey(e)
    }

    // リサイズ操作
    const resizeStart = (e: PointerEvent) => {
      if (isSpaceKeyPress.value || !isEditPage) return
      isShowMenu.value = false
      Resize.resizeStart(e)
    }

    // --- svg削除 ---
    const deleteSvg = (e: KeyboardEvent) => {
      if(!isEditPage) return
      SvgsStore.deleteSvg(e)
    }

    // svgの色。todoの進行状況によって変化する
    const fill = (rect: Rect) => {
      const NO_ATTACH_COLOR = 'white'
      const TODO_COLOR = '#cccccc'
      const DOING_COLOR = '#E6EE9C'
      const DONE_COLOR = '#66BB6A'

      const { todoListId } = rect
      if (!todoListId) return NO_ATTACH_COLOR

      const todos = TodoListsStore.todoList.find(
        (todoList) => todoList.id === todoListId
      )?.todos
      if (!todos || !todos.length) return NO_ATTACH_COLOR
      if (todos.every((todo) => todo.status === 'todo')) {
        return TODO_COLOR
      } else if (todos.every((todo) => todo.status === 'done')) {
        return DONE_COLOR
      } else {
        return DOING_COLOR
      }
    }

    // 閲覧ページの場合にrectをクリックしたときの処理
    const selectRect = (e: PointerEvent) => {
      if(isEditPage) return
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
      rectCursorClass,
    }
  },
})
</script>

<style scoped lang="sass">
.grabbable
  cursor: grab
.grabbable:active
  cursor: grabbing

// スペースキーを押している間のカーソル
.move
  cursor: move

// top-line,bottom-line,right-line,left-lineはリサイズ処理でそのクラス名を使用するので変更しないこと
.top-line, .bottom-line
  cursor: row-resize
  stroke-width: 15
  stroke: transparent
.right-line, .left-line
  cursor: col-resize
  stroke-width: 15
  stroke: transparent

.add-path-mode
  cursor: url('~assets/map-marker.svg') 15 15, pointer
</style>
