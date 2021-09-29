<template>
  <svg-base
    :rect-class="'pointer'"
    :is-resize-active="false"
    @contextMenuHandle="showMenu"
    @pointerDownHandle="selectSvg"
  >
    <svg-context-menu
      :is-edit="false"
      :menu-items="menuItems"
    ></svg-context-menu>
  </svg-base>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SVGRectMouseEvent } from 'interface'
import SvgBase from '~/components/protected/maps/SvgBase.vue'
import SvgContextMenu from '~/components/protected/maps/SvgContextMenu.vue'
import { SvgsStore, TodoListsStore } from '~/store'
import ContextMenu from '~/utils/ui/svg-context-menu'

export default defineComponent({
  components: {
    SvgBase,
    SvgContextMenu,
  },

  setup() {
    const menuItems = [
      { title: 'test', func: () => console.log('test') }
    ]

    const selectSvg = (e: SVGRectMouseEvent) => {
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
      showMenu: (e: SVGRectMouseEvent) => ContextMenu.showMenu(e),
      menuItems,
      selectSvg
    }
  },
})
</script>
