<template>
  <v-tabs :value="activeTab" :align-with-title="$vuetify.breakpoint.smAndUp" class="v-tabs">
    <v-tab
      v-for="(tab, index) in appBarTab"
      :key="index"
      @click="clickTab(tab)"
    >
      {{ tab.name }}
    </v-tab>

    <v-btn
      v-if="!!appBarTab && !!appBarFunc"
      height="35"
      color="secondary"
      class="mt-2"
      :absolute="!$nuxt.context.$vuetify.breakpoint.xs"
      :right="!$nuxt.context.$vuetify.breakpoint.xs"
      min-width="130"
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
import { AppBarFuncKey } from '~/types/injection-key'
import { setPear, appBarTab } from '~/utils/ui/app-bar-tab-routes'

export default defineComponent({
  setup() {
    const router = useRouter()

    setPear()

    const activeTab = computed(() => {
      return appBarTab?.value?.findIndex((tab) => tab.selected)
    })

    const clickTab = (tab: AppBarTab) => {
      if (tab.selected !== undefined) {
        for (const t of appBarTab.value!) {
          // @ts-ignore
          t.name === tab.name ? (t.selected = true) : (t.selected = false)
        }
      }
      if (tab.link) router.push(tab.link)
    }

    const appBarFunc = inject(AppBarFuncKey)

    router.afterEach(() => {
      setPear()
      appBarFunc!.value = null
    })

    return {
      appBarTab,
      clickTab,
      appBarFunc,
      activeTab
    }
  },
})
</script>
