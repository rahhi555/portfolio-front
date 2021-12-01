<template>
  <v-simple-table class="mx-15 pa-3">
    <template #default>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.name"
        >
          <th class="home-th">{{ item.name }}</th>
          <td class="home-td">{{ item.value }}</td>
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
      { name: '計画名', value: PlansStore.currentPlan!.name },
      { name: '作成者', value: PlansStore.currentPlan!.author },
      { name: '公開設定', value: PlansStore.currentPlan!.published ? '公開' : '非公開' },
      { name: '作成日時', value: PlansStore.currentPlan!.createdAt },
      { name: '更新日時', value: PlansStore.currentPlan!.updatedAt },
      { name: '人数', value: `認証済み: ${asseptedMemberCount.value},  未認証:${MembersStore.members!.length - asseptedMemberCount.value},  計:${MembersStore.members?.length}`},
      { name: 'マップ数', value: MapsStore.maps.length },
      { name: 'Todoリスト数', value: TodoListsStore.todoLists.length },
      { name: 'Todo数', value: TodoListsStore.todoLists.reduce((result, todoList) => { 
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

<style scoped lang="sass">
.home-th
  position: relative
  text-align: left
  width: 30%
  background-color: #eee
  text-align: center
  padding: 10px 0

.home-th:after
  display: block
  content: ""
  width: 0px
  height: 0px
  position: absolute
  top: calc(50% - 10px)
  right:-10px
  border-left: 10px solid #eee
  border-top: 10px solid transparent
  border-bottom: 10px solid transparent

.home-td
  text-align: left
  width: 70%
  text-align: center
  padding: 10px 0

</style>