<template>
  <v-sheet color="white" elevation="1">
    <v-row>
      <v-col v-for="member in members" :key="member.id" md="3" sm="4">
        <member-card
          :member="member"
        ></member-card>
      </v-col>
    </v-row>

    <role-modal></role-modal>
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import MemberCard from '~/components/protected/members/MemberCard.vue'
import RoleModal from '~/components/protected/roles/RoleModal.vue'
import { PlansStore, MembersStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  components: {
    MemberCard,
    RoleModal,
  },

  layout: 'protected',

  setup() {
    useFetch(async ({ $route }) => {
      const planId = $route.params.id
      await Promise.all([
        PlansStore.setCurrentPlan(planId),
        MembersStore.indexMembers(planId),
      ])
    })

    setAppBarTabDialog('ロール一覧')

    return {
      members: computed(() => {
        return MembersStore.members
      }),
    }
  },
})
</script>
