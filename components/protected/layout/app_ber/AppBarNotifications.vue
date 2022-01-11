<template>
  <v-menu :disabled="!notifications.length" bottom left offset-y origin="top right" transition="scale-transition">
    <template #activator="{ attrs, on }">
      <!-- client-onlyにしないとSSR時の値で計算されてしまいバッジが表示されない -->
      <client-only>
        <v-btn v-show="$device.isDesktop" data-tutorial="add-member" class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-badge bordered color="red" overlap :content="notifications.length" :value="notifications.length">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </client-only>
    </template>

    <v-list flat nav>
      <app-bar-item v-for="(n, i) in notifications" :key="i" link>
        <v-list-item-content @click="pushLink(n.link)">
          <v-list-item-title
            >計画 <strong>{{ n.title }}</strong> でメンバー申請があります</v-list-item-title
          >
        </v-list-item-content>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { PlansStore } from '~/store'

const notifications = computed(() => {
  return PlansStore.notifications
})

const router = useRouter()
const pushLink = (link: string) => {
  router.push(link)
}
</script>
