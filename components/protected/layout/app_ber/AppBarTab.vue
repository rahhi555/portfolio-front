<template>
  <v-tabs align-with-title>
    <v-tab v-for="(tab, index) in appBarTab" :key="index" @click="clickTab(tab)">
      {{ tab.name }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
  import { defineComponent, inject, useRouter } from '@nuxtjs/composition-api'
  import { AppBarTab } from 'interface'
  import { AppBarTabKey } from '~/types/injection-key'
  import { getPear } from '~/utils/app-bar-tab-routes'

  export default defineComponent({
    setup(){
      const router = useRouter()

      const appBarTab = inject(AppBarTabKey)
      appBarTab!.value = getPear()

      const clickTab = (tab: AppBarTab) => {
        if(tab.selected !== undefined) {
          for(const t of appBarTab!.value) {
            t.name === tab.name ? t.selected = true : t.selected = false
          }
        }
        if(tab.link) router.push(tab.link) 
      }

      router.afterEach(() => {
        appBarTab!.value = getPear()
      })

      return {
        appBarTab,
        clickTab
      }
    }
  })

</script>