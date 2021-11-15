import { reactive, watch } from '@nuxtjs/composition-api'
import { MapsStore } from '~/store'

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
  heading: 0
})

let marker: google.maps.Marker

const onMounted = (map: google.maps.Map) => {
  watchId = navigator.geolocation.watchPosition((pos) => {
    currentPosition.lat = pos.coords.latitude
    currentPosition.lng = pos.coords.longitude
    currentPosition.heading = pos.coords.heading!
  })

  marker = new google.maps.Marker({
    position: { lat: currentPosition.lat, lng: currentPosition.lng },
    map,
    icon: svgMarker,
  })
}

const unMounted = () => {
  navigator.geolocation.clearWatch(watchId)
  if(!marker) return
  marker.setMap(null)
}

watch(currentPosition, () => {
  if(!marker) return
  const { lat, lng } = currentPosition
  marker.setPosition({ lat, lng })
  const activeMapHeading = MapsStore.activeMap?.heading || 0
  svgMarker.rotation! =  Math.abs(activeMapHeading - currentPosition.heading)
  marker.setIcon(svgMarker)
})

export default {
  onMounted,
  unMounted
}