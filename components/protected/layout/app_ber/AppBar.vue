<template>
  <v-app-bar
    id="app-bar"
    app
    absolute
    class="v-bar--underline"
    height="50"
    flat
    dark
    :color="isPlanActive ? 'primary' : undefined"
    :value="isVisibleAppBar"
    style="z-index: 3;"
  >
    <go-home v-show="!isMobile" />

    <drawer-toggle v-show="isMobile" />

    <v-spacer />

    <tab />

    <v-spacer />

    <notifications />

    <account />
  </v-app-bar>
</template>

<script setup lang="ts">
import GoHome from './AppBarGoHome.vue'
import DrawerToggle from './AppBarDrawerToggle.vue'
import Notifications from './AppBarNotifications.vue'
import Account from './AppBarAccount.vue'
import Tab from './AppBarTab.vue'
import { isPlanActive } from '~/utils/ui/common'
import { IsVisibleAppBarKey } from '~/types/injection-key'

const isMobile = useContext().$device.isMobile

const isVisibleAppBar = inject(IsVisibleAppBarKey)
</script>
