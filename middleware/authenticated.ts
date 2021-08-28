import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { UserStore } from '~/store'

// 未ログインの場合ログインページに飛ばすs
export default defineNuxtMiddleware((ctx) => {
  if (!UserStore.isAuthenticated) {
    const snackbarPayload = JSON.stringify({
      color: 'warning',
      message: 'ログインしてください',
    })
    const encodedPayload = encodeURI(snackbarPayload)

    ctx.res.setHeader('Set-Cookie', `snackbar=${encodedPayload};Path=/`)
    return ctx.redirect('/auth/login')
  }
})
