import { zoomInOut } from '~/utils/svgs/svg-viewbox'

// 基本の距離
let baseDistance = 0

// 変化後の距離
let movedDistance = 0

// タイムアウトid
let timeoutId!: NodeJS.Timeout

// 距離を測る関数
const getDistance = (e: TouchEvent) => {
  const touches = e.changedTouches

  // 座標１（一本目の指）
  const x1 = touches[0].pageX
  const y1 = touches[0].pageY

  // 座標２（２本目の指）
  const x2 = touches[1].pageX
  const y2 = touches[1].pageY

  // ２点間の距離
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/** ピンチイン・アウトに合わせてズームイン・アウトを実行する */
export const pinchInOut = (e: TouchEvent) => {
  e.preventDefault()

  // 2本以上の指の場合だけ処理
  if (e.changedTouches.length <= 1) return

  // タイムアウトを削除
  clearTimeout(timeoutId)

  if (baseDistance) {
    movedDistance = getDistance(e)
  } else {
    baseDistance = getDistance(e)
  }

  const scale = movedDistance / baseDistance

  // scaleが1.0より大きければピンチアウト。低ければピンチイン。
  if (1.0 < scale) {
    // ピンチイン
    zoomInOut(1)
  } else {
    // ピンチアウト
    zoomInOut(-1)
  }

  // 100ms操作がなければピンチ操作していないとみなし、変数を初期化する
  timeoutId = setTimeout(() => {
    movedDistance = 0
    baseDistance = 0
  }, 100)
}
