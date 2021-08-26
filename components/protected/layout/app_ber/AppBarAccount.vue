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
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
      </v-btn>
    </template>

    <v-list :tile="false" flat nav>
      <template v-for="(p, i) in profile">
        <v-divider v-if="p.divider" :key="`divider-${i}`" class="mb-2 mt-2" />

        <div v-else-if="p.title === 'Log out'" :key="`item-${i}`" @click="logout">
          <app-bar-item>
            <v-list-item-title v-text="p.title" />
          </app-bar-item>
        </div>

        <app-bar-item v-else :key="`item-${i}`" to="/">
          <v-list-item-title v-text="p.title" />
        </app-bar-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $auth } = useContext()

    const profile = [
      { title: 'Profile' },
      { title: 'Settings' },
      { divider: true },
      { title: 'Log out' },
    ]

    const logout = () => {
      $auth.logout()
    }

    return {
      profile,
      logout,
    }
  },
})
</script>
