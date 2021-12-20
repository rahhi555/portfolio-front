<template>
  <material-card icon="mdi-map-legend" icon-small color="accent" title="計画一覧" class="px-7">
    <v-card-text>
      <PlansCreateModal />

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Search records"
        single-line
        style="max-width: 250px"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        :sort-by="['createdAt']"
        :sort-desc="[true, false]"
        multi-sort
      >
        <template #[`item.actions`]="{ item }">
          <!-- 大量の The client-side rendered virtual DOM tree is not matching server-rendered content... エラーが出現するためclient onlyにする -->
          <client-only>
            <PlansTableButtons :item="item" @delete-handle="deletePlan(item)" />
          </client-only>
        </template>
      </v-data-table>
    </v-card-text>
  </material-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, useFetch, useContext } from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import { UserStore, PlansStore } from '~/store'
import { appBarTab } from '~/utils/ui/app-bar-tab-routes'

export default defineComponent({
  layout: 'protected',

  setup() {
    const { $device } = useContext()

    useFetch(async () => {
      // チュートリアル対象者かつPCの場合データフェッチをしない
      if (UserStore.needTutorial && $device.isDesktop) return
      await PlansStore.indexPlans()
    })

    const deletePlan = (item: Plan) => {
      PlansStore.deletePlan(item)
    }

    const headers = [
      {
        text: '名前',
        value: 'name',
      },
      {
        text: '参加人数',
        value: 'members.length',
      },
      {
        text: '作成者',
        value: 'author',
      },
      {
        text: '作成日',
        value: 'createdAt',
      },
      {
        text: '更新日',
        value: 'updatedAt',
      },
      {
        sortable: false,
        text: '操作',
        value: 'actions',
      },
    ]

    const search = ref('')

    /** タブをマイ計画に切り替えると変数searchに自分の名前が代入される */
    watch(appBarTab, () => {
      if (!appBarTab.value) return
      const selectTab = appBarTab.value.find((tab) => tab.selected)

      if (selectTab?.name === '全計画') {
        search.value = ''
      } else if (selectTab?.name === 'マイ計画') {
        search.value = UserStore.currentUser.name
      }
    }, { deep: true })

    /**
     * useFetchを使用してreturnの値にcomputedを含ませるとバグにより 'Write operation failed: computed value is readonly.'
     * のようなエラーメッセージが表示される。これを回避するためセッターを定義する
     * https://github.com/nuxt-community/composition-api/issues/19
     *  */
    const items = computed({
      get: () => PlansStore.plans,
      set: () => {},
    })

    return {
      headers,
      items,
      search,
      deletePlan,
    }
  },
})
</script>