<template>
  <g
    :id="'svg-' + polyline.id"
    :transform="'translate(' + polyline.x + ',' + polyline.y + ')'"
    style="cursor: pointer"
    tabindex="100"
    @keydown.delete="deletePolyline(polyline.id)"
  >

    <defs>
      <marker
        id="triangle"
        viewBox="0 0 10 10"
        refX="1"
        refY="5"
        markerUnits="strokeWidth"
        markerWidth="3"
        markerHeight="3"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
      </marker>
      <marker
        id="dot"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="3"
        markerHeight="3"
      >
        <circle cx="5" cy="5" r="5" fill="black" />
      </marker>
    </defs>

    <polyline
      stroke="black"
      fill="none"
      stroke-width="5"
      :points="polyline.drawPoints"
      marker-start="url(#dot)"
      marker-end="url(#triangle)"
    />
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
import CommonUI from '~/utils/ui/common'

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
      if (!CommonUI.isEditPage.value) return
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

    return {
      deletePolyline,
      avatar,
      isDisplay,
    }
  },
})
</script>
