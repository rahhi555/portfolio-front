<template>
  <v-menu
    v-model="isShowMenu"
    :position-x="position.x"
    :position-y="position.y"
    absolute
    offset-y
  >
    <v-list>
      <v-list-item
        v-if="hasTodoList && isEdit"
        class="pointer"
        @click="detachTodoList"
      >
        todoリストを解除
      </v-list-item>

      <v-divider v-if="hasTodoList && isEdit" />

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
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { SvgsStore } from '~/store'
import SvgContextMenu from '~/utils/ui/svg-context-menu'

export default defineComponent({
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
    menuItems: {
      type: Array,
      default: () => [
        { title: '最上面に移動', func: () => SvgsStore.changeOrder('top') },
        { title: '一つ上に移動', func: () => SvgsStore.changeOrder('up') },
        { title: '一つ下に移動', func: () => SvgsStore.changeOrder('down') },
        { title: '最下面に移動', func: () => SvgsStore.changeOrder('bottom') },
      ],
    },
  },

  setup() {
    // todoリストのデタッチ
    const hasTodoList = computed(() => {
      if (!SvgsStore.targetSvg) return false
      return !!SvgsStore.targetSvg.todoListId
    })
    const detachTodoList = () => {
      SvgsStore.attachTodoList(null)
    }

    const isShowMenu = ref(SvgContextMenu.isShowMenu)
    const position = SvgContextMenu.position

    return {
      hasTodoList,
      detachTodoList,
      isShowMenu,
      position
    }
  },
})
</script>
