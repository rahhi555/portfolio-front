import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Cookie from 'universal-cookie'
import dayjs from 'dayjs'
import firebase from '~/plugins/firebase'
import { $axios } from '~/utils/axios-accessor'
import { SnackbarStore } from '~/utils/store-accessor'
import imageValidates from '~/utils/helpers/image_validatior'

interface UserParams {
  id: number
  name: string
  uid: string
  provider: 'anonymous' | 'password' | 'google' | ''
  avatar?: string
  email?: string
  createdAt?: string
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
    avatar: '',
    email: '',
    createdAt: ''
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
      // avatarかemailは無い場合もあるのでスキップ
      if(value === 'avatar' || value === 'email') continue
      if(!!this.userState[value] === false) hasAllGetted = false 
    }
    return hasAllGetted && !!this.tokenState
  }

  public get isAnonymous() {
    return this.userState.provider === 'anonymous'
  }

  /** 
   * チュートリアル対象かどうかを返す(ユーザー作成して１分以内ならチュートリアル対象)   
   * また、チュートリアルの項目を選んだ場合でも対象とみなす(その場合はクッキーを目安にする)
   * */
  public get needTutorial() {
    if(!this.userState.createdAt) return false
    
    const now = dayjs()
    // 現在の時刻とcreatedAtの差を分で取得
    const diffMinutes = now.diff(this.userState.createdAt, 'm')

    // 'needTutorial'というキーのクッキーが存在するか
    const cookies = new Cookie()
    const hasNeedTutorialCookie = !!cookies.get('needTutorial')
    cookies.remove('needTutorial', { path: '/' })

    // テスト用にめっちゃ長くとる
    return diffMinutes <= 60 || hasNeedTutorialCookie
  }

  @Mutation
  private setUserMutation(user: UserParams) {
    // 先にemailが入っていると上書きされるので対処
    let email;
    if(this.userState.email) email = this.userState.email
    this.userState = user
    this.userState.email = email
  }

  @Mutation
  private removeUserMutation() {
    for(const value in this.userState) { this.userState[value] = '' }
  }

  @Mutation
  public setTokenMutation(token: string) {
    this.tokenState = token
  }

  @Mutation
  public setEmail(email: string) {
    this.userState.email = email
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
    if(!imageValidates(files)) return
    
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
