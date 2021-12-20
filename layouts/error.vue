<template>
  <div style="margin: auto; text-align: center;">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/dashboard/plans">
      Home page
    </NuxtLink>
  </div>
</template>

<script>
import { defineComponent, inject, onUnmounted, onMounted } from '@nuxtjs/composition-api'
import { HasErrorKey } from '~/types/injection-key'

export default defineComponent({
  props: {
    error: {
      type: Object,
      default: null
    }
  },

  setup() {
    const hasError = inject(HasErrorKey)

    onMounted(() => {
      hasError.value = true
    })

    onUnmounted(() => {
      hasError.value = false
    })

    return {
      pageNotFound: 'ページが存在しません',
      otherError: 'エラーが発生しました'
    }
  },

  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
