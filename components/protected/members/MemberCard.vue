<template>
  <v-card tile elevation="3">
    <v-tooltip v-if="member.accept && !isAuthorCard" bottom>
      <template #activator="{ on, attrs }">
        <v-icon
          color="success"
          large
          class="accept-icon"
          v-bind="attrs"
          v-on="on"
          @click="acceptToggle(member)"
          >mdi-account</v-icon
        >
      </template>
      <span>承認済み</span>
    </v-tooltip>
    <v-tooltip v-else-if="!member.accept" bottom>
      <template #activator="{ on, attrs }">
        <v-icon
          color="error"
          large
          class="accept-icon"
          v-bind="attrs"
          v-on="on"
          @click="acceptToggle(member)"
          >mdi-account-alert</v-icon
        >
      </template>
      <span>未承認</span>
    </v-tooltip>

    <v-avatar size="100%" height="200px" tile>
      <v-img v-if="member.avatar" :src="member.avatar"></v-img>
      <v-icon v-else size="150"> mdi-account </v-icon>
    </v-avatar>
    <v-list-item color="rgba(0, 0, 0, .4)" light>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ member.userName }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ member.roleName }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-btn v-if="currentUserAccept" text icon @click="dialog = true">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="isMyCard && !isAuthorCard"
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
                <v-icon
                  v-if="member.roleId === role.id"
                  @click="updateMember(member.id, null)"
                  >mdi-checkbox-marked</v-icon
                >
                <v-icon v-else @click="updateMember(member.id, role.id)"
                  >mdi-checkbox-blank-outline</v-icon
                >
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
import { Member } from 'interface'
import { MembersStore, PlansStore, RolesStore, UserStore } from '~/store'

export default defineComponent({
  props: {
    member: {
      type: Object,
      default: () => {},
    },
  },

  setup(props) {
    const exitMembers = (id: number) => {
      if (!confirm('メンバーを脱退してよろしいですか？')) {
        alert('キャンセルしました')
        return
      }

      MembersStore.exitMembers(id)
    }

    const updateMember = (id: number, roleId: number) => {
      MembersStore.updateMember({ id, roleId })
    }

    const acceptToggle = (member: Member) => {
      if (PlansStore.currentPlan!.userId !== UserStore.currentUser.id) {
        alert('承認および承認解除は作成者しか実行できません')
        return
      }
      const accept = !member.accept
      MembersStore.updateMember({ id: member.id, accept })
    }

    const isAuthorCard = computed(() => {
      return PlansStore.currentPlan?.userId === props.member.userId
    })

    const isMyCard = computed(() => {
      return UserStore.currentUser.id === props.member.userId
    })

    return {
      exitMembers,
      dialog: ref(false),
      updateMember,
      acceptToggle,
      isAuthorCard,
      isMyCard,
    }
  },

  computed: {
    roles() {
      return RolesStore.roles
    },
    currentUserAccept() {
      return MembersStore.currentUserAccept
    },
  },
})
</script>

<style scoped lang="sass">
.accept-icon
  position: absolute
  right: 10px
  top: 5px
  z-index: 1
</style>
