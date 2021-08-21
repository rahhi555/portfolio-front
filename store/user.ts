import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Cookie from 'universal-cookie'
import firebase from '~/plugins/firebase'

interface UserParams {
  id: number
  name: string
  uid: string
}

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class User extends VuexModule {
  private userState: UserParams = {
    id: 0,
    name: '',
    uid: '',
  }

  public get uid() {
    if (this.userState && this.userState.uid) return this.userState.uid
    else return null
  }

  public get currentUser() {
    return this.userState
  }

  public get isAuthenticated() {
    return !!this.userState.uid
  }

  public get isAnonymous() {
    return this.userState.name === 'お試しユーザー'
  }

  @Mutation
  private setUserMutation(user: UserParams) {
    this.userState = user
  }

  @Mutation
  private removeUserMutation() {
    this.userState.id = 0
    this.userState.uid = ''
    this.userState.name = ''
  }

  @Action
  public async setUser() {
    const currentUser = firebase.auth().currentUser
    const token = await currentUser?.getIdToken()

    if (currentUser?.isAnonymous) {
      this.setUserMutation({
        id: 0,
        uid: currentUser.uid,
        name: 'お試しユーザー',
      })
    } else {
      window.$nuxt.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
      const user = (await window.$nuxt.$axios
        .$get('/api/v1/users/me')
        .then((user) => {
          return { id: user.id, name: user.name, uid: user.uid }
        })) as UserParams
      this.setUserMutation(user)
    }

    const cookies = new Cookie()
    cookies.set('access_token', token, { path: '/' })
  }

  @Action
  public removeUser() {
    const cookies = new Cookie()
    cookies.remove('access_token', { path: '/' })
    this.removeUserMutation()
  }
}
