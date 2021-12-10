<template>
  <v-stepper
    v-show="isRunningTutorial"
    id="tutorial-stepper"
    v-model="currentStep"
    v-top
    style="position: absolute; z-index: 204; width: 100%"
  >
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
</template>

<script lang="ts">
import { defineComponent, nextTick, computed, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  directives: {
    top: {
      update(el) {
        nextTick().then(() => {
          // 下の画面外に出てしまうので位置を合わせる
          el.style.top = `${window.innerHeight - el.getBoundingClientRect().height}px`
        })
      },
    },
  },

  setup() {
    const { $tutorial } = useContext()
    const steps = ['計画作成', 'Todo作成', 'マップ作成', 'メンバー認証', '計画実行']
    const currentStep = computed(() => {
      let step!: number
      switch ($tutorial.nowScenarioKey.value) {
        case 'show-todo-list':
        case 'app-bar-btn':
        case 'create-todo-list-input':
        case 'create-todo-list-submit':
          step = 2
          break
        default:
          step = 1
          break
      }
      return step
    })

    return {
      steps,
      currentStep,
      // 空文字だとエラーが発生するので空白を入れている
      isRunningTutorial: $tutorial.isRunningTutorial,
    }
  },
})
</script>
<style lang="sass">
.vue-typer
  .custom.char
    color: white
</style>
