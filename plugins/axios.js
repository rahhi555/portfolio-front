export default ({ $axios }) => {
  // 開発環境のみログを出力する
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
}