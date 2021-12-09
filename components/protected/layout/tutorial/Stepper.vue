<template>
  <v-alert
    v-show="isRunningTutorial"
    id="tutorial-stepper"
    dense
    color="transparent"
    style="position: absolute; z-index: 204; width: 100%"
  >
    <v-sheet
      class="mb-3"
      elevation="1"
      height="100"
      width="100%"
      style="border: solid 3px white; background-color: transparent"
      @click="shiftMessages"
    >
      <client-only>
        <VueTyperClient :text="message" :type-delay="10" :repeat="0"></VueTyperClient>
      </client-only>
    </v-sheet>
    <v-stepper v-model="currentStep">
      <v-stepper-header style="height: 50px">
        <template v-for="(step, i) in steps">
          <v-stepper-step
            :key="i + 'step'"
            :step="i + 1"
            :complete="currentStep > i + 1"
            style="padding: 0 10px; height: 50px"
          >
            <div>{{ step }}</div>
          </v-stepper-step>
          <v-divider v-if="i + 1 !== steps.length" :key="i + 'divider'"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch, computed } from '@nuxtjs/composition-api'

let VueTyperClient
if (process.client) {
  VueTyperClient = require('vue-typer').VueTyper
}

export default defineComponent({
  components: {
    VueTyperClient,
  },

  props: {
    isRunningTutorial: {
      type: Boolean,
    },
  },

  setup(props) {
    const steps = ['計画作成', 'Todo作成', 'マップ作成', 'メンバー認証', '計画実行']
    const currentStep = ref(1)

    const messages = ref<string[]>([''])

    watch(props, async () => {
      await nextTick()

      const stepper = document.getElementById('tutorial-stepper') as HTMLDivElement

      // 下の画面外に出てしまうので位置を合わせる
      stepper.style.top = `${window.innerHeight - stepper.getBoundingClientRect().height}px`

      const nowMessages = (await import('~/utils/tutorial/tutorial-tables')).nowMessages
      const nowScenarioKey = (await import('~/utils/tutorial/tutorial-tables')).nowScenarioKey
      watch(
        nowMessages,
        () => {
          messages.value = nowMessages.value
        },
        { immediate: true }
      )
      watch(
        nowScenarioKey,
        () => {
          switch(nowScenarioKey.value) {
            case 'show-todo-list':
              currentStep.value = 2
              break
          }
        }
      )
    })

    const shiftMessages = async () => {
      messages.value.shift()
      if (!messages.value.length) {
        (await import('~/utils/tutorial/tutorial')).isFinishedDisplayMsg.value = true
      }
    }

    return {
      steps,
      currentStep,
      // 空文字だとエラーが発生するので空白を入れている
      message: computed(() => messages.value[0] || ' '),
      shiftMessages,
    }
  },
})
</script>
<style lang="sass">
.vue-typer
  .custom.char
    color: white
</style>
