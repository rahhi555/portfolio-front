import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Cookies from 'universal-cookie'
import { initializeAxios } from '~/utils/axios-accessor'

export default defineNuxtPlugin(({ $axios }) => {
  initializeAxios($axios)
  // // 開発環境のみログを出力する
  if (process.env.NODE_ENV === 'development') {
    // リクエストログ
    $axios.onRequest((config) => {
      console.log('[AXIOS REQUEST] :', config)
    })
    // レスポンスログ
    $axios.onResponse((config) => {
      console.log('[AXIOS RESPONSE] :', config)
    })
    // エラーログ
    $axios.onError((e) => {
      console.error('[AXIOS ERROR] :', e.response)
    })
  }

  if (process.client) {
    const cookie = new Cookies()
    const token = cookie.get('access_token')
    $axios.defaults.headers.common.Authorization ||= `Bearer ${token}`
  }
})
