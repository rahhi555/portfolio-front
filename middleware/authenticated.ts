import { defineNuxtMiddleware } from "@nuxtjs/composition-api";

// 未ログインの場合ログインページに飛ばす
export default defineNuxtMiddleware(ctx => {
  if (!ctx.store.getters['user/isAuthenticated']) {
    const snackbarPayload = JSON.stringify({ color: 'warning', message: 'ログインしてください' })
    const encodedPayload = encodeURI(snackbarPayload)

    ctx.res.setHeader('Set-Cookie', `snackbar=${encodedPayload};Path=/`)
    return ctx.redirect('/auth/login')
  }
})
