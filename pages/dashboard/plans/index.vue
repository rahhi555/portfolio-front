<template>
  <material-card
    icon="mdi-map-legend"
    icon-small
    color="accent"
    title="計画一覧"
  >
    <v-card-text>
      <plan-create-modal
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
          <plan-table-button
            :item="item"
            @delete-handle="deletePlan(item)"
          ></plan-table-button>
        </template>
      </v-data-table>
    </v-card-text>
  </material-card>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  useAsync,
  ref,
  computed,
  inject,
  watch
} from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import PlanCreateModal from '~/components/protected/plans/PlanCreateModal.vue'
import PlanTableButton from '~/components/protected/plans/PlanTableButton.vue'
import { SnackbarStore, UserStore } from '~/store'
import { Payload } from '~/store/snackbar'
import { AppBarTabKey } from '~/types/injection-key'

export default defineComponent({
  components: {
    PlanCreateModal,
    PlanTableButton,
  },

  layout: 'protected',

  setup() {
    const { $axios } = useContext()
    // 並び替え等で配列のメソッドが自動実行されるため、初期値で配列を入れておかないとエラーになる
    const items = ref<Plan[]>([])
    useAsync(() => {
      $axios.$get('/api/v1/plans').then((res: Plan[]) => {
        items.value = res
      })
    })

    const planParams = reactive({
      name: '',
      published: false,
    })

    let payload: Payload

    const createPlan = () => {
      window.$nuxt.$loading.start()
      $axios
        .$post('/api/v1/plans', { plan: planParams })
        .then((res: Plan) => {
          payload = { color: 'success', message: '計画を追加しました' }
          items.value.push(res)
        })
        .catch(() => {
          payload = { color: 'error', message: '計画の追加に失敗しました' }
        })
        .finally(() => {
          window.$nuxt.$loading.finish()
          SnackbarStore.visible(payload)
        })
    }

    const deletePlan = (item: Plan) => {
      if (!window.confirm('計画を削除してもよろしいですか？')) {
        window.alert('キャンセルしました')
        return
      }
      window.$nuxt.$loading.start()
      $axios
        .delete(`/api/v1/plans/${item.id}`)
        .then(() => {
          payload = { color: 'success', message: '計画の削除に成功しました' }
          items.value = items.value?.filter((i) => {
            return i.id !== item.id
          })
        })
        .catch(() => {
          payload = { color: 'error', message: '計画の削除に失敗しました' }
        })
        .finally(() => {
          window.$nuxt.$loading.finish()
          SnackbarStore.visible(payload)
        })
    }

    const headers = [
      {
        text: '名前',
        value: 'name',
      },
      {
        text: '参加人数',
        value: 'members_count',
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

    const loading = computed(() => {
      return !items.value.length
    })

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
      items,
      search,
      planParams,
      createPlan,
      deletePlan,
      loading,
    }
  },
})
</script>
