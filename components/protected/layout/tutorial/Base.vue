<template>
  <div>
    <div v-if="isRunningTutorial" id="tutorial-div"></div>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          v-model="tutorialDialog"
          persistent
          transition="dialog-top-transition"
          max-width="600"
          style="z-index: 204"
        >
          <v-card>
            <v-toolbar color="primary" dark
              >チュートリアルを実行しますか？</v-toolbar
            >
            <v-card-text>
              <div class="text-h2 pa-12">チュートリアルを実行しますか？</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="startTutorial">Yes</v-btn>
              <v-btn
                text
                @click="
                  tutorialDialog = false
                  isRunningTutorial = false
                  indexPlans()
                "
                >No</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <LayoutTutorialTooltip :is-running-tutorial="isRunningTutorial" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { UserStore, PlansStore } from '~/store'

export default defineComponent({
  setup() {
    const tutorialDialog = ref(false)
    const isRunningTutorial = ref(false)

    const startTutorial = () => {
      tutorialDialog.value = false
      isRunningTutorial.value = true
      import('~/utils/tutorial/tutorial').then(({ initTutorial }) =>
        initTutorial()
      )
    }

    onMounted(() => {
      if(process.server) return
      if (UserStore.needTutorial) {
        tutorialDialog.value = true
      }
    })

    return {
      tutorialDialog,
      isRunningTutorial,
      startTutorial,
      indexPlans: () => PlansStore.indexPlans(),
    }
  },
})
</script>

<style scoped lang="sass">
#tutorial-div
  position: absolute
  // v-dialogのデフォルトのz-indexが202なのでそれを上回る値
  z-index: 203
  background-color: black
  opacity: 0.5
  width: 100%
  height: 100%
</style>
