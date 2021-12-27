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
      <LayoutTutorialBase v-if="$device.isDesktop && needTutorial" />
    </client-only>

    <v-img
      :src="require(`@/assets/login_gray.jpg`)"
      gradient="to top, #00000080, #00000080"
      :max-height="isPlanIdPageAndLargeDevice ? '100vh' : 'none'"
    >
      <app-bar />

      <v-main>
        <v-container
          id="main-container"
          fluid
          :class="isSmAndDownWithPlanShow ? 'continer-mobile-and-show-plan' : 'continer-default'"
        >
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
export default {
  middleware: ['authenticated'],
}
</script>

<script setup lang="ts">
import { AppBarFunc } from 'interface'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'
import AppBar from '~/components/protected/layout/app_ber/AppBar.vue'
import Footer from '~/components/default/Footer.vue'
import AccountDialog from '~/components/protected/layout/AccountDialog.vue'
import Drawer from '~/components/protected/layout/drawer/Drawer.vue'
import MiniSnackbar from '~/components/protected/layout/MiniSnackBar.vue'
import { SnackbarStore, UserStore } from '~/store'
import { AppBarFuncKey, AccountDialogKey, IsVisibleDrawerKey, IsVisibleAppBarKey } from '~/types/injection-key'
import { isSmAndDownWithPlanShow } from '~/utils/ui/common'
import { auth } from '~/plugins/firebase'

const router = useRouter()
onMounted(() => {
  // クッキーが存在しサーバー側がログイン判定を出したとしても、クライアント側のfirebase authがログインしていないと判定したらクッキーを削除し、ログイン画面に飛ばす
  auth.onAuthStateChanged((user) => {
    if(!user && UserStore.isAuthenticated) {
      UserStore.removeUser()
      SnackbarStore.visible({ color: 'warning', message: 'ログインしてください' })
      router.replace('/auth/login')
    }

    // ログインしていたらメールアドレスセット
    if (user && user.email) UserStore.setEmail(user.email)
  })
})

const appBarFunc = ref<AppBarFunc | null>(null)
provide(AppBarFuncKey, appBarFunc)

const accountDialog = ref(false)
provide(AccountDialogKey, accountDialog)

const drawer = ref(false)
provide(IsVisibleDrawerKey, drawer)

const isVisibleAppBar = ref(true)
provide(IsVisibleAppBarKey, isVisibleAppBar)

const route = useRoute()
const { $vuetify } = useContext()
/** いずれかの計画idページかつデバイスが大きいときtrueを返す */
const isPlanIdPageAndLargeDevice = computed(() => {
  return route.value.name!.startsWith('dashboard-plans-id') && $vuetify.breakpoint.lgAndUp
})

const snackParams = computed({
  get: () => SnackbarStore.snackParams,
  set: () => SnackbarStore.hidden(),
})

const needTutorial = UserStore.needTutorial
</script>

<style scoped>
.continer-default {
  margin: 20px 0;
  padding: 12px 32px;
}

.continer-mobile-and-show-plan {
  padding-left: 64px;
}
</style>
