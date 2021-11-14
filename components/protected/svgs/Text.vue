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

  <!-- idはMaps/GoogleMapsコンポーネントのオーバーレイ処理で使用する -->
  <text
    v-else
    :id="'rect-text-' + rect.id"
    :class="{ 'tooltip-visible': isEditPage && !isAnyMode }"
    text-anchor="middle"
    @dblclick="editSvgName"
  >
    <tspan :x="textX" :y="textY" font-weight="bold">{{ rect.name }}</tspan>
    <tspan :x="textX" :y="textY + 20" font-style="italic" stroke="gray">{{
      todoListTitle
    }}</tspan>

    <tspan
      class="text-tooltip"
      :x="textX"
      :y="textY - 20"
      font-weight="lighter"
      font-size="small"
    >
      ダブルクリックで名前変更
    </tspan>
  </text>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  nextTick,
  computed,
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { SnackbarStore, SvgsStore, TodoListsStore } from '~/store'
import Path from '~/utils/svgs/svg-add-path'
import AddEventSpaceKey from '~/utils/helpers/add-event-space-press'
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

    // いずれかのモードのときtrueを返す。trueの間は「ダブルクリックで名前変更」が表示されない
    const isAnyMode = computed(() => {
      return Path.isAddPathMode.value || AddEventSpaceKey.isSpaceKeyPress.value
    })

    const isEditSvgName = ref(false)
    const editSvgName = () => {
      if (!CommonUI.isEditPage.value) return
      isEditSvgName.value = true
      nextTick(() => {
        document.getElementById(`edit-svg-form-${rect.id}`)?.focus()
      })
    }

    const updateSvgName = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement
      const name = target.value
      if (!/^\S+/.test(name)) {
        SnackbarStore.visible({
          color: 'warning',
          message: '先頭の文字に空白を入力することはできません',
        })
        target.value = rect.name
        return
      }
      SvgsStore.changeSvg({
        status: 'name',
        value: name,
        otherTargetId: rect.id,
      })
      isEditSvgName.value = false
    }

    return {
      isEditSvgName,
      editSvgName,
      updateSvgName,
      isAnyMode,
      isEditPage: CommonUI.isEditPage,
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
