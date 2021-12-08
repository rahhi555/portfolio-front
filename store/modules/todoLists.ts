import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Todo, TodoList } from 'interface'
import { $axios } from '~/utils/axios-accessor'
import { PlansStore } from '~/store'
import { SnackbarStore } from '~/utils/store-accessor'

const MODEL = 'Todoリスト'

type TodoParams = {[K in keyof Todo]?: Todo[K]}

@Module({
  name: 'modules/todoLists',
  stateFactory: true,
  namespaced: true,
})
export default class TodoLists extends VuexModule {
  // ----------- Todoリストの操作 ---------------
  private todoListsState: TodoList[] = []

  // 選択中のTodoリストのindex
  private selectedTodoListIndexState: null | number = null

  public get todoLists(): TodoList[] {
    return this.todoListsState
  }

  public get selectedTodoListIndex(): number | null {
    return this.selectedTodoListIndexState
  }

  @Mutation
  public setSelectedTodoListIndex(index: number | null) {
    this.selectedTodoListIndexState = index
  }

  @Mutation
  private setTodoListsMutation(todoLists: TodoList[]) {
    this.todoListsState = todoLists
  }

  @Mutation
  private addTodoListsMutation(todoList: TodoList) {
    this.todoListsState.push(todoList)
  }

  @Mutation
  private updateTodoListsMutation(todoList: TodoList) {
    const index = this.todoListsState.findIndex((t) => t.id === todoList.id)
    this.todoListsState.splice(index, 1, todoList)
  }

  @Mutation
  private deleteTodoListsMutation(id: number) {
    const index = this.todoListsState.findIndex((t) => t.id === id)
    this.todoListsState.splice(index, 1)
  }

  @Action
  public async indexTodoLists(planId: string) {
    await $axios
      .$get(`/api/v1/plans/${planId}/todo_lists`)
      .then((res) => this.setTodoListsMutation(res))
  }

  @Action
  public async createTodoList(title: string) {
    const todoList = { title }
    await $axios
      .$post(`/api/v1/plans/${PlansStore.currentPlan?.id}/todo_lists`, {
        todoList,
      })
      .then((res) => this.addTodoListsMutation(res))
      .catch(() => SnackbarStore.catchError())
      .finally(() =>
        SnackbarStore.CRUDvisible({ model: MODEL, crud: 'create' })
      )
  }

  @Action
  public async updateTodoList({ id, title }: { id: number; title: string }) {
    const todoList = { title }
    await $axios
      .$patch(`/api/v1/todo_lists/${id}`, { todoList })
      .then((res) => {
        this.updateTodoListsMutation(res)
        SnackbarStore.miniSnackbarVisible('Update Success')
      })
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'Todoリストの更新に失敗しました',
        })
      )
  }

  @Action
  public async deleteTodoList(id: number) {
    await $axios
      .$delete(`/api/v1/todo_lists/${id}`)
      .then(() => {
        this.setSelectedTodoListIndex(null)
        this.deleteTodoListsMutation(id)
        SnackbarStore.miniSnackbarVisible('Delete Success')
      })
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'Todoリストの削除に失敗しました',
        })
      )
  }

  // ----------- Todoの操作 ---------------
  // 選択中のtodos
  public get selectedTodos() {
    const index = this.selectedTodoListIndexState
    if (!Number.isInteger(index)) return
    return this.todoListsState[index!].todos
  }

  @Mutation
  private addTodoMutation(todo: Todo) {
    const target = this.todoListsState[this.selectedTodoListIndexState!]
    target?.todos?.push(todo)
  }

  @Mutation
  private deleteTodoMutation(todo: Todo) {
    const todoList = this.todoListsState.find(
      (todoList) => todoList.id === todo.todoListId
    )
    const index = todoList!.todos?.findIndex((t) => t.id === todo.id)
    todoList?.todos?.splice(index!, 1)
  }

  @Action
  public async createTodo(todo: TodoParams) {
    if (!Number.isInteger(this.selectedTodoListIndexState)) return

    const formData = new FormData()
    for (const key in todo) {
      if (key === 'images') continue
      formData.append(`todo[${key}]`, todo[key])
    }

    if (todo.images && todo.images.length) {
      for (const image of todo.images) {
        formData.append('todo[images][]', image)
      }
    }

    const todoListId = this.todoListsState[this.selectedTodoListIndexState!].id

    await $axios
      .$post(`/api/v1/todo_lists/${todoListId}/todos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        this.addTodoMutation(res)
        SnackbarStore.miniSnackbarVisible('Added Todo')
      })
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'Todoの追加に失敗しました',
        })
      )
  }

  @Action
  public async deleteTodo(todo: Todo) {
    await $axios
      .$delete(`/api/v1/todos/${todo.id}`)
      .then(() => {
        this.deleteTodoMutation(todo)
        SnackbarStore.miniSnackbarVisible('Deleted Todo')
      })
      .catch(() =>
        SnackbarStore.visible({
          color: 'error',
          message: 'Todoの削除に失敗しました',
        })
      )
  }
}
