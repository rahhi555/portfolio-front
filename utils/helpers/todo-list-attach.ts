import { SvgsStore } from '~/store'

let isAttaching = false
const dragOverPreventDefault = (e: Event) => {
  e.preventDefault()
}
let dragEnterSvg: HTMLElement

const removeSvgTarget = () => {
  dragEnterSvg.style.fill = ""
  SvgsStore.setTargetId(0)
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
    dragEnterSvg = e.target as HTMLElement
    dragEnterSvg.style.fill="#cccccc"
  },

  attachTodoListLeave() {
    if(!isAttaching) return
    if(!SvgsStore.targetSvg) return
    window.removeEventListener('dragover', dragOverPreventDefault, false)
    removeSvgTarget()
  },

  attachTodoListEnd(e: DragEvent) {
    if(!(e.target!.constructor === HTMLButtonElement)) return
    if(!isAttaching) return
    if(window.$nuxt.context.$tutorial.isRunningTutorial.value) {
      window.removeEventListener('dragover', dragOverPreventDefault, false)
      isAttaching = false
      return 
    }

    // @ts-ignore
    const todoListId =  Number(e.target.id.replace('todo-list-id-', ''))
    SvgsStore.attachTodoList(todoListId)
    .then(() => {
      window.removeEventListener('dragover', dragOverPreventDefault, false)
      isAttaching = false
      removeSvgTarget()
    })
  }
}