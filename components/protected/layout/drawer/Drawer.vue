<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    app
    dark
    disable-resize-watcher
  >
    <div>
      <drawer-header />

      <v-divider class="mx-3" />

      <account-settings />

      <v-divider class="mx-3 mb-2" />

      <v-list>
        <v-list-item
          v-for="(item, i) in visibleItems"
          :key="i"
          :to="item.to"
          @click="item.click"
          router
          exact
        >
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

<script lang="ts">
import { defineComponent, inject, computed, ref, useContext } from '@nuxtjs/composition-api'
import DrawerHeader from './DrawerHeader.vue'
import AccountSettings from './DrawerAccountSettings.vue'
import { AccountDialogKey ,DrawerKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    DrawerHeader,
    AccountSettings,
  },

  setup() {
    const { $auth } = useContext()

    const accountDialog = inject(AccountDialogKey)

    const items = ref([
      {
        icon: 'mdi-home',
        title: '計画一覧',
        to: '/dashboard/plans',
        visible: true,
        click: () => {}
      },
      {
        icon: 'mdi-account',
        title: 'プロフィール',
        to: '',
        click: () => { 
          if(!accountDialog) return
          accountDialog.value = true 
        },
        visible: true,
      },
      {
        icon: 'mdi-logout',
        title: 'ログアウト',
        to: '',
        visible: true,
        click: () => { $auth.logout() }
      },
    ])

    const visibleItems = computed(() => {
      return items.value.filter((item) => {
        return item.visible
      })
    })

    const drawer = inject(DrawerKey)

    return {
      visibleItems,
      drawer,
      items
    }
  },
})
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