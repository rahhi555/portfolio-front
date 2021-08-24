<template>
  <v-app dark>
    <app-bar />

    <MaterialSnackbar
      :type="snackParams.color"
      timeout="4000"
      v-bind="{
        center: true,
        top: true,
      }"
    >
      {{ snackParams.message }}
    </MaterialSnackbar>

    <drawer />

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  ref
} from '@nuxtjs/composition-api'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'
import AppBar from '~/components/protected/layout/app_ber/AppBar.vue'
import Drawer from '~/components/protected/layout/drawer/Drawer.vue'
import Footer from '~/components/protected/layout/Footer.vue'
import { SnackbarStore } from '~/store'
import { MiniVariantKey, DrawerKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    MaterialSnackbar,
    AppBar,
    Drawer,
    Footer,
  },

  middleware: ['authenticated'],

  setup() {
    const fixed = false

    const miniVariant = ref(false)
    provide(MiniVariantKey, miniVariant)
    
    const drawer = ref(true)
    provide(DrawerKey, drawer)

    return {
      fixed,
    }
  },

  computed: {
    snackParams: {
      get() {
        return SnackbarStore.snackParams
      },
      set() {
        SnackbarStore.hidden()
      },
    },
  },
})
</script>
