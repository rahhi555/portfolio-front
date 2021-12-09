<template>
  <v-alert
    id="tutorial-stepper"
    dense
    color="transparent"
    style="position: absolute; z-index: 204; width: 100%;"
  >
    <v-sheet class="mb-3" elevation="1" height="100" width="100%" style="border: solid 3px white; background-color: transparent; color: white;">
      {{messages}}
    </v-sheet>
    <v-stepper v-model="currentStep">
      <v-stepper-header style="height: 50px;">
        <template v-for="(step, i) in steps">
          <v-stepper-step
            :key="i + 'step'"
            :step="i + 1"
            :complete="currentStep > i + 1"
            style="padding: 0 10px; height: 50px;"
          >
            <div>{{ step }}</div>
          </v-stepper-step>
          <v-divider v-if="i + 1 !== steps.length" :key="i + 'divider'"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </v-alert>
</template>

<script lans="ts">
import { defineComponent, ref, onMounted, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const messages = ref()
    const steps = ['計画作成', 'Todo作成', 'マップ作成', 'メンバー認証', '計画実行']
    const currentStep = ref(1)

    onMounted(async () => {
      const stepper = document.getElementById('tutorial-stepper')
      // 下の画面外に出てしまうので位置を合わせる
      stepper.style.top = `${window.innerHeight - stepper.getBoundingClientRect().height}px`

      const nowMessages = (await import('~/utils/tutorial/tutorial-tables')).nowMessages
      watch(nowMessages, () => {
        messages.value = nowMessages.value
      }, { immediate: true })
    })

    return {
      steps,
      currentStep,
      messages
    }
  },
})
</script>
