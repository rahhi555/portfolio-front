import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Cookie from 'universal-cookie'
import firebase from '~/plugins/firebase'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'

interface UserParams {
  id: number
  name: string
  uid: string
  provider: 'anonymous' | 'password' | 'google' | ''
  avatar?: string
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
    provider: '',
    avatar: ''
  }

  private tokenState: string = ''

  public get uid() {
    if (this.userState && this.userState.uid) return this.userState.uid
    else return null
  }

  public get currentUser() {
    return this.userState
  }

  public get token() {
    return this.tokenState
  }

  public get isAuthenticated() {
    let hasAllGetted = true
    for(const value in this.userState ) {
      // avatarは無い場合もあるのでスキップ
      if(value === 'avatar') continue
      if(!!this.userState[value] === false) hasAllGetted = false 
    }
    return hasAllGetted && !!this.tokenState
  }

  public get isAnonymous() {
    return this.userState.provider === 'anonymous'
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

  @Mutation
  public setTokenMutation(token: string) {
    this.tokenState = token
  }

  @Action
  public async setUser() {
    const currentUser = firebase.auth().currentUser
    const token = await currentUser?.getIdToken()

    $axios.defaults.headers.common.Authorization = `Bearer ${token}`
    const user = await $axios.$get('/api/v1/me')
    this.setUserMutation(user)

    const cookies = new Cookie()
    cookies.set('access_token', token, { path: '/' })
  }

  @Action
  public removeUser() {
    this.removeUserMutation()
    const cookies = new Cookie()
    cookies.remove('access_token', { path: '/' })
  }

  @Action
  public async setToken() {
    const token = await firebase.auth().currentUser?.getIdToken()
    if(!token) return
    this.setTokenMutation(token) 
  }

  @Action
  public async updateAvatar(files: FileList) {
    if(files.length === 0 ) return

    const formData = new FormData()
    formData.append('user[avatar]', files[0])
    await $axios.$patch('/api/v1/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => this.setUserMutation(res))
    .catch(() => SnackbarStore.catchError())
    .finally(() => SnackbarStore.CRUDvisible({ model: 'アバター画像', crud: 'update' }))
  }
}
