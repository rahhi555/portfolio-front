<template>
  <material-card
    icon="mdi-map-legend"
    icon-small
    color="accent"
    title="計画一覧"
  >
    <v-card-text>
      <PlansCreateModal
        :name.sync="planParams.name"
        :published.sync="planParams.published"
        @create-handle="createPlan"
      />

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
        :loading="loading"
      >
        <template #[`item.actions`]="{ item }">
          <PlansTableButton
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
  reactive,
  ref,
  computed,
  inject,
  watch,
  useFetch
} from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import { UserStore, PlansStore } from '~/store'
import { AppBarTabKey } from '~/types/injection-key'

export default defineComponent({
  layout: 'protected',

  setup() {
    useFetch(async () => {
      await PlansStore.indexPlans()
    })

    const planParams = reactive({
      name: '',
      published: false,
    })

    const createPlan = () => {
      const { name, published } = planParams
      PlansStore.createPlan({ name, published })
    }

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

    const appBarTab = inject(AppBarTabKey)
    watch(appBarTab!.value, () => {
      const selectTab = appBarTab!.value.find(tab => tab.selected)
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
      planParams,
      createPlan,
      deletePlan,
      loading: computed(() => { return !PlansStore.plans }),
    }
  },
})
</script>
