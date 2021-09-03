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
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { Plan } from 'interface'
import { UserStore } from '~/store'

export default defineComponent({
  props: {
    item: Object,
  },

  setup() {
    const router = useRouter()

    const currentUserId = UserStore.currentUser.id

    const isMyPlan = (item: Plan) => {
      return item.userId === currentUserId
    }

    const editPlan = (item: Plan) => {
      router.push(`/dashboard/plans/${item.id}`)
    }

    return {
      isMyPlan,
      editPlan,
    }
  },
})
</script>
