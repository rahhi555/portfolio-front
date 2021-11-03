<template>
  <div>
    <template v-if="!!map && isGoogleMapEditMode">
      <MapsGoogleMapSearchBar :map="map" />
    </template>
    <button v-show="isGoogleMapEditMode" id="getCurrentPositionIcon" @click="setCurrentPosition"></button>
    <div
      id="google-map"
      :class="isGoogleMapEditMode ? 'active-map' : 'non-active-map'"
    ></div>
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
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { $googleMap } = useContext()
    // 現在位置に対応していなかったとき用の初期値(東京都の経度および緯度)
    const center = { lat: 35.68146276355398, lng: 139.76713552670145 }

    const setCurrentPosition = () => {
      if (!navigator.geolocation) {
        alert('現在位置情報は使用不可です')
        return
      }
      navigator.geolocation.getCurrentPosition((position) => {
        map.value?.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
    }

    const map = ref<google.maps.Map>()
    const styles = {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    }

    onMounted(() => {
      $googleMap.loader.load().then(() => {
        map.value = new google.maps.Map(
          document.getElementById('google-map') as HTMLDivElement,
          {
            center,
            zoom: 18,
            disableDefaultUI: true,
            clickableIcons: false,
            streetViewControl: false,
            fullscreenControl: false,
            tilt: 0,
            rotateControl: false,
            styles: [styles],
          }
        )
        setCurrentPosition()
        const getCurrentPositionIcon = document.getElementById('getCurrentPositionIcon')
        map.value.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(getCurrentPositionIcon)
      })

      onUnmounted(() => {
        $googleMap.isGoogleMapEditMode.value = false
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
    })

    return {
      isGoogleMapEditMode: $googleMap.isGoogleMapEditMode,
      map,
      setCurrentPosition
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

.non-active-map
  z-index: -1

.active-map
  z-index: 0

#getCurrentPositionIcon
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
</style>
