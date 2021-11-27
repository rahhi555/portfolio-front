import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { UserStore } from '~/store'

// 未ログインの場合ログインページに飛ばす
export default defineNuxtMiddleware((ctx) => {
  if (!UserStore.isAuthenticated) {
    const snackbarPayload = JSON.stringify({
      color: 'warning',
      message: 'ログインしてください',
    })
    const encodedPayload = encodeURI(snackbarPayload)

    // 'snackbar'キーでクッキーをセットすることで、MaterialSnackbar.vueのonMounted処理でスナックバーを表示できる
    ctx.res.setHeader('Set-Cookie', `snackbar=${encodedPayload};Path=/`)
    return ctx.redirect('/auth/login')
  }
})
