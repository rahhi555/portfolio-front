<template>
  <v-app-bar :absolute="$vuetify.breakpoint.mdAndUp" color="transparent" dark flat height="80">
    <v-container class="px-0 d-flex align-center">
      <v-toolbar-title class="font-weight-light hidden-xs-only" v-text="`${name} Page`" />

      <v-spacer />

      <template v-for="(item, i) in items">
        <v-btn
          v-if="item.isAuthenticated === isAuthenticated"
          :to="item.to"
          :key="i"
          nuxt
          class="ml-1 ml-md-7"
          min-height="48"
          min-width="40"
          text
        >
          <v-icon :left="$vuetify.breakpoint.mdAndUp" size="20" v-text="item.icon" />

          <span class="hidden-sm-and-down" v-text="item.text" />
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { UserStore } from '~/store'

const items = [
  {
    icon: 'mdi-account-multiple-plus',
    text: 'Register',
    to: '/auth/register',
    isAuthenticated: false,
  },
  {
    icon: 'mdi-fingerprint',
    text: 'Login',
    to: '/auth/login',
    isAuthenticated: false,
  },
  {
    icon: 'mdi-view-dashboard',
    text: 'DashBoard',
    to: '/dashboard/plans',
    isAuthenticated: true,
  },
]

const route = useRoute()
const name = computed(() => {
  if (!route.value.name) return

  const routeName = route.value.name!.replace(/.*-/g, '')
  return routeName.charAt(0).toUpperCase() + routeName.slice(1)
})

const isAuthenticated = computed(() => UserStore.isAuthenticated)
</script>
