import { Plan, Member, TodoList, Todo } from 'interface'
import { PlansStore, MembersStore, UserStore, TodoListsStore } from '~/store'

/** 実用のidと重複するのを避けるため値の大きい定数を用意 */
const BIG_NUMBER_ID = 999_999_999

export const tutorialPlanCreate = () => {
  const memberSelf: Member = {
    id: BIG_NUMBER_ID,
    accept: true,
    planId: BIG_NUMBER_ID,
    userId: UserStore.currentUser.id,
    userName: UserStore.currentUser.name,
  }

  const plan: Plan = {
    id: BIG_NUMBER_ID,
    name: 'はじめての計画',
    members: [memberSelf],
    active: false,
    author: UserStore.currentUser.name,
    published: true,
    userId: UserStore.currentUser.id,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString()
  }
  PlansStore.addPlansMutation(plan)
  PlansStore.setCurrentPlanMutation(plan)
  MembersStore.setMembersMutation([memberSelf])
}

export const tutorialTodoListCreate = () => {
  const todoList: TodoList = {
    id: BIG_NUMBER_ID,
    planId: BIG_NUMBER_ID,
    title: 'はじめてのtodoリスト',
    todos: []
  }
  TodoListsStore.addTodoListsMutation(todoList)
}

export const tutorialTodoCreate = () => {
  const todo: Todo = {
    id: BIG_NUMBER_ID,
    title: 'はじめてのtodo',
    todoListId: BIG_NUMBER_ID,
  }
  TodoListsStore.addTodoMutation(todo)
}