import { isSomeTrueModes } from '~/utils/ui/svg-cursor'
import { isEditPage } from '~/utils/ui/common'
import { SvgsStore, TodoListsStore } from '~/store'

/** todoリスト開閉フラグ */
export const isTodoListExpand = ref(false)

/** Rect選択処理に使用する座標変数。startとendで差が5pxあればスクロールとみなし、setTargetIdを実行しない */
const expandStartXY = reactive({ x: 0, y: 0 })

export const expandTodoListStart = (e: PointerEvent) => {
  if (isEditPage.value || isSomeTrueModes.value) return

  expandStartXY.x = e.x
  expandStartXY.y = e.y
}

export const expandTodoListEnd = (e: PointerEvent, id?: number) => {
  if (isEditPage.value || isSomeTrueModes.value) return

  if (Math.abs(e.x - expandStartXY.x) > 4 || Math.abs(e.y - expandStartXY.y) > 4) return

  SvgsStore.setTargetId(id || e)
  const targetRect = SvgsStore.targetSvg
  if (!targetRect) return

  const todoListIndex = TodoListsStore.todoLists.findIndex((todoList) => todoList.id === targetRect.todoListId)
  if (todoListIndex === -1) {
    TodoListsStore.setSelectedTodoListIndex(null)
    return
  }
  TodoListsStore.setSelectedTodoListIndex(todoListIndex)

  isTodoListExpand.value = true
}