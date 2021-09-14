<template>
  <v-app-bar
    id="app-bar"
    app
    absolute
    class="v-bar--underline"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="50"
    flat
    dark
  >
    <go-home />

    <v-spacer />

    <tab />

    <v-spacer />

    <notifications />

    <account />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import GoHome from './AppBarGoHome.vue'
import Notifications from './AppBarNotifications.vue'
import Account from './AppBarAccount.vue'
import Tab from './AppBarTab.vue'
import { PlansStore } from '~/store'

export default defineComponent({
  components: {
    GoHome,
    Notifications,
    Account,
    Tab,
  },

  setup() {
    return {}
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
