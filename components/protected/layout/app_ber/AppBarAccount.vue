<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
        <v-list-item-avatar>
          <v-img :src="`https://i.pravatar.cc/180?img=1`" size="40"></v-img>
        </v-list-item-avatar>
      </v-btn>
    </template>

    <v-list :tile="false" flat nav>
      <template v-for="(p, i) in profile">
        <v-divider v-if="p.divider" :key="`divider-${i}`" class="mb-2 mt-2" />

        <app-bar-item v-else-if="p.title === 'Log out'" :key="`item-${i}`">
          <v-list-item-title @click="logout" v-text="p.title" />
        </app-bar-item>

        <app-bar-item v-else :key="`item-${i}`" to="/">
          <v-list-item-title v-text="p.title" />
        </app-bar-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const profile = [
      { title: 'Profile' },
      { title: 'Settings' },
      { divider: true },
      { title: 'Log out' },
    ]

    const logout = () => {
      import('~/utils/auth').then((module) => {
        module.logout()
      })
    }

    return {
      profile,
      logout,
    }
  },
})
</script>
