import { reactive, watch, WatchStopHandle } from '@nuxtjs/composition-api'
import { throttle } from 'mabiki'
import { MapsStore, UserStore } from '~/store'
import { clearMemberMarkers } from '~/utils/ui/google-map-other-marker'

export interface SendCurrentPositionParams {
  lat: number
  lng: number
  userId: number
  name: string
}

/** 使用者本人の現在位置アイコン設定ファイル */

const svgMarker: google.maps.Symbol = {
  path: 'm12 7.27 4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
  fillColor: 'blue',
  fillOpacity: 0.6,
  strokeWeight: 0,
  rotation: 90,
  scale: 1,
}

let watchId: number

const currentPosition = reactive({
  lat: 0,
  lng: 0,
  heading: 0,
})

let marker: google.maps.Marker

let stopMarkerSet: WatchStopHandle | undefined

let stopSendPosition: WatchStopHandle | undefined

/** serup内のonMounted内に記述する。現在位置のwatchとグーグルマップにマーカーを設置する。 */
const onMounted = (map: google.maps.Map) => {
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      currentPosition.lat = pos.coords.latitude
      currentPosition.lng = pos.coords.longitude
      currentPosition.heading = pos.coords.heading!
    },
    () => {},
    { enableHighAccuracy: true }
  )

  marker = new google.maps.Marker({
    position: { lat: currentPosition.lat, lng: currentPosition.lng },
    map,
    icon: svgMarker,
    optimized: true
  })

  /** 現在位置が変更されるたびに作動し、マーカーを設置し直す */
  stopMarkerSet = watch(currentPosition, () => {
    if (!marker) return
    
    const { lat, lng } = currentPosition
    marker.setPosition({ lat, lng })
    svgMarker.rotation! = currentPosition.heading
    marker.setIcon(svgMarker)
  })

  /** 現在位置が変更されるたびに作動し、位置情報を送信する。負荷軽減のため3000msに一度処理する。 */
  stopSendPosition = watch(
    currentPosition,
    throttle(() => {
      if (!marker) return
      const { lat, lng } = currentPosition
      const userId = UserStore.currentUser.id
      const name = UserStore.currentUser.name

      window.$nuxt.context.$planChannelPeformMethods('sendCurrentPosition', { lat, lng, userId, name })
    }, 3000)
  )
}

/** 現在位置のwatchを解除し、グーグルマップ上のマーカーを削除する */
const unMounted = () => {
  navigator.geolocation.clearWatch(watchId)
  watchId = 0
  currentPosition.heading = 0
  currentPosition.lat = 0
  currentPosition.lng = 0

  if(typeof stopMarkerSet === 'function') {
    stopMarkerSet() 
    stopMarkerSet = undefined
  }
  if(typeof stopSendPosition === 'function') {
    stopSendPosition()
    stopSendPosition = undefined
  }

  clearMemberMarkers()
  if (!marker) return
  marker.setMap(null)
}

export default {
  onMounted,
  unMounted,
}
