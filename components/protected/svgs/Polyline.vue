<template>
  <g
    :id="'svg-' + polyline.id"
    :transform="'translate(' + polyline.x + ',' + polyline.y + ')'"
    tabindex="1"
    @keydown.delete="deletePolyline(polyline.id)"
    style="cursor: pointer"
  >
    <defs>
      <marker id="triangle" viewBox="0 0 10 10" refX="1" refY="5" markerUnits="strokeWidth" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="red" fill-opacity="1" />
      </marker>
      <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5">
        <circle cx="5" cy="5" r="5" fill="firebrick" fill-opacity="0.8" />
      </marker>
    </defs>

    <polyline
      fill="none"
      :stroke="strokeColor"
      stroke-opacity="0.5"
      stroke-width="3"
      :points="polyline.drawPoints"
      marker-start="url(#dot)"
      marker-end="url(#triangle)"
    />

    <SvgsText :svg="polyline" :text-x="namePosition.x" :text-y="namePosition.y" :fill="strokeColor" />
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { Polyline } from 'interface'
import { SvgsStore, MembersStore } from '~/store'
import { isShowPage } from '~/utils/ui/common'
import { isEditSvgName } from '~/utils/svgs/svg-edit-name'
import { strokeColor } from '~/utils/svgs/svg-stroke-color'

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
      if (isShowPage.value || isEditSvgName.value) return
      SvgsStore.deleteSvg(id)
    }

    const avatar = computed(() => {
      const member = MembersStore.members?.find((member) => member.userId === polyline.userId)
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
      namePosition,
      strokeColor,
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
