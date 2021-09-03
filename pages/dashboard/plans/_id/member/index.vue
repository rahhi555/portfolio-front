<template>
  <v-sheet color="white" elevation="1">
    <v-row>
      <v-col>
        <member-card></member-card>
      </v-col>
    </v-row>

    <role-base-modal></role-base-modal>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, provide, ref } from '@nuxtjs/composition-api'
import MemberCard from '~/components/protected/members/MemberCard.vue'
import RoleBaseModal from '~/components/protected/roles/RoleBaseModal.vue'
import { AppBarFuncKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    MemberCard,
    RoleBaseModal
  },

  layout: 'protected',

  setup(){
    const { $axios } = useContext()

    const dialog = ref(false)
    provide('dialog', dialog)

    const visibleRoleModal = () => {
      dialog.value = true
    }

    const appBarFunc = inject(AppBarFuncKey)
    appBarFunc!.value = { func: visibleRoleModal, name: 'ロール一覧' }
  }
})
</script>
