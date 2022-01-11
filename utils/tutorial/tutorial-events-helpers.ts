/** 
 * @fileoverview tutorial-eventsに提供するヘルパーを集約しているファイル。主にvuexのスタブメソッドとしての役割。
 */

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
    name: '日比谷公園ボランティア',
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
    title: 'レストラン周辺',
    todos: []
  }
  TodoListsStore.addTodoListsMutation(todoList)
  return true
}

export const createTodoInTutorial = () => {
  const todo: Todo = {
    id: MAIN_BIG_NUMBER,
    title: 'ゴミ拾い',
    todoListId: MAIN_BIG_NUMBER,
  }
  TodoListsStore.addTodoMutation(todo)
  return true
}

export const createMapInTutorial = () => {
  const map: Map = {
    id: MAIN_BIG_NUMBER,
    name: '日比谷公園',
    planId: MAIN_BIG_NUMBER,
    isGoogleMap: true,
    address: undefined,
    bounds: undefined,
    height: undefined,
    width: undefined
  }
  MapsStore.addMapMutation(map)
  return true
}

export const updatePositionInTutorial = () => {
  const bounds: google.maps.LatLngBoundsLiteral = { east: 139.75675837306753, north: 35.67404127953475, south: 35.67318171815096, west: 139.75499542693257 }
  const address = '"東京都千代田区日比谷公園１−２"'
  const googleMap = document.getElementById('google-map') as HTMLDivElement
  const { width, height } = googleMap.getBoundingClientRect()
  const map: Map = {
    id: MAIN_BIG_NUMBER,
    name: '日比谷公園',
    planId: MAIN_BIG_NUMBER,
    isGoogleMap: true,
    address,
    bounds,
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
    todoListId: undefined,
    rotate: 0
  }
  // @ts-ignore
  SvgsStore.addSvgMutation(rect)

  const map = window.$nuxt.context.$googleMap.map.value
  const bounds: google.maps.LatLngBoundsLiteral = { east: 139.7560014028148, north: 35.673830104228834, south: 35.673663691139645, west: 139.75566009175128 }

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
  const anotherTodo: Todo = {
    id: ANOTHER_BIG_NUMBER,
    title: '側溝の落ち葉取り',
    todoListId: MAIN_BIG_NUMBER,
  }
  TodoListsStore.setSelectedTodoListIndex(0)
  TodoListsStore.addTodoMutation(anotherTodo)
  return true
}

export const activatePlanInTutorial = () => {
  const todoStatuses: TodoStatus[] = [
  {
    id: MAIN_BIG_NUMBER,
    status: 'todo',
    svgId: MAIN_BIG_NUMBER,
    todoId: MAIN_BIG_NUMBER,
    todoStatusId: MAIN_BIG_NUMBER
  },
  {
    id: ANOTHER_BIG_NUMBER,
    status: 'todo',
    svgId: MAIN_BIG_NUMBER,
    todoId: ANOTHER_BIG_NUMBER,
    todoStatusId: MAIN_BIG_NUMBER
  },
]

  PlansStore.activatePlan()
  TodoStatusesStore.initTodoStatuses(todoStatuses)
  return true
}

export const setMarkersInTutorial = () => {
  const svgMarker: google.maps.Symbol = {
    path: 'm12 7.27 4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
    fillColor: 'blue',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 90,
    scale: 1,
  }
  const map = window.$nuxt.context.$googleMap.map.value
  // eslint-disable-next-line no-new
  new google.maps.Marker({
    position: { lat: 35.67372495072149, lng: 139.7559813988067 },
    map,
    icon: svgMarker,
    optimized: true
  })
  // eslint-disable-next-line no-new
  new google.maps.Marker({
    position: { lat: 35.67358356649706, lng: 139.7558864662022 },
    label: 'ダミー 太郎',
    icon: {
      path: 'M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z',
      strokeColor: '#fc4242'
    },
    optimized: true,
    map
  })
  return true
}

export const chackMainTodoInTutorial = () => {
  TodoStatusesStore.changeTodoStatus({ id: MAIN_BIG_NUMBER, status: 'done'})
  return true
}

export const chackAnotherTodoInTutorial = () => {
  TodoStatusesStore.changeTodoStatus({ id: ANOTHER_BIG_NUMBER, status: 'done'})
  return true
}

export const inactivatePlanInTutorial = () => {
  PlansStore.inactivatePlan()
  TodoStatusesStore.clearTodoStatuses()
  return true
}
