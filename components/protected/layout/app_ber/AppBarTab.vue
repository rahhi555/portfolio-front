<template>
  <v-tabs :value="activeTab" align-with-title>
    <v-tab
      v-for="(tab, index) in appBarTab"
      :key="index"
      @click="clickTab(tab)"
    >
      {{ tab.name }}
    </v-tab>

    <v-btn
      v-if="!!appBarTab && !!appBarFunc"
      absolute
      right
      height="35"
      min-width="130"
      color="secondary"
      class="my-2"
      @click="appBarFunc.func"
      >{{ appBarFunc.name }}</v-btn
    >
  </v-tabs>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  useRouter,
  computed,
} from '@nuxtjs/composition-api'
import { AppBarTab } from 'interface'
import { AppBarTabKey, AppBarFuncKey } from '~/types/injection-key'
import { getPear } from '~/utils/ui/app-bar-tab-routes'

export default defineComponent({
  setup() {
    const router = useRouter()

    const appBarTab = inject(AppBarTabKey)
    appBarTab!.value = getPear()

    const activeTab = computed(() => {
      return appBarTab?.value?.findIndex((tab) => tab.selected)
    })

    const clickTab = (tab: AppBarTab) => {
      if (tab.selected !== undefined) {
        for (const t of appBarTab!.value) {
          t.name === tab.name ? (t.selected = true) : (t.selected = false)
        }
      }
      if (tab.link) router.push(tab.link)
    }

    const appBarFunc = inject(AppBarFuncKey)

    router.afterEach(() => {
      appBarTab!.value = getPear()
      appBarFunc!.value = null
    })

    return {
      appBarTab,
      clickTab,
      appBarFunc,
      activeTab,
    }
  },
})
</script>
