<template>
  <div>
    <input
      id="search-bar"
      type="text"
      placeholder="キーワード検索"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    map: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const map = props.map as google.maps.Map
    let autocomplete: google.maps.places.Autocomplete

    onMounted(() => {
      const searchBar = document.getElementById('search-bar') as HTMLInputElement
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: 'jp' },
        fields: ["geometry"],
      }
      autocomplete = new google.maps.places.Autocomplete(searchBar, options)
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchBar)
      autocomplete.addListener('place_changed', () => {
        const latlng = autocomplete.getPlace().geometry?.location
        if(!latlng) return
        map.setCenter(latlng)
      })
    })

    onUnmounted(() => {
      map.controls[google.maps.ControlPosition.TOP_CENTER].pop()
    })

    return {
    }
  },
})
</script>

<style scoped lang="sass">
#search-bar
  width: 50%
  height: 40px
  font-size: 16px
  margin-top: 20px
  border: 1px solid #ddd
  border-radius: 3px
  background-color: white
</style>
