<template>
  <div id="google-map"></div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'protected',

  setup() {
    const { $googleMap } = useContext()

    let map!: google.maps.Map
    if (process.client && $googleMap.loader) {
      $googleMap.loader.load().then(() => {
        map = new google.maps.Map(
          document.getElementById('google-map') as HTMLDivElement,
          {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,

          }
        )
      })
    }

    return {
      map
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
</style>