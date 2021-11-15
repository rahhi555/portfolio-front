/* eslint-disable new-cap */
import { Loader } from '@googlemaps/js-api-loader'
import { defineNuxtPlugin, ref, Ref } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(({ $config }, inject) => {
  const isGoogleMapEditMode = ref(false)

  let loader!: Loader
  const Overlay = ref()

  if (process.client) {
    loader = new Loader({
      apiKey: $config.googleMapsApiKey,
      language: 'ja',
      region: 'JP',
      libraries: ['places'],
      version: 'beta'
    })
    loader.load().then(() => {
      class SVGOverlay extends google.maps.OverlayView {
        private bounds_: google.maps.LatLngBounds
        private svg_: HTMLElement | null

        constructor(bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement) {
          super()

          this.bounds_ = new google.maps.LatLngBounds({
            lat: bounds.south, lng: bounds.west
          }, {
            lat: bounds.north, lng: bounds.east
          })
          this.svg_ = svg
        }

        onAdd() {
          this.svg_!.style.position = 'absolute'

          const panes = this.getPanes()!
          panes.overlayMouseTarget.appendChild(this.svg_!)
        }

        draw() {
          // 0と180以外の傾きのオーバーレイがうまくいかないので暫定的にオミット
          const heading = map.value?.getHeading()
          if(heading === 0 || heading === 180) {
            this.svg_!.style.visibility = 'visible'
          } else {
            this.svg_!.style.visibility = 'hidden'
            return
          }

          const overlayProjection = this.getProjection()
          const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getSouthWest()
          )!
          const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getNorthEast()
          )!

          if (this.svg_) {
            const s = this.svg_.style
            s.left = sw.x + 'px'
            s.top = ne.y + 'px'
            s.width = ne.x - sw.x + 'px'
            s.height = sw.y - ne.y + 'px'
          }
        }

        onRemove() {
          if (this.svg_) {
            const panes = this.getPanes()
            panes?.overlayMouseTarget.removeChild(this.svg_)
          }
        }
      }
      Overlay.value = SVGOverlay
    })
  }
  const initOverlay = (bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement) => {
    const overlay = new Overlay.value(bounds, svg) as google.maps.OverlayView
    overlay.setMap(map.value!)
    return overlay
  }

  const map = ref<google.maps.Map>()

  const googleMap = {
    loader,
    isGoogleMapEditMode,
    initOverlay,
    map
  }

  inject('googleMap', googleMap)
})

declare module '@nuxt/types' {
  interface Context {
    $googleMap: {
      loader: Loader
      isGoogleMapEditMode: Ref<boolean>
      initOverlay: (bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement) => google.maps.OverlayView
      map: Ref<google.maps.Map>
    }
  }
}
