<template>
  <span>
    <app-btn
      v-if="item.published || isMyPlan(item)"
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
          <v-icon
            v-if="isMyPlan(item) && item.published"
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-eye'"
          />
          <v-icon
            v-else-if="isMyPlan(item) && !item.published"
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-eye-remove'"
          />
          <v-icon
            v-else-if="
              !isMyPlan(item) && myMember(item) && myMember(item).accept
            "
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-eye-check-outline'"
          />
          <v-icon v-else v-bind="attrs" v-on="on" v-text="'mdi-eye-outline'" />
        </template>
        <span v-if="isMyPlan(item) && item.published">マイ計画：公開</span>
        <span v-else-if="isMyPlan(item) && !item.published"
          >マイ計画：非公開</span
        >
        <span
          v-else-if="!isMyPlan(item) && myMember(item) && myMember(item).accept"
          >公開：承認済み</span
        >
        <span v-else>公開：未承認</span>
      </v-tooltip>
    </app-btn>

    <app-btn v-else class="px-2 ml-1" elevation="0" min-width="0" small text>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="myMember(item) && myMember(item).accept"
            color="success"
            v-bind="attrs"
            v-on="on"
            @click="editPlan(item)"
            v-text="'mdi-eye-remove-outline'"
          />
          <v-icon
            v-else
            color="error"
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-eye-remove-outline'"
          />
        </template>
        <span v-if="myMember(item) && myMember(item).accept"
          >非公開：承認済み</span
        >
        <span v-else>非公開：未承認</span>
      </v-tooltip>
    </app-btn>

    <app-btn class="px-2 ml-1" elevation="0" min-width="0" small text>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="!isMyPlan(item) && !myMember(item)"
            color="grey"
            v-bind="attrs"
            v-on="on"
            @click="joinRequest(item)"
            v-text="'mdi-import'"
          />
          <v-icon
            v-else-if="
              !isMyPlan(item) && myMember(item) && !myMember(item).accept
            "
            color="warning"
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-import'"
          />
          <v-icon
            v-else-if="
              !isMyPlan(item) && myMember(item) && myMember(item).accept
            "
            color="success"
            v-bind="attrs"
            v-on="on"
            v-text="'mdi-import'"
          />
          <v-icon
            v-else
            color="error"
            v-bind="attrs"
            v-on="on"
            @click="$emit('delete-handle')"
            v-text="'mdi-delete-outline'"
          />
        </template>
        <span v-if="!isMyPlan(item) && !myMember(item)">承認リクエスト</span>
        <span
          v-else-if="
            !isMyPlan(item) && myMember(item) && !myMember(item).accept
          "
          >承認待ち</span
        >
        <span
          v-else-if="!isMyPlan(item) && myMember(item) && myMember(item).accept"
          >承認済み</span
        >
        <span v-else>削除</span>
      </v-tooltip>
    </app-btn>
  </span>
</template>

<script lang="ts">
import { defineComponent, useRouter, useContext } from '@nuxtjs/composition-api'
import { Plan, Member } from 'interface'
import { UserStore, SnackbarStore, PlansStore } from '~/store'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: null,
    },
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
      if (!confirm('承認リクエストを送信してよろしいですか？')) {
        alert('承認リクエストをキャンセルしました')
        return
      }

      const member = { user_id: currentUserId, accept: false }

      $axios
        .$post(`/api/v1/plans/${item.id}/members`, { member })
        .then((member) => PlansStore.addMember({ id: item.id, member }))
        .catch(() => SnackbarStore.catchError())
        .finally(() =>
          SnackbarStore.CRUDvisible({ model: '承認リクエスト', crud: 'create' })
        )
    }

    const myMember = (item: Plan): Member | null => {
      const { members } = item
      return members.filter(
        (member) => member.userId === UserStore.currentUser.id
      )[0]
    }

    return {
      isMyPlan,
      editPlan,
      joinRequest,
      myMember,
    }
  },
})
</script>
