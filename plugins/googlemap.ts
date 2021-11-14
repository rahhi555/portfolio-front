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
        private isHeading_: boolean

        constructor(bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement, isHeading: boolean) {
          super()

          this.bounds_ = new google.maps.LatLngBounds({
            lat: bounds.south, lng: bounds.west
          }, {
            lat: bounds.north, lng: bounds.east
          })
          this.svg_ = svg
          this.isHeading_ = isHeading
        }

        onAdd() {
          this.svg_!.style.position = 'absolute'

          const panes = this.getPanes()!
          panes.overlayMouseTarget.appendChild(this.svg_!)
        }

        draw() {
          const overlayProjection = this.getProjection()
          const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getSouthWest()
          )!
          const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getNorthEast()
          )!

          if (this.svg_) {
            // 傾きがある場合のオーバーレイがうまくいかないので暫定的にオミット
            if(this.isHeading_) {
              this.svg_.style.visibility = 'hidden'
            } else {
              this.svg_.style.visibility = 'visible'
            }

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
  const initOverlay = (bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement, isHeading: boolean) => {
    const overlay = new Overlay.value(bounds, svg, isHeading) as google.maps.OverlayView
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
      initOverlay: (bounds: google.maps.LatLngBoundsLiteral, svg: HTMLElement, isHeading: boolean) => google.maps.OverlayView
      map: Ref<google.maps.Map>
    }
  }
}
