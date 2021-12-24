<template>
  <v-banner color="warning" icon="mdi-alert-circle-outline" class="mx-16">
    <span v-if="isRequested">作成者の承認待ちです </span>

    <span v-else
      >計画作成者の承認が必要です
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" @click="joinRequest">mdi-import</v-icon>
        </template>
        <span>承認リクエスト送信</span>
      </v-tooltip>
    </span>
  </v-banner>
</template>

<script setup lang="ts">
import { MembersStore, PlansStore, UserStore } from '~/store'

const isRequested = computed(() => {
  return !!MembersStore.members?.find((member) => member.userId === UserStore.currentUser.id)
})

const joinRequest = () => MembersStore.joinRequest(PlansStore.currentPlan!)
</script>
