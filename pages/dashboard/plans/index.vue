<template>
  <material-card
    icon="mdi-map-legend"
    icon-small
    color="accent"
    title="計画一覧"
  >
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
        :sort-by="['name', 'office']"
        :sort-desc="[false, true]"
        multi-sort
      >
        <template #[`item.actions`]="{ item }">
          <PlansTableButtons
            :item="item"
            @delete-handle="deletePlan(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </material-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  useFetch
} from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import { UserStore, PlansStore } from '~/store'
import { appBarTab } from '~/utils/ui/app-bar-tab-routes'

export default defineComponent({
  layout: 'protected',

  setup() {
    useFetch(async () => {
      // チュートリアル対象者の場合データフェッチをしない
      if (UserStore.needTutorial) return
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
        text: 'Actions',
        value: 'actions',
      },
    ]

    const search = ref('')

    watch(appBarTab.value!, () => {
      const selectTab = appBarTab.value!.find(tab => tab.selected)
      
      if(selectTab?.name === '全計画') {
        search.value = ''
      } else if(selectTab?.name === 'マイ計画') {
        search.value = UserStore.currentUser.name
      }
    })

    return {
      headers,
      items: computed(() => { return PlansStore.plans }),
      search,
      deletePlan,
    }
  },
})
</script>
