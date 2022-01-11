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
          data-tutorial="set-google-map-center"
          class="mr-3 mb-2"
          color="primary"
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

    <v-chip id="active-map-address" :active="isInitMap && enabledGoogleMap" class="ml-2">{{ address }}</v-chip>
    <div
      v-show="enabledGoogleMap"
      id="google-map"
      :class="[isGoogleMapEditMode ? 'active-map' : 'non-active-map', { 'google-map-expand': isShowPage }]"
    ></div>
    <div v-show="!enabledGoogleMap" :class="['disabled-google-map', { 'google-map-expand': isShowPage }]"></div>
  </div>
</template>

<script setup lang="ts">
import { MapsStore } from '~/store'
import { isShowPage } from '~/utils/ui/common'
import Marker from '~/utils/ui/google-map-marker'

const { $googleMap, $config, $tutorial } = useContext()
const map = $googleMap.map
// activeMapをwatchで監視するためcomputedで定義
const activeMap = computed(() => MapsStore.activeMap)

// 現在位置取得。isSetCenterがtrueなら位置情報のマップ反映をスキップする。
const setCurrentPosition = (skipSetCenter = false) => {
  if (!navigator.geolocation) {
    alert('現在位置情報は使用不可です')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (skipSetCenter) return

      map.value?.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    },
    (e) => console.error(e),
    {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 10 * 1000,
    }
  )
}

// 現在のマップのグーグルマップ使用フラグ
const enabledGoogleMap = computed(() => {
  return !!activeMap.value && activeMap.value.isGoogleMap
})

const activeMapBounds = computed(() => {
  // bounds初期値
  const DEFAULT_BOUNDS: google.maps.LatLngBoundsLiteral = {
    south: 35.68124705175614,
    west: 139.7670591199903,
    north: 35.682106540302094,
    east: 139.7681749189405,
  }

  return activeMap.value?.bounds || DEFAULT_BOUNDS
})

// マップの初期化処理終了フラグ
const isInitMap = ref(false)

const initMap = () => {
  window.$nuxt.$loading.start()

  setCurrentPosition(true)
  const bounds = activeMapBounds.value

  $googleMap.loader.load().then(() => {
    map.value = new google.maps.Map(document.getElementById('google-map') as HTMLDivElement, {
      disableDefaultUI: true,
      clickableIcons: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      mapId: $config.mapId,
    })

    const buttons: [string, google.maps.ControlPosition][] = [
      ['set-current-position-icon', google.maps.ControlPosition.RIGHT_BOTTOM],
      ['set-center-icon', google.maps.ControlPosition.RIGHT_BOTTOM],
      ['active-map-address', google.maps.ControlPosition.LEFT_BOTTOM],
    ]

    buttons.forEach(([id, position]) => {
      const button = document.getElementById(id)
      map.value.controls[position].push(button)
    })

    if (isShowPage.value && !$tutorial.isRunningTutorial.value) {
      Marker.onMounted(map.value)
    }

    map.value.fitBounds(bounds, 0)
    isInitMap.value = true
    window.$nuxt.$loading.finish()
  })
}

// 初期化処理
onMounted(() => {
  nextTick().then(() => {
    initMap()
  })
})

/**
 * 現在表示しているマップが変更されたらisGoogleMapEditModeをfalseにする
 * また、最後のmapTypeIdがSATELLITEかつ次のマップがgoogleMapを使用しない場合表示がおかしくなるためROADMAPにする
 * **/
const stopAutoNormalMode = watch(activeMap, (newMap, oldMap) => {
  // 変更前のマップがグーグルマップ対応の場合、エディットモードを解除し、マップ表示をROADMAPにする
  if(oldMap?.isGoogleMap) {
    $googleMap.isGoogleMapEditMode.value = false

    const { ROADMAP } = google.maps.MapTypeId
    $googleMap.map.value.setMapTypeId(ROADMAP)
  }

  // 次表示するマップがグーグルマップ対応の場合boundsをセットする
  if (newMap?.isGoogleMap) {
    const bounds = activeMapBounds.value

    // mapのdom要素が表示されてからじゃないと失敗する
    nextTick(() => {
      map.value.fitBounds(bounds, 0)
    })
  }
})

// モード切替時に自動で見た目を整える
const stopDefaultUI = watch($googleMap.isGoogleMapEditMode, () => {
  if ($googleMap.isGoogleMapEditMode.value) {
    map.value.setOptions({
      disableDefaultUI: false,
    })
  } else {
    map.value.setOptions({
      disableDefaultUI: true,
    })
    map.value.fitBounds(activeMapBounds.value, 0)
  }
})

onUnmounted(() => {
  $googleMap.isGoogleMapEditMode.value = false
  stopAutoNormalMode()
  stopDefaultUI()
  if (isShowPage.value && !$tutorial.isRunningTutorial.value) {
    Marker.unMounted()
  }
})

const updatePosition = async () => {
  if ($tutorial.isRunningTutorial.value) return

  const bounds = map.value?.getBounds()?.toJSON()

  const location = map.value?.getCenter()

  if (!bounds || !location) return
  const geocoding = new google.maps.Geocoder()

  // 逆ジオで住所文字列取得
  let address!: string
  await geocoding
    .geocode({ location, bounds, region: 'JP' })
    .then((res) => {
      address = res.results[0].formatted_address.split(' ')[1]
    })
    .catch((e) => alert(e))

  // 設定時の画面の縦横を取得し、デバイスごとの描写差をなくす
  const width = map.value.getDiv().clientWidth
  const height = map.value.getDiv().clientHeight

  await MapsStore.updateMap({
    id: activeMap.value.id,
    address,
    bounds,
    width,
    height,
  })
  $googleMap.isGoogleMapEditMode.value = false
}

const isGoogleMapEditMode = $googleMap.isGoogleMapEditMode

const address = computed(() => {
  if (!activeMap.value) return
  return activeMap.value.address || 'アドレス未指定'
})
</script>

<style scoped lang="sass">
#google-map
  height: map-get($svgbase-and-googlemap-vh, 'default')
  width: 98%
  position: absolute
  top: 12px
  background-color: gray

.disabled-google-map
  height: map-get($svgbase-and-googlemap-vh, 'default')
  width: 98%
  position: absolute
  top: 12px
  background-color: #f0f8ff
  z-index: -1

.google-map-expand
  height: map-get($svgbase-and-googlemap-vh, 'expand') !important

.non-active-map
  z-index: -1

.active-map
  z-index: 0
</style>
