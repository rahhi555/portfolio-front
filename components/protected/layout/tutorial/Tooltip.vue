<template>
  <div
    v-show="tooltipMsg && isRunningTutorial"
    id="tutorial-tooltip"
    :class="[
      isFinishedDisplayMsg ? 'tutorial-tooltip-visible' : 'tutorial-tooltip-hidden',
      isTooltipCloseBottom ? 'tooltip-downward' : 'tooltip-upward',
    ]"
  >
    <p>{{ tooltipMsg }}</p>
  </div>
</template>

<script setup lang="ts">
const { $tutorial } = useContext()

const tooltipMsg = ref<string>()

/** ターゲットとスクリーンの下端の差を取得し、近ければtrue、離れていればfalseを返す */
const isTooltipCloseBottom = computed(() => {
  if (!$tutorial.targetElement.value) return false

  const screenWithTargetBottomDiff =
    document.documentElement.clientHeight - $tutorial.targetElement.value?.getBoundingClientRect().bottom
  return screenWithTargetBottomDiff < 100
})

/** ターゲットとスクリーンの右端の差を取得し、近ければtrue、離れていればfalseを返す */
const isTooltipCloseRight = computed(() => {
  if (!$tutorial.targetElement.value) return false

  const screenWithTargetRightDiff =
    document.documentElement.clientWidth - $tutorial.targetElement.value?.getBoundingClientRect().right
  return screenWithTargetRightDiff < 100
})

/** ターゲット要素が切り替わるたびツールチップの位置を合わせる */
watch(
  $tutorial.targetElement,
  async () => {
    if (!$tutorial.targetElement.value) return

    await nextTick()
    await await new Promise((resolve) => setTimeout(resolve, 300))

    const tooltipEl = document.getElementById('tutorial-tooltip') as HTMLDivElement

    if (!tooltipEl) return

    tooltipMsg.value = $tutorial.nowTooltip.value

    const targetRect = $tutorial.targetElement.value.getBoundingClientRect()
    const { left, top, bottom } = targetRect

    let tooltipTop: string
    if (isTooltipCloseBottom.value) {
      // ターゲットの位置がスクリーン下端と近い場合、ターゲットの上に配置する
      const tooltipHeight = tooltipEl.getBoundingClientRect().height
      const { marginTop, marginBottom } = window.getComputedStyle(tooltipEl)
      const tooltipAllHeight = tooltipHeight + Number.parseFloat(marginTop) + Number.parseFloat(marginBottom)
      tooltipTop = `${top - tooltipAllHeight}px`
    } else {
      // そうでなければターゲットの下に配置する
      tooltipTop = `${bottom}px`
    }

    // ターゲットの位置がスクリーン右端と近い場合、ターゲットを左寄りに配置する
    const tooltipLeft = isTooltipCloseRight.value ? left - 100 : left

    tooltipEl.style.top = tooltipTop
    tooltipEl.style.left = `${tooltipLeft}px`
  },
  { immediate: true }
)

const isRunningTutorial = $tutorial.isRunningTutorial
const isFinishedDisplayMsg = $tutorial.isFinishedDisplayMsg
</script>

<style lang="sass">
#tutorial-tooltip
  position: absolute
  display: inline-block
  margin: 1.5em 0
  padding: 7px 10px
  min-width: 120px
  max-width: 100%
  color: #333
  font-size: 0.85em
  background: #fff
  z-index: 205
  border-radius: .3ch
  box-shadow: 0 1em 2em -.5em rgba(0, 0, 0, 0.35)
  font-family: Helvetica, sans-serif
  text-align: center

// 上向きの三角形
.tooltip-upward:before
  content: ""
  position: absolute
  top: -30px
  left: 50%
  margin-left: -15px
  border: 15px solid transparent
  border-bottom: 15px solid #fff

// 下向きの三角形
.tooltip-downward:before
  content: ""
  position: absolute
  top: 100%
  left: 50%
  margin-left: -15px
  border: 15px solid transparent
  border-top: 15px solid #fff

#tutorial-tooltip p
  margin: 0
  padding: 0

.tutorial-tooltiip-visible
  visibility: visible

.tutorial-tooltip-hidden
  visibility: hidden
</style>
