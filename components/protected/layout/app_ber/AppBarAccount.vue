<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template #activator="{ attrs, on }">
      <v-btn v-show="isNotMobile" data-cypress="logout" class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
        <v-avatar>
          <v-img v-if="currentUser.avatar" height="100%" width="100%" :src="currentUser.avatar" />
          <v-icon v-else class="mx-auto">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>

    <v-list :tile="false" flat nav>
      <div @click="accountDialog = true">
        <app-bar-item>
          <v-list-item-title v-text="'Profile'" />
        </app-bar-item>
      </div>
      <v-divider class="mb-2 mt-2" />

      <div @click="logout">
        <app-bar-item>
          <v-list-item-title v-text="'Log out'" />
        </app-bar-item>
      </div>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, useContext, inject } from '@nuxtjs/composition-api'
import { AccountDialogKey } from '~/types/injection-key'
import { UserStore } from '~/store'

export default defineComponent({
  setup() {
    const { $auth } = useContext()

    const accountDialog = inject(AccountDialogKey)

    const logout = () => {
      $auth.logout()
    }

    return {
      logout,
      accountDialog,
      isNotMobile: !useContext().$device.isMobile
    }
  },

  computed: {
    currentUser() {
      return UserStore.currentUser
    }
  }
})
</script>
