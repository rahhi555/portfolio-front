<template>
  <v-app-bar
    id="app-bar"
    app
    absolute
    class="v-bar--underline"
    height="50"
    flat
    dark
  >
    <go-home class="hidden-xs-only" />

    <drawer-toggle class="hidden-sm-and-up" />

    <v-spacer />

    <tab />

    <v-spacer />

    <!-- <notifications /> -->

    <account />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import GoHome from './AppBarGoHome.vue'
import DrawerToggle from './AppBarDrawerToggle.vue'
// import Notifications from './AppBarNotifications.vue'
import Account from './AppBarAccount.vue'
import Tab from './AppBarTab.vue'
import { PlansStore } from '~/store'

export default defineComponent({
  components: {
    GoHome,
    DrawerToggle,
    // Notifications,
    Account,
    Tab,
  },

  setup() {
    return {
    }
  },

  computed: {
    name() {
      const appbarName = PlansStore.currentPlan?.name
      let routeName = this.$route.name as string

      if (appbarName && routeName.includes('plans-id')) return appbarName

      routeName = routeName.replace(/.*-/g, '')
      return routeName.charAt(0).toUpperCase() + routeName.slice(1)
    },
  },
})
</script>
