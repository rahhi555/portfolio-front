import { ref, nextTick, watch } from '@nuxtjs/composition-api'
import { SnackbarStore } from '~/store'
import { targetElement } from '~/utils/tutorial/tutorial-tables'

/** チュートリアルで最前面に表示されるDiv要素。全画面を覆いつつclipPathスタイルを指定して切り抜くことで、特定箇所のみユーザー操作を許可する。 */
const tutorialDiv = document.getElementById('tutorial-div') as HTMLDivElement

/** 現在のメッセージが表示し終えたか */
export const isFinishedDisplayMsg = ref(false)

/** エラーハンドラ */
const tutorialErrorHandler = async () => {
  tutorialWatchStopHandle()
  SnackbarStore.visible({
    color: 'error',
    message: 'チュートリアル処理で異常が発生しました',
  })
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // @ts-ignore
  // window.$nuxt.$router.go({ path: 'dashboard/plans', force: true })
}

/** メッセージが表示し終えるたび、グラデーションを選択箇所に沿って中抜きする */
const tutorialWatchStopHandle = watch(() => [isFinishedDisplayMsg.value, targetElement.value], async () => {
  // 中抜きリセット
  tutorialDiv.style.clipPath = ''

  // メッセージが表示し終えていなければリターン
  if(!isFinishedDisplayMsg.value) return

  await nextTick()
  // DOMが中途半端に更新された状態で取得され、更にその後watchが発火しないため、遅延させ最終的なDOMを取得する
  await new Promise(resolve => setTimeout(resolve, 300))

  if (!tutorialDiv || !targetElement.value) return

  // 選択箇所の位置情報取得
  const targetRect = targetElement.value.getBoundingClientRect()

  // 選択箇所の位置をPath文字列に変換
  const { top, left, width, height } = targetRect
  const targetRectPath = `M ${left} ${top}  h ${width} v ${height} h -${width} z`

  // 画面全体の位置をPath文字列に変換
  const { clientWidth, clientHeight } = tutorialDiv
  const displayScreenPath = `M 0 0 v ${clientHeight} h ${clientWidth} v -${clientHeight} z`

  // グラデーション中抜き
  tutorialDiv.style.clipPath = `path('${targetRectPath} ${displayScreenPath}')`
}, { immediate: true })

/** チュートリアルセットアップ */
export const initTutorial = () =>
  nextTick(() => {
    // タブキーによる操作を無効にする
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Tab') {
        e.preventDefault()
      }
    })
    // if (!tutorialDiv || !targetElement.value) tutorialErrorHandler()
  })
