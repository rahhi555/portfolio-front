import { onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'

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

export const isSpaceKeyPress = ref(false)

export const mounted = () => {
  onMounted(() => {
    window.addEventListener('keypress', spaceKeyPress, false)
    window.addEventListener('keyup', unSpaceKeyPress, false)
  })
}

export const unMounted = () => {
  onUnmounted(() => {
    window.removeEventListener('keypress', spaceKeyPress, false)
    window.removeEventListener('keyup', unSpaceKeyPress, false)
  })
}
