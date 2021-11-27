<template>
  <v-simple-table>
    <template #default>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.name"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { MapsStore, MembersStore, PlansStore, TodoListsStore } from '~/store'

export default defineComponent({
  setup(){
    // 認証済みメンバーの人数。作成者本人は必ず認証済みなので、undefinedは代入されない
    const asseptedMemberCount = computed(() => MembersStore.members?.filter(member => member.accept).length!)

    const items = ref<{ name: string, value: string | number }[]>([
      { name: '作成者', value: PlansStore.currentPlan!.author },
      { name: '作成日時', value: PlansStore.currentPlan!.createdAt },
      { name: '更新日時', value: PlansStore.currentPlan!.updatedAt },
      { name: '人数', value: `認証済み: ${asseptedMemberCount.value} 未認証:${MembersStore.members!.length - asseptedMemberCount.value} 計:${MembersStore.members?.length}`},
      { name: 'マップ数', value: MapsStore.maps.length },
      { name: 'Todoリスト数', value: TodoListsStore.todoList.length },
      { name: 'Todo数', value: TodoListsStore.todoList.reduce((result, todoList) => { 
        if(!todoList.todos) return result
        return result + todoList.todos.length 
      }, 0) }
    ])

    return {
      items
    }
  }
})
</script>