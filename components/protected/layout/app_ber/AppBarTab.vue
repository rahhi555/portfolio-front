<template>
  <v-tabs :value="activeTab" :align-with-title="$vuetify.breakpoint.smAndUp" class="v-tabs">
    <v-tab
      v-for="(tab, index) in appBarTab"
      :id="'app-bar-tab-' + index"
      :key="index"
      v-tutorial="index"
      @click="clickTab(tab)"
    >
      <span :class="{'plan-active' : isPlanActive}">{{ tab.name }}</span>
    </v-tab>

    <v-btn
      v-if="!!appBarTab && !!appBarFunc"
      id='app-bar-btn'
      data-tutorial="create-todo-list-app-bar-btn create-map-app-bar-btn"
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
import common from '~/utils/ui/common'

export default defineComponent({
  directives: {
    /** 
     * タブにdata-tutorialを付与する。v-bindとメソッドを組み合わせるとタブ切り替えのたびに10回程度発火するが、    
     * カスタムディレクティブならマウント以外で発火しないのでこちらを採用する
     * */
    tutorial: {
      bind(el, bind) {
        const todoListKeys = ['show-todo-list']
        const mapKeys = ['show-edit-map']

        switch(bind.value) {
          case 2:
            el.dataset.tutorial = todoListKeys.join(' ')
            break
          case 3:
            el.dataset.tutorial = mapKeys.join(' ')
            break
          default:
            el.dataset.tutorial = 'none'
            break
        }
      }
    }
  },

  setup() {
    const router = useRouter()

    setPear()

    const activeTab = computed(() => {
      return appBarTab?.value?.findIndex((tab) => tab.selected)
    })

    const clickTab = (tab: AppBarTab) => {
      if (tab.selected !== undefined) {
        for (const t of appBarTab.value!) {
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
      activeTab,
      isPlanActive: common.isPlanActive,
    }
  },
})
</script>

<style scoped lang="sass">
  .plan-active
    font-weight: 600
</style>