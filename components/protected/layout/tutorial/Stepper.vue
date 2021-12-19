<template>
  <v-stepper v-show="isRunningTutorial" id="tutorial-stepper" v-model="currentStep" v-top>
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
import { defineComponent, nextTick, ref, watch, useContext } from '@nuxtjs/composition-api'
import { DataTutorialKey } from '~/utils/tutorial/tutorial-table'

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

    /** 現在のステップをカウントする変数 */
    const currentStep = ref(1)

    /** シナリオの進行度を監視し、特定のシナリオでカウントをインクリメントまたはステップバーを非表示にする */
    watch($tutorial.nowScenarioKey, () => {
      const incrementScenarioList: DataTutorialKey[] = ['show-todo-list', 'show-edit-map', 'show-member', 'show-home']
      if (incrementScenarioList.includes($tutorial.nowScenarioKey.value)) currentStep.value++

      const hideScenarioList: DataTutorialKey[] = ['change-google-map-mode', 'add-rect']
      const stepperStyle = document.getElementById('tutorial-stepper')!.style
      if (hideScenarioList.includes($tutorial.nowScenarioKey.value)) {
        stepperStyle.visibility = 'hidden'
      } else {
        stepperStyle.visibility = 'visible'
      }
    })

    return {
      steps: ['計画作成', 'Todo作成', 'マップ作成', 'メンバー認証', '計画実行'],
      currentStep,
      // 空文字だとエラーが発生するので空白を入れている
      isRunningTutorial: $tutorial.isRunningTutorial,
      visible: ref(true),
    }
  },
})
</script>
<style lang="sass">
.vue-typer
  .custom.char
    color: white

#tutorial-stepper
  position: absolute
  z-index: 204
  width: 100%
</style>
