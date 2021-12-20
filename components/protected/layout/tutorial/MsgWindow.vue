<template>
  <transition name="slide">
    <v-alert
      v-show="isRunningTutorial && message !== ' '"
      v-top
      dense
      color="transparent"
      style="position: absolute; z-index: 204; width: 100%"
    >
      <v-sheet
        class="mb-3 px-5"
        elevation="1"
        height="100px"
        width="100%"
        style="border: solid 3px white; background-color: transparent; line-height: 90px;"
      >
        <client-only>
          <VueTyperClient :text="message" :type-delay="20" :repeat="0"></VueTyperClient>
        </client-only>
      </v-sheet>
    </v-alert>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch, computed, useContext } from '@nuxtjs/composition-api'

let VueTyperClient
if (process.client) {
  VueTyperClient = require('vue-typer').VueTyper
}

export default defineComponent({
  components: {
    VueTyperClient,
  },

  directives: {
    top: {
      update(el) {
        nextTick().then(() => {
          const tutorialStepper = document.getElementById('tutorial-stepper')
          const stepperHeight = tutorialStepper?.getBoundingClientRect().height!
          // 下の画面外に出てしまうので位置を合わせる
          el.style.top = `${window.innerHeight - el.getBoundingClientRect().height - stepperHeight}px`
        })
      },
    },
  },

  setup() {
    const { $tutorial } = useContext()

    const messageIndex = ref(0)

    const toNextMessage = (e: any) => {
      if(e.type === 'click' || e.key === 'Enter') {

        messageIndex.value++
        if ($tutorial.nowMessages.value.length - 1 < messageIndex.value) {
          $tutorial.isFinishedDisplayMsg.value = true
          window.removeEventListener('click', toNextMessage)
          window.removeEventListener('keydown', toNextMessage)
        }
      }
    }

    watch(
      () => [$tutorial.nowMessages.value, $tutorial.isRunningTutorial.value],
      async () => {
        messageIndex.value = 0

        if (!$tutorial.nowMessages.value.length) return

        // 遅延させないとチュートリアル開始の選択肢をクリックした時点でイベントが発火する(nextTickで遅延が不可能だった)
        await new Promise((resolve) => setTimeout(resolve, 300))

        window.addEventListener('click', toNextMessage)
        window.addEventListener('keydown', toNextMessage)
      }
    )

    return {
      // 空文字だとエラーが発生するので空白を入れている
      message: computed(() => $tutorial.nowMessages.value[messageIndex.value] || ' '),
      isRunningTutorial: $tutorial.isRunningTutorial,
    }
  },
})
</script>
<style lang="sass">
.vue-typer
  font-size: 1.1em

  .custom.char
    color: white

  .custom.typed
    margin-right: 1px

  .custom.caret
    background-color: white
    width: 1px
    height: 1.1em
    vertical-align: middle

.slide-enter-active
  transition: .4s

.slide-enter
  opacity: 0

.slide-leave-active
  transition: .4s

.slide-leave-to
  opacity: 0
  transform: translateY(100px)
</style>
