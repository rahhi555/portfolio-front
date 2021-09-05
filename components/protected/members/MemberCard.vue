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

      <v-btn text icon @click="dialog = true">
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

    <v-dialog v-model="dialog" max-width="800px">
      <v-simple-table class="pa-4">
        <template #default>
          <thead>
            <tr>
              <th width="35%" class="text-left">ロール名</th>
              <th width="55%" class="text-left">説明</th>
              <th width="10%" class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.name">
              <td>{{ role.name }}</td>
              <td>{{ role.description }}</td>
              <td>
                <v-icon v-if="member.roleId === role.id">mdi-checkbox-marked</v-icon>
                <v-icon v-else @click="updateMember(member.id, role.id)">mdi-checkbox-blank-outline</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { MembersStore, RolesStore } from '~/store'

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

    const updateMember = (id: number, roleId: number) => {
      MembersStore.updateMember({id, roleId})
    }

    return {
      exitMembers,
      dialog: ref(false),
      roles: computed(() => {
        return RolesStore.roles
      }),
      updateMember
    }
  },
})
</script>
