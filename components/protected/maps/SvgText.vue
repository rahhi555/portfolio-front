<template>
  <foreignObject
    v-if="isEditSvgName"
    :x="textX - 30"
    :y="textY - 10"
    width="100"
    height="50"
  >
    <div xmlns="http://www.w3.org/1999/xhtml">
      <input
        :id="`edit-svg-form-${rect.id}`"
        :value="rect.name"
        type="text"
        @blur="isEditSvgName = false"
        @keydown.enter="updateSvgName"
      />
    </div>
  </foreignObject>

  <text v-else :class="{'tooltip-visible': isEditPage}" text-anchor="middle" @dblclick="editSvgName">
    <tspan :x="textX" :y="textY" font-weight="bold">{{ rect.name }}</tspan>
    <tspan :x="textX" :y="textY + 20" font-style="italic" stroke="gray">{{
      todoListTitle
    }}</tspan>

    <tspan class="text-tooltip" :x="textX" :y="textY - 20" font-weight="lighter" font-size="small">
      ダブルクリックで名前変更
    </tspan>
  </text>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, useRoute } from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SnackbarStore, SvgsStore, TodoListsStore } from '~/store'

export default defineComponent({
  props: {
    rect: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const rect = props.rect as Rect

    const isEditSvgName = ref(false)
    const editSvgName = () => {
      if(!isEditPage) return
      isEditSvgName.value = true
      nextTick(() => {
        document.getElementById(`edit-svg-form-${rect.id}`)?.focus()
      })
    }

    const updateSvgName = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement
      const name = target.value
      if(!/^\S+/.test(name)) {
        SnackbarStore.visible({ color: 'warning', message: '先頭の文字に空白を入力することはできません' })
        target.value = rect.name
        return
      }
      SvgsStore.changeSvg({status: 'name', value: name, otherTargetId: rect.id})
      isEditSvgName.value = false
    }

    const route = useRoute()
    const isEditPage = route.value.name?.endsWith('edit')

    return {
      isEditSvgName,
      editSvgName,
      updateSvgName,
      isEditPage
    }
  },

  computed: {
    todoListTitle() {
      const rect = this.rect as Rect
      const todoList = TodoListsStore.todoList.find(
        (todoList) => todoList.id === rect.todoListId
      )
      return todoList?.title
    },
    textX() {
      const width = this.rect.width as number
      return width / 2
    },
    textY() {
      const height = this.rect.height as number
      return height / 1.5
    },
  },
})
</script>

<style scoped lang="sass">
.text-tooltip
  display: none

.tooltip-visible:hover .text-tooltip
  display: block
</style>