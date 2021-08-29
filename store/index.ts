import { ActionTree, Store } from 'vuex'
import { ActionContext } from 'vuex/types'
import { Context } from '@nuxt/types'
import { initialiseStores } from '~/utils/store-accessor'
const cookieparser = require('cookieparser')

// RootStateを追加
export const state = () => ({})
export type RootState = ReturnType<typeof state>

const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]

// Rootのactionsを追加
export const actions: ActionTree<any, any> = {
  nuxtServerInit: async (
    context: ActionContext<RootState, RootState>,
    server: Context
  ) => {
    // nuxtServerInitの処理
    if (process.server && process.static) return
    if (!server.req.headers.cookie) return

    const parsedCookie = cookieparser.parse(server.req.headers.cookie)
    const token = parsedCookie.access_token
    if (!token) return

    context.commit('user/setTokenMutation', token)

    server.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
    await server.$axios
      .$get('/api/v1/me')
      .then((user) => {
        context.commit('user/setUserMutation', {
          id: user.id,
          name: user.name,
          uid: user.uid,
          provider: user.provider,
        })
      })
      .catch(() => {
        context.dispatch('user/removeUser')
      })
  },
}

export * from '~/utils/store-accessor'
