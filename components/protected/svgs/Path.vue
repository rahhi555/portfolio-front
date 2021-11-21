<template>
  <g
    :id="'svg-' + path.id"
    :transform="'translate(' + path.x + ',' + path.y + ')'"
  >
    <path
      fill="black"
      :d="path.drawPoints"
    />
    <image
      :href="avatar"
      tabindex="0"
      x="4.5"
      y="-10"
      height="50px"
      width="50px"
      class="path-avatar"
      style="cursor: pointer"
      @keydown.delete="deletePath(path.id)"
    />

    <SvgsText :svg="path" :text-x="30" :text-y="-10" />
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import { Path } from 'interface'
import { SvgsStore, MembersStore } from '~/store'
import CommonUI from '~/utils/ui/common'

export default defineComponent({
  props: {
    path: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const path = props.path as Path

    const deletePath = (id: number) => {
      if (!CommonUI.isEditPage.value) return
      SvgsStore.deleteSvg(id)
    }

    const avatar = computed(() => {
      const member = MembersStore.members?.find(
        (member) => member.userId === path.userId
      )
      return member?.avatar
    })

    // pathの表示判定とdisplayTimeが経過したらfalseにする関数
    const isDisplay = ref(true)
    onMounted(() =>
      setTimeout(() => {
        if (!path.displayTime) return
        isDisplay.value = false
        SvgsStore.deleteSvgMutation(path.id)
      }, path.displayTime)
    )

    return {
      deletePath,
      avatar,
      isDisplay,
    }
  },
})
</script>

<style scoped lang="sass">
.path-avatar
  clip-path: circle(30%)
</style>
