import { Plan, Member } from 'interface'
import { PlansStore, MembersStore, UserStore } from '~/store'

/** 実用のidと重複するのを避けるため値の大きい定数を用意 */
const BIG_NUMBER_ID = 999_999_999

const memberSelf: Member = {
  id: BIG_NUMBER_ID,
  accept: true,
  planId: BIG_NUMBER_ID,
  userId: UserStore.currentUser.id,
  userName: UserStore.currentUser.name,
}

export const tutorialPlanCreate = () => {
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