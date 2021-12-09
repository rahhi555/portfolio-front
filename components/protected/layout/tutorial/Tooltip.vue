<template>
  <div v-show="tooltip && isRunningTutorial" id="tutorial-tooltip">
    <p>{{ tooltip }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, nextTick, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isRunningTutorial: {
      type: Boolean,
    },
  },

  setup(props) {
    const tooltip = ref<string>()

    watch(props, async () => {
      // 遅延読み込みしないとトップページアクセス時にtutorial-tablesが読み込まれてしまい、document is not defined エラーが発生する
      const nowTooltip = (await import('~/utils/tutorial/tutorial-tables')).nowTooltip
      const targetElement = (await import('~/utils/tutorial/tutorial-tables')).targetElement
      const isFinishedDisplayMsg = (await import('~/utils/tutorial/tutorial')).isFinishedDisplayMsg

      watch(
        () => [isFinishedDisplayMsg.value, targetElement.value],
        async () => {
          if (!targetElement.value) return

          await nextTick()
          await await new Promise((resolve) => setTimeout(resolve, 300))

          const tutorialTooltip = document.getElementById('tutorial-tooltip') as HTMLDivElement

          if (!tutorialTooltip) return

          if (!isFinishedDisplayMsg.value) {
            tutorialTooltip.style.visibility = 'hidden'
            return
          }

          tooltip.value = nowTooltip.value

          tutorialTooltip.style.top = `${targetElement.value.getBoundingClientRect().bottom}px`
          tutorialTooltip.style.left = `${targetElement.value.getBoundingClientRect().left}px`
          tutorialTooltip.style.visibility = 'visible'
        },
        { immediate: true }
      )
    })

    return {
      tooltip,
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
  z-index: 204
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
