<template>
  <div v-show="tooltip && isRunningTutorial" id="tutorial-tooltip">
    <p>{{ tooltip }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, nextTick, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $tutorial } = useContext()
    const tooltip = ref<string>()

    watch(
      () => [$tutorial.isFinishedDisplayMsg.value, $tutorial.targetElement.value],
      async () => {
        if (!$tutorial.targetElement.value) return

        await nextTick()
        await await new Promise((resolve) => setTimeout(resolve, 300))

        const tutorialTooltip = document.getElementById('tutorial-tooltip') as HTMLDivElement

        if (!tutorialTooltip) return

        if (!$tutorial.isFinishedDisplayMsg.value) {
          tutorialTooltip.style.visibility = 'hidden'
          return
        }

        tooltip.value = $tutorial.nowTooltip.value

        tutorialTooltip.style.top = `${$tutorial.targetElement.value.getBoundingClientRect().bottom}px`
        tutorialTooltip.style.left = `${$tutorial.targetElement.value.getBoundingClientRect().left}px`
        tutorialTooltip.style.visibility = 'visible'
      },
      { immediate: true }
    )

    return {
      tooltip,
      isRunningTutorial: $tutorial.isRunningTutorial
    }
  },
})
</script>

<style lang="sass">
#tutorial-tooltip
  position: absolute
  display: inline-block
  margin: 1.5em 0
  padding: 7px 10px
  min-width: 120px
  max-width: 100%
  color: #555
  font-size: 16px
  background: #e0edff
  z-index: 205
  visibility: hidden

#tutorial-tooltip:before
  content: ""
  position: absolute
  top: -30px
  left: 50%
  margin-left: -15px
  border: 15px solid transparent
  border-bottom: 15px solid #e0edff

#tutorial-tooltip p
  margin: 0
  padding: 0s
</style>
