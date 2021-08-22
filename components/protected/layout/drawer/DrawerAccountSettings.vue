<template>
  <v-list>
    <v-list-group v-for="item in items" :key="item.icon">
      <template #activator>
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="sub in item.items" :key="sub.title" link dark>
        <v-list-item-icon>
          <v-icon>{{ sub.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ sub.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script lang="ts">
import { UserStore } from '~/store'

export default {
  data: () => ({
    items: [
      {
        icon: 'mdi-vuetify',
        items: [
          {
            icon: 'mdi-vuetify',
            title: 'My Profile',
          },
          {
            icon: 'mdi-vuetify',
            title: 'Edit Profile',
          },
          {
            icon: 'mdi-vuetify',
            title: 'Settings',
          },
        ],
      },
    ],
  }),

  computed: {
    name() {
      return UserStore.currentUser.name
    }
  }
}
</script>
