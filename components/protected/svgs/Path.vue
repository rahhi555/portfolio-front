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
  </g>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { SvgsStore, MembersStore } from '~/store'

export default defineComponent({
  props: {
    path: {
      type: Object,
      default: null,
    },
    isEditPage: {
      type: Boolean,
    },
  }, 

  setup(props) {
    const deletePath = (id: number) => {
      if (!props.isEditPage) return
      SvgsStore.deleteSvg(id)
    }

    const avatar = computed(() => {
      const member = MembersStore.members?.find(member => member.id === props.path.userId)
      return member?.avatar
    })

    return {
      deletePath,
      avatar
    }
  },
})
</script>

<style scoped lang="sass">
.path-avatar
  clip-path: circle(30%)
</style>