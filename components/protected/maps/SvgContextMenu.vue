<template>
  <v-menu
    :value="isShowMenu"
    :position-x="position.x"
    :position-y="position.y"
    absolute
    offset-y
  >
    <v-list>
      <v-list-item v-if="hasTodoList()"  class="pointer" @click="detachTodoList">
        todoリストを解除
        {{targetSvg}}
      </v-list-item>

      <v-divider v-if="hasTodoList()" />

      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        class="pointer"
        @click="item.func()"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'

export default defineComponent({
  props: {
    isShowMenu: {
      type: Boolean
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0
      })
    }
  },

  setup(){
    const menuItems = [
      { title: '最上面に移動', func: () => SvgsStore.changeOrder('top') },
      { title: '一つ上に移動', func: () => SvgsStore.changeOrder('up') },
      { title: '一つ下に移動', func: () => SvgsStore.changeOrder('down') },
      { title: '最下面に移動', func: () => SvgsStore.changeOrder('bottom') },
    ]

    const hasTodoList = () => {
      return !!SvgsStore.targetSvg?.todoListId
    }
    const detachTodoList = () => {
      SvgsStore.attachTodoList(null)
    }

    return{
      menuItems,
      hasTodoList,
      detachTodoList
    }
  }
})
</script>