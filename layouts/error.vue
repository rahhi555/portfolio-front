<template>
  <div style="margin: auto; text-align: center">
    <h1 v-if="error.statusCode === 404">ページが存在しません</h1>
    <h1 v-else>エラーが発生しました</h1>
    <p @click="replaceLocation" class="error-link"> Home page </p>
  </div>
</template>

<script setup lang="ts">
import { HasErrorKey } from '~/types/injection-key'
import { UserStore } from '~/store'

const hasError = inject(HasErrorKey)!

const router = useRouter()
const replaceLocation = () => {
  if(UserStore.isAuthenticated) {
    router.replace('/dashboard/plans')
  } else {
    router.replace('/')
  }
}

onMounted(() => {
  hasError.value = true
})

onUnmounted(() => {
  hasError.value = false
})
</script>

<script lang="ts">
export default {
  props: {
    error: {
      type: Object as () =>{ statusCode: number },
      default: null
    }
  },

  head () {
    const title: string =
    // @ts-ignore
      this.error.statusCode === 404 ? 'ページが存在しません' : 'エラーが発生しました'
    return { title }
    }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}

.error-link {
  text-decoration: underline;
  color: #e91e63;
  cursor: pointer;
}
</style>
