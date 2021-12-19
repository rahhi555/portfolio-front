<template>
  <v-app dark>
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

    <SmartphoneSideway />

    <client-only>
      <drawer />
    </client-only>

    <client-only>
      <LayoutTutorialBase v-if="$device.isDesktop" />
    </client-only>

    <v-img
      :src="require(`@/assets/login_gray.jpg`)"
      gradient="to top, #00000080, #00000080"
      :max-height="isPlanIdPageAndLargeDevice ? '100vh' : 'none'"
    >
      <app-bar />

      <v-main>
        <v-container my-5 fluid :px-8="$vuetify.breakpoint.smAndUp">
          <Nuxt />
        </v-container>
      </v-main>
    
      <Footer v-if="!isPlanIdPageAndLargeDevice" />
      <account-dialog />

      <mini-snackbar />
    </v-img>

  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide, ref, useRoute, computed, useContext } from '@nuxtjs/composition-api'
import { AppBarFunc } from 'interface'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'
import AppBar from '~/components/protected/layout/app_ber/AppBar.vue'
import Footer from '~/components/default/Footer.vue'
import AccountDialog from '~/components/protected/layout/AccountDialog.vue'
import Drawer from '~/components/protected/layout/drawer/Drawer.vue'
import MiniSnackbar from '~/components/protected/layout/MiniSnackBar.vue'
import { SnackbarStore } from '~/store'
import {
  AppBarFuncKey,
  AccountDialogKey,
  DrawerKey,
} from '~/types/injection-key'

export default defineComponent({
  components: {
    MaterialSnackbar,
    AppBar,
    // 圧迫感があるため一旦フッター削除
    Footer,
    AccountDialog,
    Drawer,
    MiniSnackbar
  },

  middleware: ['authenticated'],

  setup() {
    const fixed = false

    const appBarFunc = ref<AppBarFunc | null>(null)
    provide(AppBarFuncKey, appBarFunc)

    const accountDialog = ref(false)
    provide(AccountDialogKey, accountDialog)

    const drawer = ref(false)
    provide(DrawerKey, drawer)

    const route = useRoute()
    const { $vuetify } = useContext()
    /** いずれかの計画idページかつデバイスが大きいときtrueを返す */
    const isPlanIdPageAndLargeDevice = computed(() => {
      return route.value.name!.startsWith('dashboard-plans-id') && $vuetify.breakpoint.lgAndUp
    })

    return {
      fixed,
      isPlanIdPageAndLargeDevice,
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
