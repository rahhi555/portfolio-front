import { onMounted, onUnmounted } from '@nuxtjs/composition-api'

export class AddEventSpaceKey {
  public isSpaceKeyPress: boolean

  constructor() {
    this.isSpaceKeyPress = false
  }

  private spaceKeyPress = (e: KeyboardEvent) => {
    e.preventDefault()
    if(e.code === 'Space') {
      this.isSpaceKeyPress = true
    }
  }

  private unSpaceKeyPress = (e: KeyboardEvent) => {
    if(e.code === 'Space') {
      this.isSpaceKeyPress = false
    }
  }

  private mounted = onMounted(() => {
    window.addEventListener('keypress', this.spaceKeyPress, false)
    window.addEventListener('keyup', this.unSpaceKeyPress, false)
  })

  private unMounted = onUnmounted(() => {
    window.removeEventListener('keypress', this.spaceKeyPress, false)
    window.removeEventListener('keyup', this.unSpaceKeyPress, false)
  })
}
