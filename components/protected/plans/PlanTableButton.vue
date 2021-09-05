<template>
  <span>
    <app-btn
      v-if="item.published"
      color="success"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="editPlan(item)"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-eye-outline'" />
        </template>
        <span>公開</span>
      </v-tooltip>
    </app-btn>
    <app-btn
      v-else
      color="error"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-eye-off-outline'" />
        </template>
        <span>非公開</span>
      </v-tooltip>
    </app-btn>

    <app-btn
      v-if="!isMyPlan(item)"
      color="success"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="joinRequest(item)"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-import'" />
        </template>
        <span>参加リクエスト</span>
      </v-tooltip>
    </app-btn>    

    <app-btn
      v-if="isMyPlan(item)"
      color="error"
      class="px-2 ml-1"
      elevation="0"
      min-width="0"
      small
      text
      @click="$emit('delete-handle')"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-text="'mdi-delete-outline'" />
        </template>
        <span>削除</span>
      </v-tooltip>
    </app-btn>
  </span>
</template>

<script lang="ts">
import { defineComponent, useRouter, useContext } from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import { UserStore, SnackbarStore } from '~/store'

export default defineComponent({
  props: {
    item: Object,
  },

  setup() {
    const router = useRouter()
    const { $axios } = useContext()

    const currentUserId = UserStore.currentUser.id

    const isMyPlan = (item: Plan) => {
      return item.userId === currentUserId
    }

    const editPlan = (item: Plan) => {
      router.push(`/dashboard/plans/${item.id}`)
    }

    const joinRequest = (item: Plan) => {
      if(!confirm('参加リクエストを送信してよろしいですか？')) {
        alert('参加リクエストをキャンセルしました')
        return
      }

      const member = { user_id: currentUserId, accept: false }

      $axios
        .$post(`/api/v1/plans/${item.id}/members`, { member })
        .catch(() => SnackbarStore.catchError())
        .finally(() => SnackbarStore.CRUDvisible({ model: '参加リクエスト', crud: 'create' }))
    }

    return {
      isMyPlan,
      editPlan,
      joinRequest
    }
  },
})
</script>
