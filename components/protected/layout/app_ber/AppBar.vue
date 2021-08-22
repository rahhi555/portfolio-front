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
    <drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title class="font-weight-light text-h5" v-text="name" />

    <v-spacer />

    <search class="hidden-sm-and-down" />

    <go-home />

    <notifications />

    <account />
  </v-app-bar>
</template>

<script>
import DrawerToggle from './AppBarDrawerToggle.vue'
import Search from './AppBarSearch.vue'
import GoHome from './AppBarGoHome.vue'
import Notifications from './AppBarNotifications.vue'
import Account from './AppBarAccount.vue'

export default {
  components: {
    DrawerToggle,
    Search,
    GoHome,
    Notifications,
    Account,
  },

  computed: {
    name() {
      const routeName = this.$route.name.replace(/.*-/g, '')
      return routeName.charAt(0).toUpperCase() + routeName.slice(1)
    },
  },
}
</script>
