import { ref } from '@nuxtjs/composition-api'
import { SendCurrentPositionParams } from "./google-map-marker"
import { UserStore } from '~/store'

/** 他人の現在位置アイコン設定ファイル */

/** マーカーを格納する配列。userIdをtitleプロパティに割り当てることで一意にする */
const memberMarkers = ref<google.maps.Marker[]>([])

/** redisから送信された他メンバーの現在位置を取得するメソッド */
export const getOtherMenberPosition = ({ lat, lng, userId, name }: SendCurrentPositionParams) => {
  if(process.server) return

  const map = window.$nuxt.context.$googleMap.map.value

  // GoogleMapが存在しないか、自分自身のデータならば処理を抜ける
  if(!map || userId === UserStore.currentUser.id) return

  const existsMember = memberMarkers.value.find(marker => marker.getTitle() === userId.toString())
  
  if(existsMember) {
    existsMember.setPosition({ lat, lng })
  } else {
    memberMarkers.value.push(new google.maps.Marker({
      title: userId.toString(),
      position: { lat, lng },
      label: name,
      icon: {
        path: 'M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z',
        strokeColor: '#fc4242'
      },
      optimized: true,
      map
    }))
  }
}
