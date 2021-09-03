<template>
  <v-sheet color="white" elevation="1">
    <v-row>
      <v-col>
        <member-card></member-card>
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
} from '@nuxtjs/composition-api'
import MemberCard from '~/components/protected/members/MemberCard.vue'
import RoleModal from '~/components/protected/roles/RoleModal.vue'
import { AppBarFuncKey } from '~/types/injection-key'
import { PlansStore } from '~/store'

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
      await PlansStore.setPlan(planId)
    })
    
    const dialog = ref(false)
    provide('dialog', dialog)

    const visibleRoleModal = () => {
      dialog.value = true
    }

    const appBarFunc = inject(AppBarFuncKey)
    appBarFunc!.value = { func: visibleRoleModal, name: 'ロール一覧' }
  },
})
</script>
