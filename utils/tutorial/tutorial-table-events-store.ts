import { Plan, Member, TodoList, Todo, Map } from 'interface'
import { PlansStore, MembersStore, UserStore, TodoListsStore, MapsStore } from '~/store'

/** 実用のidと重複するのを避けるため値の大きい定数を用意 */
const BIG_NUMBER_ID = 999_999_999

export const createPlanInTutorial = () => {
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
  return true
}

export const createTodoListInTutorial = () => {
  const todoList: TodoList = {
    id: BIG_NUMBER_ID,
    planId: BIG_NUMBER_ID,
    title: 'はじめてのtodoリスト',
    todos: []
  }
  TodoListsStore.addTodoListsMutation(todoList)
  return true
}

export const createTodoInTutorial = () => {
  const todo: Todo = {
    id: BIG_NUMBER_ID,
    title: 'はじめてのtodo',
    todoListId: BIG_NUMBER_ID,
  }
  TodoListsStore.addTodoMutation(todo)
  return true
}

export const createMapInTutorial = () => {
  const map: Map = {
    id: BIG_NUMBER_ID,
    name: 'はじめてのマップ',
    planId: BIG_NUMBER_ID,
    isGoogleMap: true,
    address: undefined,
    bounds: undefined,
    heading: undefined,
    height: undefined,
    width: undefined
  }
  MapsStore.addMapMutation(map)
  return true
}

export const updatePositionInTutorial = () => {
  const bounds: google.maps.LatLngBoundsLiteral = {south: 35.63186355769402, west: 139.878816933962, north: 35.63392922896041, east: 139.88197166603794}
  const address = '千葉県浦安市舞浜１−１'
  const googleMap = document.getElementById('google-map') as HTMLDivElement
  const { width, height } = googleMap.getBoundingClientRect()
  const map: Map = {
    id: BIG_NUMBER_ID,
    name: 'はじめてのマップ',
    planId: BIG_NUMBER_ID,
    isGoogleMap: true,
    address,
    bounds,
    heading: 0,
    height,
    width
  }
  MapsStore.updateMapMutation(map)
  return true
}