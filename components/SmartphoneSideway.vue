<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          横向きの操作を推奨します
        </v-card-title>

        <v-img :src="require('@/assets/smartphone_sideway.png')"> </v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $device } = useContext()
    const dialog = ref(false)

    // アクセス時の１回のみダイアログを表示したいため、onMountedを使用しない
    if (process.client && $device.isMobileOrTablet) {
      window.addEventListener('load', () => {
        dialog.value = true
        setTimeout(() => {
          dialog.value = false
        }, 3000)
      })
    }
    return {
      dialog,
    }
  },
})
</script>
