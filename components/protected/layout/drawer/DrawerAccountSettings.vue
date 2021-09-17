<template>
  <v-list>
    <v-list-item>
      <v-list-item-avatar>
        <v-img v-if="avatar" :src="avatar" />
        <v-icon v-else>mdi-account</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { UserStore } from '~/store'

export default {
  computed: {
    name() {
      return UserStore.currentUser.name
    },
    avatar() {
      return UserStore.currentUser.avatar
    },
  },
}
</script>
