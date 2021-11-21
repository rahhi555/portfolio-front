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
        :id="`edit-svg-form-${svg.id}`"
        :value="svg.name"
        type="text"
        @blur="isEditSvgName = false"
        @keydown.enter="updateSvgName"
      />
    </div>
  </foreignObject>

  <!-- idはMaps/GoogleMapsコンポーネントのオーバーレイ処理で使用する -->
  <text
    v-else
    :id="'svg-text-' + svg.id"
    :class="{ 'tooltip-visible': isEditPage && !isAnyMode }"
    text-anchor="middle"
    @dblclick="editSvgName"
  >
    <tspan :x="textX" :y="textY" font-weight="bold">{{ svg.name }}</tspan>
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
} from '@nuxtjs/composition-api'
import { Rect } from 'interface'
import { TodoListsStore } from '~/store'
import EditName from '~/utils/svgs/svg-edit-name'
import CommonUI from '~/utils/ui/common'

export default defineComponent({
  props: {
    svg: {
      type: Object,
      default: null,
    },
    textX: {
      type: Number,
      default: 0
    },
    textY: {
      type: Number,
      default: 0
    }
  },

  setup(props) {
    const svg = props.svg as Rect

    return {
      isEditSvgName: EditName.isEditSvgName,
      isAnyMode: EditName.isAnyMode,
      isEditPage: CommonUI.isEditPage,
      editSvgName: () => EditName.editSvgName(svg),
      updateSvgName: (e: KeyboardEvent) => EditName.updateSvgName(e, svg),
    }
  },

  computed: {
    todoListTitle() {
      const svg = this.svg as Rect
      const todoList = TodoListsStore.todoList.find(
        (todoList) => todoList.id === svg.todoListId
      )
      return todoList?.title
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
