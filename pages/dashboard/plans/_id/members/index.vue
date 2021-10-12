<template>
  <v-sheet color="white" elevation="1">
    <v-row>
      <v-col v-for="member in members" :key="member.id" md="3" sm="4">
        <MembersCard
          :member="member"
        />
      </v-col>
    </v-row>

    <RolesModal />
  </v-sheet>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from '@nuxtjs/composition-api'
import { MembersStore } from '~/store'
import setAppBarTabDialog from '~/utils/ui/app-bar-dialog'

export default defineComponent({
  layout: 'protected',

  middleware: [
    'initialize-store'  
  ],

  setup() {
    setAppBarTabDialog('ロール一覧')

    return {
      members: computed(() => {
        return MembersStore.members
      }),
    }
  },
})
</script>
