<template>
  <v-navigation-drawer v-model="drawer" fixed app dark disable-resize-watcher>
    <div>
      <drawer-header />

      <v-divider class="mx-3" />

      <account-settings />

      <v-divider class="mx-3 mb-2" />

      <v-list>
        <v-list-group v-if="notifications.length" prepend-icon="mdi-bell">
          <template v-if="notifications.length" #activator>
            <v-list-item-title class="white--text">通知</v-list-item-title>
          </template>

          <v-list-item
            v-for="(n, i) in notifications"
            :key="`child-${i}`"
            class="py-1"
            active-class="primary white--text"
            nuxt
            :to="n.link"
          >
            <v-list-item-content>
              <v-list-item-title class="ml-3"
                >メンバー申請: <strong>{{ n.title }}</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-for="(item, i) in visibleItems" :key="i" :to="item.to" router exact @click="item.click">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import DrawerHeader from './DrawerHeader.vue'
import AccountSettings from './DrawerAccountSettings.vue'
import { AccountDialogKey, DrawerKey } from '~/types/injection-key'
import { PlansStore } from '~/store'

const { $auth } = useContext()

const accountDialog = inject(AccountDialogKey)

const items = ref([
  {
    icon: 'mdi-home',
    title: '計画一覧',
    to: '/dashboard/plans',
    visible: true,
    click: () => {},
  },
  {
    icon: 'mdi-account',
    title: 'プロフィール',
    to: '',
    click: () => {
      if (!accountDialog) return
      accountDialog.value = true
    },
    visible: true,
  },
  {
    icon: 'mdi-logout',
    title: 'ログアウト',
    to: '',
    visible: true,
    click: () => {
      $auth.logout()
    },
  },
])

const notifications = computed(() => PlansStore.notifications)

const visibleItems = computed(() => {
  return items.value.filter((item) => {
    return item.visible
  })
})

const drawer = inject(DrawerKey)
</script>

<style scoped lang="sass">
#default-drawer
  .v-list-item
    margin-bottom: 8px

  .v-list-item::before,
  .v-list-item::after
    display: none

  .v-list-group__header__prepend-icon,
  .v-list-item__icon
    margin-top: 12px
    margin-bottom: 12px
    margin-left: 4px

  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important
</style>
