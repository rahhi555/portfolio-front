import { SvgsStore } from '~/store'

let isAttaching = false
const dragOverPreventDefault = (e: Event) => {
  e.preventDefault()
}

export default {
  attachTodoListStart() {
    isAttaching = true
  },

  attachTodoListEnter(e: DragEvent) {
    window.addEventListener('dragover', dragOverPreventDefault, false)
    if(!isAttaching) return
    // @ts-ignore
    SvgsStore.setTargetId(e)
    if(!SvgsStore.targetSvg) return
    SvgsStore.dragEnterMutaion()
  },

  attachTodoListLeave() {
    if(!isAttaching) return
    if(!SvgsStore.targetSvg) return
    SvgsStore.dragLeaveMutaion()
    window.removeEventListener('dragover', dragOverPreventDefault, false)
  },

  attachTodoListEnd(e: DragEvent) {
    if(!(e.target!.constructor === HTMLButtonElement)) return
    if(!isAttaching) return
    // @ts-ignore
    const todoListId =  Number(e.target.id.replace('todo-list-id-', ''))
    SvgsStore.attachTodoList(todoListId)
    .then(() => {
      window.removeEventListener('dragover', dragOverPreventDefault, false)
      isAttaching = false
      SvgsStore.dragLeaveMutaion()
    })
  }
}