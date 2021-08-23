<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="miniVariant"
    fixed
    app
    dark
    :src="require('~/assets/login_gray.png')"
    mini-variant-width="80"
  >
    <div>
      <drawer-header />

      <v-divider class="mx-3" />

      <account-settings />

      <v-divider class="mx-3 mb-2" />

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
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
import { defineComponent, inject } from '@nuxtjs/composition-api'
import DrawerHeader from './DrawerHeader.vue'
import AccountSettings from './DrawerAccountSettings.vue'
import { DrawerKey, MiniVariantKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    DrawerHeader,
    AccountSettings
  },

  setup() {
    const items = [
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/dashboard',
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'Inspire',
        to: '/dashboard/inspire',
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'Credential',
        to: '/dashboard/credential',
      },
    ]

    const miniVariant = inject(MiniVariantKey)
    const drawer = inject(DrawerKey)

    return {
      items,
      miniVariant,
      drawer
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
