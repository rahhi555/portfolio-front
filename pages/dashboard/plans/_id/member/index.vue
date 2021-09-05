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
  inject,
  provide,
  ref,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import MemberCard from '~/components/protected/members/MemberCard.vue'
import RoleModal from '~/components/protected/roles/RoleModal.vue'
import { AppBarFuncKey } from '~/types/injection-key'
import { PlansStore, MembersStore } from '~/store'

export default defineComponent({
  components: {
    MemberCard,
    RoleModal,
  },

  layout: 'protected',

  setup() {
    useFetch(async ({ $route }) => {
      if (PlansStore.plan) return
      const planId = $route.params.id
      await Promise.all([
        PlansStore.setPlan(planId),
        MembersStore.setMembers(planId),
      ])
    })

    const dialog = ref(false)
    provide('dialog', dialog)

    const visibleRoleModal = () => {
      dialog.value = true
    }

    const appBarFunc = inject(AppBarFuncKey)
    appBarFunc!.value = { func: visibleRoleModal, name: 'ロール一覧' }

    return {
      members: computed(() => {
        return MembersStore.members
      }),
    }
  },
})
</script>
