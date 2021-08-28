<template>
  <v-app-bar
    id="app-bar"
    app
    absolute
    class="v-bar--underline"
    color="transparent"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

    <drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title class="font-weight-light text-h5" v-text="name" />

    <v-spacer />

    <template v-slot:extension>
      <tab />
    </template>

    <v-spacer />

    <search class="hidden-sm-and-down" />

    <go-home />

    <notifications />

    <account />
  </v-app-bar>
</template>

<script>
import { defineComponent, inject } from '@nuxtjs/composition-api'
import DrawerToggle from './AppBarDrawerToggle.vue'
import Search from './AppBarSearch.vue'
import GoHome from './AppBarGoHome.vue'
import Notifications from './AppBarNotifications.vue'
import Account from './AppBarAccount.vue'
import Tab from './AppBarTab.vue'
import { DrawerKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    DrawerToggle,
    Search,
    GoHome,
    Notifications,
    Account,
    Tab
  },

  setup() {
    const drawer = inject(DrawerKey)

    return {
      drawer,
    }
  },

  computed: {
    name() {
      const routeName = this.$route.name.replace(/.*-/g, '')
      return routeName.charAt(0).toUpperCase() + routeName.slice(1)
    },
  },
})
</script>
