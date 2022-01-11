/* eslint-disable new-cap */
import { Loader } from '@googlemaps/js-api-loader'
import { defineNuxtPlugin, ref, Ref, computed } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(({ $config }, inject) => {
  const isGoogleMapEditMode = ref(false)

  let loader!: Loader

  if (process.client) {
    loader = new Loader({
      apiKey: $config.googleMapsApiKey,
      language: 'ja',
      region: 'JP',
      libraries: ['places', 'geometry'],
      version: 'beta'
    })
  }

  const map = ref<google.maps.Map>()

  const googleMap = {
    loader,
    isGoogleMapEditMode,
    map,
  }

  inject('googleMap', googleMap)
})

declare module '@nuxt/types' {
  interface Context {
    $googleMap: {
      loader: Loader
      isGoogleMapEditMode: Ref<boolean>
      map: Ref<google.maps.Map>
    }
  }
}
