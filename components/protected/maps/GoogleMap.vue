<template>
  <div>
    <template v-if="!!map && isGoogleMapEditMode && enabledGoogleMap">
      <MapsGoogleMapSearchBar :map="map" />
    </template>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-show="isGoogleMapEditMode"
          id="set-current-position-icon"
          class="mr-3"
          fab
          small
          v-bind="attrs"
          v-on="on"
          @click="setCurrentPosition()"
          ><v-icon>mdi-crosshairs-gps</v-icon></v-btn
        >
      </template>
      <span>現在地に移動</span>
    </v-tooltip>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-show="isGoogleMapEditMode"
          id="set-center-icon"
          class="mr-3 mb-2"
          fab
          small
          v-bind="attrs"
          v-on="on"
          @click="updatePosition"
          ><v-icon>mdi-pin-outline</v-icon></v-btn
        >
      </template>
      <span>中心座標をセット</span>
    </v-tooltip>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-show="isGoogleMapEditMode"
          id="rotate-left-icon"
          class="ml-3"
          fab
          small
          v-bind="attrs"
          v-on="on"
          @click="rotateMap(10)"
          ><v-icon>mdi-rotate-left</v-icon></v-btn
        >
      </template>
      <span>マップを左に回転</span>
    </v-tooltip>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-show="isGoogleMapEditMode"
          id="rotate-right-icon"
          class="mr-3"
          fab
          small
          v-bind="attrs"
          v-on="on"
          @click="rotateMap(-10)"
          ><v-icon>mdi-rotate-right</v-icon></v-btn
        >
      </template>
      <span>マップを右に回転</span>
    </v-tooltip>

    <v-chip
      id="active-map-address"
      :active="isInitMap && enabledGoogleMap"
      class="ml-2"
      >{{ address }}</v-chip
    >

    <div
      v-show="enabledGoogleMap"
      id="google-map"
      :class="isGoogleMapEditMode ? 'active-map' : 'non-active-map'"
    ></div>
    <div v-show="!enabledGoogleMap" class="disabled-google-map"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  onMounted,
  watch,
  ref,
  onUnmounted,
  computed,
  nextTick,
} from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'

