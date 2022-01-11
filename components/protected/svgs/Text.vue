<template>
  <foreignObject v-if="isEditSvgName" :x="textX - 30" :y="textY - 10" width="100" height="50">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <input
        :id="`edit-svg-form-${svg.id}`"
        :value="svg.name"
        type="text"
        @blur="isEditSvgName = false"
        @keydown.enter="updateSvgName($event, svg)"
      />
    </div>
  </foreignObject>

  <text
    v-else
    :class="{ 'tooltip-visible': isEditPage && !isAnyMode }"
    text-anchor="middle"
    @dblclick="editSvgName(svg)"
    @pointerdown.left="selectRectStart"
    @pointerup.left="selectRectEnd($event, svg.id)"
  >
    <tspan :x="textX" :y="textY" font-weight="bold" font-size="14px">{{ svg.name }}</tspan>
    <tspan :x="textX" :y="textY + 20" font-style="italic" stroke="gray" font-size="14px">{{ todoListTitle }}</tspan>

    <tspan class="text-tooltip" :x="textX" :y="textY - 20" font-weight="lighter" font-size="12px">
      ダブルクリックで名前変更
    </tspan>
  </text>
</template>

<script setup lang="ts">
import { AllSvgType } from 'interface'
import { TodoListsStore } from '~/store'
import { isEditSvgName, isAnyMode, editSvgName, updateSvgName } from '~/utils/svgs/svg-edit-name'
import { isEditPage } from '~/utils/ui/common'
import { selectRectStart, selectRectEnd } from '~/utils/ui/todolist-expand'

const props = defineProps<{ svg: AllSvgType; textX: number; textY: number }>()

const todoListTitle = computed(() => {
  const todoList = TodoListsStore.todoLists.find(
    (todoList) => todoList.id === props.svg.todoListId
  )
  return todoList?.title
})
</script>

<style scoped lang="sass">
.text-tooltip
  display: none

.tooltip-visible:hover .text-tooltip
  display: block
</style>
