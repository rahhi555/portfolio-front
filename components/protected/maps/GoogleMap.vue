<template>
  <div>
    <template v-if="!!map && isGoogleMapEditMode && enabledGoogleMap">
      <MapsGoogleMapSearchBar :map="map" />
    </template>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <button
          v-show="isGoogleMapEditMode"
          id="setCurrentPositionIcon"
          v-bind="attrs"
          v-on="on"
          @click="setCurrentPosition"
        ></button>
      </template>
      <span>現在地に移動</span>
    </v-tooltip>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <button
          v-show="isGoogleMapEditMode"
          id="setCenterIcon"
          v-bind="attrs"
          v-on="on"
          @click="updatePosition"
        ></button>
      </template>
      <span>中心座標をセット</span>
    </v-tooltip>

    <v-chip
      id="activeMapAddress"
      :active="isInitMap && enabledGoogleMap"
      class="ml-2"
      >{{ address }}</v-chip
    >

    <div
      v-show="enabledGoogleMap"
      id="google-map"
      :class="isGoogleMapEditMode ? 'active-map' : 'non-active-map'"
    ></div>
    <div v-show="!enabledGoogleMap" class="disabledGoogleMap"></div>
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
} from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'

export default defineComponent({
  setup() {
    // activeMapをwatchで監視するためcomputedで定義
    const activeMap = computed(() => MapsStore.activeMap)
    // マップ中心の初期値
    const DEFAULT_CENTER = {
      lat: 35.68146276355398,
      lng: 139.76713552670145,
    }
    // ズーム倍率の初期値
    const DEFAULT_ZOOM = 18

    watch(activeMap, () => {
      $googleMap.isGoogleMapEditMode.value = false
      if (!activeMap.value) return
      let { lat, lng, zoom } = activeMap.value
      lat ||= DEFAULT_CENTER.lat
      lng ||= DEFAULT_CENTER.lng
      zoom ||= DEFAULT_ZOOM

      map.value?.setCenter({ lat, lng })
      map.value?.setZoom(zoom)
    })

    const { $googleMap } = useContext()

    const enabledGoogleMap = computed(() => {
      return activeMap.value && activeMap.value.isGoogleMap
    })

    const setCurrentPosition = () => {
      if (!navigator.geolocation) {
        alert('現在位置情報は使用不可です')
        return
      }
      navigator.geolocation.getCurrentPosition((position) => {
        map.value?.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }

    const map = ref<google.maps.Map>()
    const styles = {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    }
    const initMap = () => {
      let { lat, lng } = DEFAULT_CENTER
      let zoom = DEFAULT_ZOOM
      if (activeMap.value) {
        lat = activeMap.value.lat || lat
        lng = activeMap.value.lng || lng
        zoom = activeMap.value.zoom || zoom
      }

      $googleMap.loader.load().then(() => {
        map.value = new google.maps.Map(
          document.getElementById('google-map') as HTMLDivElement,
          {
            center: { lat, lng },
            zoom,
            disableDefaultUI: true,
            clickableIcons: false,
            streetViewControl: false,
            fullscreenControl: false,
            tilt: 0,
            rotateControl: false,
            styles: [styles],
          }
        )
        const setCurrentPositionIcon = document.getElementById(
          'setCurrentPositionIcon'
        )
        const setCenterIcon = document.getElementById('setCenterIcon')
        const activeMapAddress = document.getElementById('activeMapAddress')
        map.value.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
          setCurrentPositionIcon
        )
        map.value.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
          setCenterIcon
        )
        map.value.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
          activeMapAddress
        )
      })
    }
    const isInitMap = ref(false)
    onMounted(() => {
      initMap()
      // 初回起動時のアドレス表示の見た目が良くないので遅延させる
      setTimeout(() => {
        isInitMap.value = true
      }, 750)
    })

    watch($googleMap.isGoogleMapEditMode, () => {
      let options: google.maps.MapOptions
      if ($googleMap.isGoogleMapEditMode.value) {
        options = {
          disableDefaultUI: false,
          clickableIcons: true,
          styles: [],
        }
      } else {
        options = {
          disableDefaultUI: true,
          clickableIcons: false,
          styles: [styles],
        }
      }
      map.value?.setOptions(options)
    })

    onUnmounted(() => {
      $googleMap.isGoogleMapEditMode.value = false
    })

    const updatePosition = async () => {
      const center = map.value?.getCenter()
      if (!center) return
      const { lat, lng } = center
      const zoom = map.value?.getZoom()
      const geocoding = new google.maps.Geocoder()

      let address!: string
      await geocoding
        .geocode({ location: center, region: 'JP' })
        .then((res) => {
          address = res.results[0].formatted_address.split(' ')[1]
        })
        .catch((e) => alert(e))
      MapsStore.updateMap({
        id: activeMap.value.id,
        lat: lat(),
        lng: lng(),
        address,
        zoom,
      })
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

.disabledGoogleMap
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

#setCurrentPositionIcon
  width: 40px
  height: 40px
  font-size: 16px
  margin-right: 10px
  border: 1px solid #ddd
  border-radius: 100%
  background-image: url("~@/assets/current_location.png")
  background-position: center
  background-color: white
  box-shadow: 0 1px 3px 1px #ddd

#setCenterIcon
  width: 40px
  height: 40px
  font-size: 16px
  margin-right: 10px
  margin-bottom: 10px
  border: 1px solid #ddd
  border-radius: 100%
  background-image: url("~@/assets/set_center.png")
  background-position: center
  background-color: white
  box-shadow: 0 1px 3px 1px #ddd
</style>
