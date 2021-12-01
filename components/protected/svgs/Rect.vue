<template>
  <g
    :id="'svg-' + rect.id"
    :transform="'translate(' + rect.x + ',' + rect.y + ')'"
  >
    <rect
      :width="rect.width"
      :height="rect.height"
      :fill="fill"
      :stroke="rect.stroke"
      tabindex="0"
      :class="{ grabbable: isEditPage && !isSomeTrueModes }"
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
      :class="{ 'top-line': isEditPage && !isSomeTrueModes }"
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
    <SvgsText
      :svg="rect"
      :text-x="rect.width / 2"
      :text-y="rect.height / 1.5"
    ></SvgsText>
  </g>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  computed,
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SvgsStore, TodoListsStore, TodoStatusesStore, PlansStore } from '~/store'
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

  setup(props) {
    const rect = props.rect as Rect

    // 編集ページ判定、ピン挿入モード判定、スクロールモード判定
    const modes = reactive({
      isEditPage: CommonUI.isEditPage.value,
      isSomeTrueModes: Cursor.isSomeTrueModes,
    })

    // --- コンテキストメニュー表示 ---
    const showMenu = (e: PointerEvent) => {
      if (!modes.isEditPage) return
      ContextMenu.showMenu(e)
    }
    const isShowMenu = ContextMenu.isShowMenu

    // Rectの位置操作操作
    const dragStart = (e: PointerEvent) => {
      if (!modes.isEditPage || modes.isSomeTrueModes) return
      isShowMenu.value = false
      Drag.dragStart(e)    }

    // 方向キーのドラッグ操作
    const moveRectArrowKey = (e: KeyboardEvent) => {
      if (!modes.isEditPage) return
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
      if (!modes.isEditPage) return
      SvgsStore.deleteSvg(e)
    }
    
    const { $config } = useContext()
    const { NO_ATTACH_COLOR, TODO_COLOR, DONE_COLOR, DOING_COLOR } = $config.rectColors

    /** 図形の色をtodoのステータスに合わせて変化させる */
    const fill = computed(() => {
      // 図形にtodoリストがアタッチされていないなければNO_ATTACH_COLORを返す
      if (!rect.todoListId) return NO_ATTACH_COLOR
      // 計画がアクティブでなければTODO_COLORを返す
      if (!PlansStore.currentPlan?.active) return TODO_COLOR

      const todos = TodoStatusesStore.getTodoStatusesBySvgId(rect.id)!

      if (todos.every((todo) => todo.status === 'done')) {
        return DONE_COLOR
      } else if (todos.some((todo) => todo.status === 'done')) {
        return DOING_COLOR
      } else {
        return TODO_COLOR
      }
    })

    // 閲覧ページの場合にrectをクリックしたときの処理
    const selectRect = (e: PointerEvent) => {
      if (modes.isEditPage || modes.isSomeTrueModes) return
      SvgsStore.setTargetId(e)
      const targetRect = SvgsStore.targetSvg
      if (!targetRect) return
      const todoListIndex = TodoListsStore.todoLists.findIndex(
        (todoList) => todoList.id === targetRect.todoListId
      )
      if (todoListIndex === -1) {
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
      isEditPage: modes.isEditPage,
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
