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

    <drawer />

    <v-img
      :src="require(`@/assets/login_gray.png`)"
      gradient="to top, #00000080, #00000080"
      min-height="100vh"
      :height="$vuetify.breakpoint.mdAndUp ? '100vh' : undefined"
    >
      <app-bar />

      <v-main>
        <v-container my-5>
          <Nuxt />
        </v-container>
      </v-main>

      <account-dialog />
    </v-img>

    <Footer />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@nuxtjs/composition-api'
import { AppBarTab, AppBarFunc } from 'interface'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'
import AppBar from '~/components/protected/layout/app_ber/AppBar.vue'
import Footer from '~/components/default/Footer.vue'
import AccountDialog from '~/components/protected/layout/AccountDialog.vue'
import Drawer from '~/components/protected/layout/drawer/Drawer.vue'
import { SnackbarStore } from '~/store'
import {
  AppBarTabKey,
  AppBarFuncKey,
  AccountDialogKey,
  DrawerKey
} from '~/types/injection-key'

export default defineComponent({
  components: {
    MaterialSnackbar,
    AppBar,
    Footer,
    AccountDialog,
    Drawer
  },

  middleware: ['authenticated'],

  setup() {
    const fixed = false

    const appBarTab = ref<AppBarTab[]>([])
    provide(AppBarTabKey, appBarTab)

    const appBarFunc = ref<AppBarFunc | null>(null)
    provide(AppBarFuncKey, appBarFunc)

    const accountDialog = ref(false)
    provide(AccountDialogKey, accountDialog)

    const drawer = ref(false)
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
