<template>
  <g
    :id="'svg-' + polyline.id"
    :transform="'translate(' + polyline.x + ',' + polyline.y + ')'"
  >
    <defs>
      <style>
        #triangle, #dot {
          fill-opacity: 0.8;
        }
      </style>
      <marker
        id="triangle"
        viewBox="0 0 10 10"
        refX="1"
        refY="5"
        markerUnits="strokeWidth"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="royalblue" />
      </marker>
      <marker
        id="dot"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
      >
        <circle cx="5" cy="5" r="5" fill="royalblue" />
      </marker>
    </defs>

    <polyline
      fill="none"
      stroke="black"
      stroke-opacity="0.5"
      stroke-width="3"
      :points="polyline.drawPoints"
      marker-start="url(#dot)"
      marker-end="url(#triangle)"
      tabindex="1"
      style="cursor: pointer"
      @keydown.delete="deletePolyline(polyline.id)"
    />

    <SvgsText :svg="polyline" :text-x="namePosition.x" :text-y="namePosition.y" />
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import { Polyline } from 'interface'
import { SvgsStore, MembersStore } from '~/store'
import { isEditPage } from '~/utils/ui/common'

export default defineComponent({
  props: {
    polyline: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const polyline = props.polyline as Polyline

    const deletePolyline = (id: number) => {
      if (!isEditPage.value) return
      SvgsStore.deleteSvg(id)
    }

    const avatar = computed(() => {
      const member = MembersStore.members?.find(
        (member) => member.userId === polyline.userId
      )
      return member?.avatar
    })

    // polylineの表示判定とdisplayTimeが経過したらfalseにする関数
    const isDisplay = ref(true)
    onMounted(() =>
      setTimeout(() => {
        if (!polyline.displayTime) return
        isDisplay.value = false
        SvgsStore.deleteSvgMutation(polyline.id)
      }, polyline.displayTime)
    )

    // nameの配置位置。drawPointsから最初のx,yを抜き出す。
    const namePosition = computed(() => {
      const firstXY = polyline.drawPoints.split(' ')[0].split(',')
      const x = Number.parseFloat(firstXY[0])
      const y = Number.parseFloat(firstXY[1]) + 25
      return { x, y }
    })

    return {
      deletePolyline,
      avatar,
      isDisplay,
      namePosition
    }
  },
})
</script>

<style scoped lang="sass">
.text-tooltip
  display: none

.tooltip-visible:hover .text-tooltip
  display: block
</style>