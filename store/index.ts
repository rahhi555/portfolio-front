import { ActionTree, Store } from "vuex";
import { ActionContext } from "vuex/types";
import { Context } from "@nuxt/types";
import jwtDecode from 'jwt-decode'
import { initialiseStores } from "~/utils/store-accessor";
import firebase from '~/node_modules/firebase'
const cookieparser = require('cookieparser')


// RootStateを追加
export const state = () => ({});
export type RootState = ReturnType<typeof state>;

const initializer = (store: Store<any>) => initialiseStores(store);
export const plugins = [initializer];

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

    const decodedToken = jwtDecode(token) as firebase.FirebaseIdToken

    if (decodedToken.firebase.sign_in_provider === 'anonymous') {
      context.commit('user/setUserMutation', {
        id: 0,
        uid: decodedToken.user_id,
        name: 'お試しユーザー',
      })
    } else {
      server.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
      await server.$axios
        .$get('/api/v1/users/me')
        .then((user) => {
          context.commit('user/setUserMutation', { id: user.id, name: user.name, uid: user.uid } )
        })
        .catch((e) => {
          console.error(e)
          context.dispatch('user/removeUser')
        })
    }
  }
};

export * from "~/utils/store-accessor";