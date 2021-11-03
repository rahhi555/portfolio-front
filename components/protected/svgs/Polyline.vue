<template>
  <g
    :id="'svg-' + polyline.id"
    :transform="'translate(' + polyline.x + ',' + polyline.y + ')'"
    style="cursor: pointer"
    tabindex="100"
    @keydown.delete="deletePolyline(polyline.id)"
  >
    <polyline stroke="black" fill="none" stroke-width="5" :points="polyline.drawPoints" />
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