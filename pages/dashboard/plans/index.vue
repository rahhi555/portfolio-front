<template>
  <v-container id="data-tables-view" fluid tag="section">
    <material-card
      icon="mdi-map-legend"
      icon-small
      color="accent"
      title="計画一覧"
    >
      <v-card-text>
        <plan-create-modal
          @input-handle="planParams.name = $event"
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
          <template #item.actions="{ item }">
            <app-btn
              v-for="(action, i) in actions"
              :key="i"
              :color="action.color"
              class="px-2 ml-1"
              elevation="0"
              min-width="0"
              small
              text
              @click="action.method(item)"
            >
              <v-icon v-text="action.icon" />
            </app-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </material-card>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  useAsync,
  ref,
  computed,
} from '@nuxtjs/composition-api'
import PlanCreateModal from '~/components/protected/plans/PlanCreateModal.vue'
import { SnackbarStore } from '~/store'
import { Payload } from '~/store/snackbar'

interface Member {
  id: number
  user: string
  role: string
}

interface Plan {
  id: number
  name: string
  member: Member
  author: string
  createdAt: Date
  updatedAt: Date
}

export default defineComponent({
  components: {
    PlanCreateModal,
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

    const search = undefined

    const loading = computed(() => {
      return !items.value.length
    })

    const actions = [
      { color: 'info', icon: 'mdi-heart', method: '' },
      { color: 'success', icon: 'mdi-monitor-dashboard', method: '' },
      { color: 'error', icon: 'mdi-close', method: deletePlan },
    ]

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

    return {
      actions,
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
