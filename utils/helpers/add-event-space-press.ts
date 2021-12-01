import { onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'

const isSpaceKeyPress = ref(false)

const spaceKeyPress = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    isSpaceKeyPress.value = true
  }
}

const unSpaceKeyPress = (e: KeyboardEvent) => {
  
  if (e.code === 'Space') {
     isSpaceKeyPress.value = false
  }
}

export default {
  isSpaceKeyPress,

  mounted() {
    onMounted(() => {
      window.addEventListener('keypress', spaceKeyPress, false)
      window.addEventListener('keyup', unSpaceKeyPress, false)
    })
  },

  unMounted() {
    onUnmounted(() => {
      window.removeEventListener('keypress', spaceKeyPress, false)
      window.removeEventListener('keyup', unSpaceKeyPress, false)
    })
  },
}
