import { isSomeTrueModes } from '~/utils/ui/svg-cursor'
import { isEditPage } from '~/utils/ui/common'
import { SvgsStore, TodoListsStore } from '~/store'

/** Rect選択処理に使用する座標変数。startとendで差が5pxあればスクロールとみなし、setTargetIdを実行しない */
const selectStartXY = reactive({ x: 0, y: 0 })

export const selectRectStart = (e: PointerEvent) => {
  if (isEditPage.value || isSomeTrueModes.value) return

  selectStartXY.x = e.x
  selectStartXY.y = e.y
}

export const selectRectEnd = (e: PointerEvent, id?: number) => {
  if (isEditPage.value || isSomeTrueModes.value) return

  if (Math.abs(e.x - selectStartXY.x) > 4 || Math.abs(e.y - selectStartXY.y) > 4) return

  SvgsStore.setTargetId(id || e)
  const targetRect = SvgsStore.targetSvg
  if (!targetRect) return

  const todoListIndex = TodoListsStore.todoLists.findIndex((todoList) => todoList.id === targetRect.todoListId)
  if (todoListIndex === -1) {
    TodoListsStore.setSelectedTodoListIndex(null)
    return
  }
  TodoListsStore.setSelectedTodoListIndex(todoListIndex)
}