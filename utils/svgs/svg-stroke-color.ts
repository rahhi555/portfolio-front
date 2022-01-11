export const strokeColor = computed(() => {
  if(process.server) return 'black'

  const mapTypeId = window.$nuxt.context.$googleMap.map.value?.getMapTypeId()
  
  if(!mapTypeId || mapTypeId === google.maps.MapTypeId.ROADMAP || mapTypeId === google.maps.MapTypeId.TERRAIN) {
    return 'black'
  } else {
    // 自動で傾きを付けてしまうので解除する
    window.$nuxt.context.$googleMap.map.value.setTilt(0)
    return 'white'
  }
})