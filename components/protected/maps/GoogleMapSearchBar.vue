<template>
  <div>
    <input id="search-bar" type="text" placeholder="キーワード検索" data-tutorial="input-google-map-search" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ map: google.maps.Map }>()

const map = props.map as google.maps.Map
let autocomplete: google.maps.places.Autocomplete

onMounted(() => {
  const searchBar = document.getElementById('search-bar') as HTMLInputElement
  const options: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'jp' },
    fields: ['geometry'],
  }
  autocomplete = new google.maps.places.Autocomplete(searchBar, options)
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchBar)

  /**
   * 通常オートコンプリートを選択しないと検索できず、フォーム上でエンターキーを押しても位置情報を得ることができないが、
   * その場合にJavaScript側でオートコンプリートの最初の項目を選択する
   */
  autocomplete.addListener('place_changed', () => {
    const latlng = autocomplete.getPlace().geometry?.location

    const autocompleteResult = document.getElementsByClassName('pac-item')

    // 検索値が見つからない(フォームでエンターを押した場合)かつオートコンプリートが出現していれば、下キーとエンターを強制的に押下させ、再度イベントを発生させる
    if (!latlng && autocompleteResult.length) {
      const arrowDownEvent = new KeyboardEvent('keydown', { keyCode: 40, key: 'ArrowDown' })
      const enterEvent = new KeyboardEvent('keydown', { keyCode: 13, key: 'Enter' })
      searchBar.dispatchEvent(arrowDownEvent)
      searchBar.dispatchEvent(enterEvent)
      return
    }

    if (!latlng) return

    map.setCenter(latlng)
  })
})

onUnmounted(() => {
  map.controls[google.maps.ControlPosition.TOP_CENTER].pop()
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
