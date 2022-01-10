<template>
  <g :id="'svg-' + rect.id" :transform="'translate(' + rect.x + ',' + rect.y + ')'">
    <rect
      :width="rect.width"
      :height="rect.height"
      :fill="fill"
      :stroke="rect.stroke"
      tabindex="0"
      :class="{ grabbable: isEditPage && !isSomeTrueModes }"
      @pointerdown.left="
        dragStart($event);
        selectRect($event)
      "
      @keydown="moveRectArrowKey"
      @keydown.delete="deleteSvg"
      @contextmenu.prevent="showMenu;"
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
    <SvgsText :svg="rect" :text-x="rect.width / 2" :text-y="rect.height / 1.5"></SvgsText>

    <circle :cx="rect.width" r="20" fill="#333" />
    <text :x="rect.width" font-size="15" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="white"
      >{{todoCountText}}</text
    >
  </g>
</template>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SvgsStore, TodoListsStore, TodoStatusesStore, PlansStore } from '~/store'
import { dragStart, moveRectArrowKey } from '~/utils/svgs/svg-drag'
import { resizeStart } from '~/utils/svgs/svg-resize'
import { attachTodoListEnter, attachTodoListLeave } from '~/utils/helpers/todo-list-attach'
import { showMenu } from '~/utils/ui/svg-context-menu'
import { isSomeTrueModes } from '~/utils/ui/svg-cursor'
import { isEditPage } from '~/utils/ui/common'

export default defineComponent({
  props: {
    rect: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const rect = props.rect as Rect

    // --- svg削除 ---
    const deleteSvg = (e: KeyboardEvent) => {
      if (!isEditPage.value) return
      SvgsStore.deleteSvg(e)
    }

    const { $config } = useContext()
    const { NO_ATTACH_COLOR, TODO_COLOR, DONE_COLOR, DOING_COLOR } = $config.rectColors

    /** このrectにアタッチされている全てのtodo */
    const todoStatuses = computed(() => {
      if(PlansStore.currentPlan?.active) {
        return TodoStatusesStore.getTodoStatusesBySvgId(rect.id)
      }
    })

    /** 図形の色をtodoのステータスに合わせて変化させる */
    const fill = computed(() => {
      // 図形にtodoリストがアタッチされていないなければNO_ATTACH_COLORを返す
      if (!rect.todoListId) return NO_ATTACH_COLOR
      // 計画がアクティブでないかtodoStatusesが無ければTODO_COLORを返す
      if (!PlansStore.currentPlan?.active || !todoStatuses.value) return TODO_COLOR

      if (todoStatuses.value.every((todo) => todo.status === 'done')) {
        return DONE_COLOR
      } else if (todoStatuses.value.some((todo) => todo.status === 'done')) {
        return DOING_COLOR
      } else {
        return TODO_COLOR
      }
    })

    /** todoの総数。計画がアクティブの場合は 1/10 のようにいくつ終了しているかも表示する。 */
    const todoCountText = computed(() => {
      if(todoStatuses.value) {
        const doneLength = todoStatuses.value.filter(todo => todo.status === 'done').length
        const total = todoStatuses.value?.length
        return `${doneLength}/${total}`
      } else {
        return TodoListsStore.todoLists.find(todoList => todoList.id === rect.todoListId)?.todos?.length || 0
      }
    })

    // 閲覧ページの場合にrectをクリックしたときの処理
    const selectRect = (e: PointerEvent) => {
      if (isEditPage.value || isSomeTrueModes.value) return

      SvgsStore.setTargetId(e)
      const targetRect = SvgsStore.targetSvg
      if (!targetRect) return

      const todoListIndex = TodoListsStore.todoLists.findIndex((todoList) => todoList.id === targetRect.todoListId)
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
      attachTodoListEnter,
      attachTodoListLeave,
      fill,
      selectRect,
      isSomeTrueModes,
      isEditPage,
      todoCountText
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
