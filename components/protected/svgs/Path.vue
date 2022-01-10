<template>
  <g
    :id="'svg-' + path.id"
    :transform="'translate(' + path.x + ',' + path.y + ')'"
    style="cursor: pointer"
    tabindex="0"
    @keydown.delete="deletePath(path.id)" 
  >
    <path
      fill="black"
      :d="path.drawPoints"
    />
    <image
      :href="avatar"
      x="4.5"
      y="-10"
      height="50px"
      width="50px"
      class="path-avatar"
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
import { isShowPage } from '~/utils/ui/common'
import { isEditSvgName } from '~/utils/svgs/svg-edit-name'

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
      if (isShowPage.value || isEditSvgName.value) return
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
