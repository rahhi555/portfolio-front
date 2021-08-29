import { defineNuxtMiddleware } from "@nuxtjs/composition-api";

// ログイン済みの状態でloginやsignupページへのurlを入力したらダッシュボードに推移する
export default defineNuxtMiddleware((ctx) => {
  if (ctx.store.getters['user/isAuthenticated']) {
    const snackbarPayload = JSON.stringify({ color: 'warning', message: 'ログイン済みです' })
    const encodedPayload = encodeURI(snackbarPayload)

    ctx.res.setHeader('Set-Cookie', `snackbar=${encodedPayload};Path=/`)
    return ctx.redirect('/dashboard')
  }
})
