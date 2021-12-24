<template>
  <div v-if="$device.isDesktop">
    <div v-show="isRunningTutorial" id="tutorial-div"></div>
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
            <v-toolbar color="primary" dark class="text-h4"
              >チュートリアル</v-toolbar
            >
            <v-card-text>
              <div class="text-h5 pt-5">チュートリアルを開始しますか？(NOを選んでも右上のアカウントアイコンからいつでも開始可能です)</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="startTutorial">Yes</v-btn>
              <v-btn
                text
                @click="
                  tutorialDialog = false;
                  isRunningTutorial = false;
                  indexPlans()
                "
                >No</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <LayoutTutorialTooltip />
    <LayoutTutorialMsgWindow />
    <LayoutTutorialStepper />
  </div>
</template>

<script setup lang="ts">
import { UserStore, PlansStore } from '~/store'

const tutorialDialog = ref(false)
const { $tutorial } = useContext()

const startTutorial = () => {
  tutorialDialog.value = false
  $tutorial.isRunningTutorial.value = true
  PlansStore.setPlansMutation([])
  $tutorial.initTutorial()
}

onMounted(() => {
  if (UserStore.needTutorial) {
    tutorialDialog.value = true
  }
})

const indexPlans = () => PlansStore.indexPlans()
const isRunningTutorial = $tutorial.isRunningTutorial
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
