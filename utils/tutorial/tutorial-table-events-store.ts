import { Plan, Member, TodoList, Todo, Map, Rect, TodoStatus } from 'interface'
import { PlansStore, MembersStore, UserStore, TodoListsStore, MapsStore, SvgsStore, TodoStatusesStore } from '~/store'

/** 実用のidと重複するのを避けるため値の大きい定数を用意 */
export const MAIN_BIG_NUMBER = 999_999_999

/** ダミーユーザーの定数 */
const ANOTHER_BIG_NUMBER = MAIN_BIG_NUMBER - 1

export const createPlanInTutorial = () => {
  const memberSelf: Member = {
    id: MAIN_BIG_NUMBER,
    accept: true,
    planId: MAIN_BIG_NUMBER,
    userId: UserStore.currentUser.id,
    userName: UserStore.currentUser.name,
  }

  const plan: Plan = {
    id: MAIN_BIG_NUMBER,
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
    id: MAIN_BIG_NUMBER,
    planId: MAIN_BIG_NUMBER,
    title: 'はじめてのtodoリスト',
    todos: []
  }
  TodoListsStore.addTodoListsMutation(todoList)
  return true
}

export const createTodoInTutorial = () => {
  const todo: Todo = {
    id: MAIN_BIG_NUMBER,
    title: 'はじめてのtodo',
    todoListId: MAIN_BIG_NUMBER,
  }
  TodoListsStore.addTodoMutation(todo)
  return true
}

export const createMapInTutorial = () => {
  const map: Map = {
    id: MAIN_BIG_NUMBER,
    name: 'はじめてのマップ',
    planId: MAIN_BIG_NUMBER,
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
  const bounds: google.maps.LatLngBoundsLiteral = {south: 35.632466399015655, west: 139.8795128269325, north: 35.63332639867112, east: 139.8812757730675}
  const address = '千葉県浦安市舞浜１−１'
  const googleMap = document.getElementById('google-map') as HTMLDivElement
  const { width, height } = googleMap.getBoundingClientRect()
  const map: Map = {
    id: MAIN_BIG_NUMBER,
    name: 'はじめてのマップ',
    planId: MAIN_BIG_NUMBER,
    isGoogleMap: true,
    address,
    bounds,
    heading: 0,
    height,
    width
  }
  MapsStore.updateMapMutation(map)
  window.$nuxt.context.$googleMap.isGoogleMapEditMode.value = false
  return true
}

/** 図形ドラッグの目標とする赤枠 */
let targetArea: google.maps.Rectangle

export const addRectInTutorial = () => {
  const rect: Rect = {
    id: MAIN_BIG_NUMBER,
    type: 'Rect',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    name: 'new Rect',
    planId: MAIN_BIG_NUMBER,
    displayOrder: MAIN_BIG_NUMBER,
    mapId: MAIN_BIG_NUMBER,
    userId: MAIN_BIG_NUMBER,
    stroke: 'black',
    todoListId: undefined
  }
  // @ts-ignore
  SvgsStore.addSvgMutation(rect)

  const map = window.$nuxt.context.$googleMap.map.value
  const bounds: google.maps.LatLngBoundsLiteral = { east: 139.88051367631232, north: 35.63299956116157, south: 35.63283306298099, west: 139.88026523671178 }

  targetArea = new google.maps.Rectangle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map,
    bounds,
  });
  
  return true
}

export const removeTargetArea = () => {
  targetArea.setMap(null)
}

export const attachTodoListInTutorial = () => {
  if(!SvgsStore.targetSvg) return false

  const rect = {
    id: MAIN_BIG_NUMBER,
    fill: "#cccccc",
    todoListId: MAIN_BIG_NUMBER
  }
  // @ts-ignore
  SvgsStore.attachTodoListMutation(rect)
  SvgsStore.setTargetId(0)
  return true
}

export const addMemberInTutorial = () => {
  const member: Member = {
    id: ANOTHER_BIG_NUMBER,
    planId: MAIN_BIG_NUMBER,
    accept: false,
    userId: MAIN_BIG_NUMBER,
    userName: 'ダミー 太郎',
    avatar: 'https://avatars.dicebear.com/v2/male/ac9b51662d7d3d0c0ff1baacde9994e8.svg'
  }

  PlansStore.addMember({ id: MAIN_BIG_NUMBER, member })
  MembersStore.addMembersMutation(member)
}

export const acceptMemberInTutorial = () => {
  const member = {...MembersStore.members?.find(member => member.id === ANOTHER_BIG_NUMBER)} as Member
  member.accept = true
  MembersStore.updateMemberMutation(member)
  return true
}

export const activatePlanInTutorial = () => {
  const todoStatuses: TodoStatus = {
    id: MAIN_BIG_NUMBER,
    status: 'todo',
    svgId: MAIN_BIG_NUMBER,
    todoId: MAIN_BIG_NUMBER,
    todoStatusId: MAIN_BIG_NUMBER
  }

  PlansStore.activatePlan()
  TodoStatusesStore.initTodoStatuses([todoStatuses])
  return true
}

export const chackTodoInTutorial = () => {
  TodoStatusesStore.changeTodoStatus({ id: MAIN_BIG_NUMBER, status: 'done'})
  return true
}

export const inactivatePlanInTutorial = () => {
  PlansStore.inactivatePlan()
  TodoStatusesStore.clearTodoStatuses()
  return true
}