export default defineComponent({
  setup() {
    const { $googleMap, $config } = useContext()
    const map = $googleMap.map
    // activeMapをwatchで監視するためcomputedで定義
    const activeMap = computed(() => MapsStore.activeMap)

    // 現在位置取得。isSetCenterがtrueなら位置情報のマップ反映をスキップする。
    const setCurrentPosition = (skipSetCenter = false) => {
      if (!navigator.geolocation) {
        alert('現在位置情報は使用不可です')
        return
      }
      navigator.geolocation.getCurrentPosition((position) => {
        if(skipSetCenter) return

        map.value?.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      }, (e) => console.error(e), {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000
      })
    }

    // 現在のマップのグーグルマップ使用フラグ
    const enabledGoogleMap = computed(() => {
      return !!activeMap.value && activeMap.value.isGoogleMap
    })

    const activeMapBoundsHeading = computed(() => {
      // マップ初期値
      const DEFAULT_BOUNDS: google.maps.LatLngBoundsLiteral = {
        south: 35.68124705175614,
        west: 139.7670591199903,
        north: 35.682106540302094,
        east: 139.7681749189405,
      }

      let bounds: google.maps.LatLngBoundsLiteral
      let heading: number

      if(!activeMap.value) {
        bounds = DEFAULT_BOUNDS
        heading = 0
        return { bounds, heading }
      }

      bounds = activeMap.value.bounds || DEFAULT_BOUNDS
      heading = activeMap.value.heading || 0
      return { bounds, heading }
    })

    // マップの初期化処理終了フラグ
    const isInitMap = ref(false)
    
    // 初期化処理
    onMounted(() => {
      setCurrentPosition(true)
      const { bounds, heading } = activeMapBoundsHeading.value

      $googleMap.loader.load().then(() => {
        map.value = new google.maps.Map(
          document.getElementById('google-map') as HTMLDivElement,
          {
            disableDefaultUI: true,
            clickableIcons: false,
            streetViewControl: false,
            fullscreenControl: false,
            rotateControl: false,
            mapId: $config.mapId,
            heading,
          }
        )

        map.value.fitBounds(bounds, 0)

        const buttons: [string, google.maps.ControlPosition][] = [
          [
            'set-current-position-icon',
            google.maps.ControlPosition.RIGHT_BOTTOM,
          ],
          ['set-center-icon', google.maps.ControlPosition.RIGHT_BOTTOM],
          ['active-map-address', google.maps.ControlPosition.LEFT_BOTTOM],
          ['rotate-left-icon', google.maps.ControlPosition.LEFT_CENTER],
          ['rotate-right-icon', google.maps.ControlPosition.RIGHT_CENTER],
        ]

        buttons.forEach(([id, position]) => {
          const button = document.getElementById(id)
          map.value.controls[position].push(button)
        })
      })
      // 初回起動時のアドレス表示の見た目が良くないので遅延させる
      setTimeout(() => {
        isInitMap.value = true
      }, 800)
    })

    watch(activeMap, () => {
      $googleMap.isGoogleMapEditMode.value = false
      const { bounds, heading } = activeMapBoundsHeading.value
      
      // mapのdom要素が表示されてからじゃないと失敗する
      nextTick(() => {
        map.value.fitBounds(bounds, 0)
        map.value.setHeading(heading)
      })
    })

    // モード切替時にオーバーレイのオンオフをする
    const overlay = ref<google.maps.OverlayView>()
    watch($googleMap.isGoogleMapEditMode, () => {
      if ($googleMap.isGoogleMapEditMode.value) {
        // オーバーレイ削除時のミニマップ消失を防ぐため、複製したミニマップをオーバーレイ対象にする
        const svgBase = document.getElementById('svg-base')!
        const cloneSvgBase = svgBase.cloneNode(true) as HTMLElement
        cloneSvgBase.id = 'svg-base-clone'
        // ベースとなるミニマップは非表示にする
        cloneSvgBase.style.visibility = 'visible'
        // テキストの「ダブルクリックで名前変更」を非表示にする(v-bindが効かなかったため、直接クラスを削除する)
        const childTexts = cloneSvgBase.querySelectorAll("[id ^= 'rect-text-']") as NodeListOf<SVGTextElement>
        childTexts.forEach(text => {
          text.classList.remove('tooltip-visible')
        })
        // Lineのクラスを削除し、ホバーした際のカーソルを初期化する
        const childLines = cloneSvgBase.querySelectorAll("line") as NodeListOf<SVGLineElement>
        childLines.forEach(line => {
          line.setAttributeNS(null, 'class', '')
        })

        overlay.value = $googleMap.initOverlay(
          activeMapBoundsHeading.value.bounds,
          cloneSvgBase,
          map.value!
        )
        map.value.setOptions({
          disableDefaultUI: false
        })
      } else {
        map.value.setOptions({
          disableDefaultUI: true
        })
        overlay.value?.onRemove()
        map.value.fitBounds(activeMapBoundsHeading.value.bounds, 0)
      }
    })

    onUnmounted(() => {
      $googleMap.isGoogleMapEditMode.value = false
    })

    const updatePosition = async () => {
      const bounds = map.value?.getBounds()?.toJSON()
      const heading = map.value?.getHeading()
      const location = map.value?.getCenter()

      if (!bounds || !Number.isInteger(heading) || !location) return
      const geocoding = new google.maps.Geocoder()

      let address!: string
      await geocoding
        .geocode({ location ,bounds, region: 'JP' })
        .then((res) => {
          address = res.results[0].formatted_address.split(' ')[1]
        })
        .catch((e) => alert(e))
      MapsStore.updateMap({
        id: activeMap.value.id,
        address,
        bounds,
        heading
      })
    }

    // マップの回転処理
    const rotateMap = (amount: number) => {
      map.value.setHeading(map.value.getHeading()! + amount)
    }

    return {
      isGoogleMapEditMode: $googleMap.isGoogleMapEditMode,
      isInitMap,
      map,
      setCurrentPosition,
      updatePosition,
      enabledGoogleMap,
      address: computed(() => {
        if (!activeMap.value) return
        return activeMap.value.address || 'アドレス未指定'
      }),
      rotateMap,
    }
  },
})
</script>

<style scoped lang="sass">
#google-map
  height: 75vh
  width: 98%
  position: absolute
  top: 12px
  background-color: gray

.disabled-google-map
  height: 75vh
  width: 98%
  position: absolute
  top: 12px
  background-color: #f0f8ff
  z-index: -1

.non-active-map
  z-index: -1

.active-map
  z-index: 0
</style>
