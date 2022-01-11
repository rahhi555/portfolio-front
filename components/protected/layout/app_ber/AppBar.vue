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
    <go-home v-show="$device.isDesktop" />

    <drawer-toggle v-show="$device.isMobileOrTablet" />

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

const isVisibleAppBar = inject(IsVisibleAppBarKey)
</script>
