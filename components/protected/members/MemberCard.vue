<template>
  <v-card tile elevation="3">
    <v-avatar size="100%" tile>
      <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
    </v-avatar>
    <v-list-item color="rgba(0, 0, 0, .4)" light>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ member.userName }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ member.roleName }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-btn text icon>
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="member.userId == $store.getters['user/currentUser'].id"
        text
        icon
        color="error"
        @click="exitMembers(member.id)"
      >
        <v-icon>mdi-account-arrow-right-outline</v-icon>
      </v-btn>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { MembersStore } from '~/store'

export default defineComponent({
  props: {
    member: {
      type: Object,
      default: () => {},
    },
  },

  setup() {
    const exitMembers = (id: number) => {
      if (!confirm('メンバーを脱退してよろしいですか？')) {
        alert('キャンセルしました')
        return
      }

      MembersStore.exitMembers(id)
    }

    return {
      exitMembers,
    }
  },
})
</script>
