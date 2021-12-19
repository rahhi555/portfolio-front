<template>
  <v-data-iterator
    :items="selectedTodoListTodosWithStatuses"
    item-key="id"
    style="background-color: white; max-height: 85vh"
    no-data-text="　Todoがありません"
    class="overflow-y-auto overflow-x-hidden"
  >
    <template #header>
      <v-toolbar class="mb-2" color="primary" dark dense>
        <v-toolbar-title>{{ todoListTitle }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
          v-show="todoListTitle !== 'Not Selected' && isTodoListEditPage"
          icon
          outlined
          data-tutorial='create-todo-btn'
          @click="createDialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <TodosCreateModal
          :dialog="createDialog"
          @closeDialogHandle="createDialog = false"
        />
      </v-toolbar>
    </template>

    <template #default="{ items }">
      <v-row justify="center" justify-sm="start">
        <v-col
          v-for="item in items"
          :key="item.name"
          :cols="cols.cols"
          :sm="cols.sm"
          :md="cols.md"
          :lg="cols.lg"
        >
          <v-card>
            <v-list-group
              :value="isTodoListEditPage"
              append-icon=""
              :disabled="isTodoListEditPage"
              data-tutorial="check-todo"
            >
              <template #activator>
                <v-list-item-title class="todo-text-space">{{
                  item.title
                }}</v-list-item-title>

                <v-spacer />

                <v-icon
                  v-if="isTodoListEditPage"
                  size="20"
                  @click="deleteTodo(item)"
                  >mdi-delete</v-icon
                >
                <v-icon
                  v-if="isPlanActive && !isTodoListEditPage"
                  size="20"
                  :class="{ done: item.status === 'done' }"
                  @click.stop="toggleStatusTodo(item)"
                  >mdi-checkbox-marked</v-icon
                >
              </template>

              <v-list-item v-for="(value, key) in todoContents" :key="key">
                <v-col cols="3" class="pa-0">
                  <v-list-item-content class="text-body-2 todo-text-space"
                    ><span>{{ value }}:</span></v-list-item-content
                  >
                </v-col>
                <v-col cols="9" class="py-0">
                  <v-list-item-content class="text-body-2">
                    <span class="todo-text-space">{{ item[key] }}</span>
                  </v-list-item-content>
                </v-col>
              </v-list-item>

              <v-divider class="mb-2" />

              <v-row no-gutters>
                <v-col v-for="(image, i) in item.images" :key="i" cols="3">
                  <v-img
                    tile
                    :src="image"
                    height="40"
                    @click="imageShow(item.id)"
                  />
                </v-col>
              </v-row>
            </v-list-group>
          </v-card>
        </v-col>
      </v-row>

      <TodosImageCarousel
        :image-dialog="imageDialog"
        :images="selectImages"
        @imageClose="imageDialog = false"
      />
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  computed,
  useRoute,
  watch
} from '@nuxtjs/composition-api'
import { Rect, Todo, TodoStatus } from 'interface'
import {
  PlansStore,
  TodoListsStore,
  TodoStatusesStore,
  SvgsStore,
} from '~/store'

type TodoMargeStatus = Todo & TodoStatus

export default defineComponent({
  props: {
    cols: {
      type: Object,
      default: () => ({
        cols: 9,
        sm: 6,
        md: 4,
        lg: 4,
      }),
    },
  },

  setup() {
    const { $axios, app, $planChannelPeformMethods, $tutorial } = useContext()
    const route = useRoute()

    /** Todoリストページ判定 */
    const isTodoListEditPage = computed(() => {
      return route.value.name === 'dashboard-plans-id-todo-list'
    })

    const imageDialog = ref(false)
    const selectImages = ref<string[]>([])
    /** 画像サムネイルをクリックしたら大きいサイズの画像を取得し表示する */
    const imageShow = async (todoId: number) => {
      app.loading = true
      selectImages.value = await $axios.$get(
        `/api/v1/todos/${todoId}?column=images`
      )
      app.loading = false
      imageDialog.value = true
    }

    /** todo作成時のフォーム表示フラグ(TODOリスト編集ページ限定) */
    const createDialog = ref(false)

    /** todo削除(TODOリスト編集ページ限定) */
    const deleteTodo = (todo: Todo) => {
      TodoListsStore.deleteTodo(todo)
    }

    /** 最後に選択したtargetSvgのid */
    const selectedSvg = ref<Rect>() 
    /** リアクティブじゃない値は監視できないためcomputedに入れる */
    const targetSvg = computed(() => {
      return SvgsStore.targetSvg
    })
    watch(targetSvg, (newValue, _) => {
      if(!newValue) return
      selectedSvg.value = newValue
    })

    /** 選択しているTodoリスト内のtodo(マップ閲覧ページの場合はstatusをマージする) */
    const selectedTodoListTodosWithStatuses = computed(() => {
      const selectedTodoListTodos = TodoListsStore.selectedTodos
      // マップ編集ページまたは計画がアクティブでなければTodoリストに紐付いたTodosをそのまま返す
      if(isTodoListEditPage.value || !PlansStore.currentPlan?.active) return selectedTodoListTodos
      
      // マップ閲覧ページならステータスをマージして返す
      const svgId = selectedSvg.value?.id
      if(!svgId) return
      // ディープコピーしないと後のキー代入とキー削除で元のStateに影響する
      const todoStatuses = TodoStatusesStore.getTodoStatusesBySvgId(svgId).map(todoStatus => ({...todoStatus}))
      const pairTodoStatuses = todoStatuses.map(todoStatus => {
        const targetTodo = selectedTodoListTodos?.find(todo => todo.id === todoStatus.todoId)
        // todoにマージする際にidキーが重複するため、todoStatusIdに代入し、idをdeleteする
        todoStatus.todoStatusId = todoStatus.id
        delete todoStatus.id
        return { ...targetTodo, ...todoStatus }
      })
      return pairTodoStatuses
    })

    /** todoStatusを変更する(マップ閲覧ページ限定) */
    const toggleStatusTodo = (todo: TodoMargeStatus) => {
      if(!todo.todoStatusId || $tutorial.isRunningTutorial.value) return

      // eslint-disable-next-line prefer-const
      let { todoStatusId, status }  = todo
      status = status === 'todo' ? 'done' : 'todo'
      $planChannelPeformMethods('changeTodoStatus', { id: todoStatusId, status })
    }

    return {
      todoContents: {
        body: '内容',
        beginTime: '開始時刻',
        endTime: '終了時刻',
      },
      imageDialog,
      selectImages,
      imageShow,
      deleteTodo,
      toggleStatusTodo,
      createDialog,
      selectedTodoListTodosWithStatuses,
      isTodoListEditPage,
    }
  },

  computed: {
    todoListTitle() {
      let title = 'Not Selected'
      const index = TodoListsStore.selectedTodoListIndex
      if (Number.isInteger(index)) {
        // @ts-ignore
        title = TodoListsStore.todoLists[index].title
      }
      return title
    },
    isPlanActive() {
      return PlansStore.currentPlan?.active
    },
  },
})
</script>

<style scoped lang="sass">
.v-card__title
  padding: 5px 16px
.v-list-item
  min-height: 30px
.done
  color: #66BB6A
.todo-text-space
  white-space: normal
  height: 100%
  width: 100%
</style>
