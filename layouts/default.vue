<template>
  <v-app>
    <v-main>
      <v-img
        :key="src"
        :src="require(`@/assets/${src}`)"
        dark
        gradient="to top, #00000080, #00000080"
        min-height="100vh"
        :height="$vuetify.breakpoint.mdAndUp ? '100vh' : undefined"
      >
        <div :class="[$vuetify.breakpoint.mdAndUp && 'fill-height']" class="d-block d-md-flex">
          <AppBar v-if="!hasError" />

          <MaterialSnackbar
            :type="snackParams.color"
            timeout="4000"
            v-bind="{
              center: true,
              top: true,
            }"
          >
            {{ snackParams.message }}
          </MaterialSnackbar>

          <SmartphoneSideway />

          <Nuxt keep-alive />

          <Footer />
        </div>
      </v-img>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { SnackbarStore } from '~/store'
import { HasErrorKey } from '~/types/injection-key'

const route = useRoute()
const srcs = {
  '/auth/login': 'login.jpg',
  '/auth/register': 'register.jpg',
}
const src = computed(() => {
  return srcs[route.value.path] || 'top-image.jpg'
})

const snackParams = computed({
  get: () => SnackbarStore.snackParams,
  set: () => SnackbarStore.hidden(),
})

const hasError = ref(false)
provide(HasErrorKey, hasError)
</script>

<script lang="ts">
import AppBar from '~/components/default/AppBar.vue'
import Footer from '~/components/default/Footer.vue'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'

export default {
  components: {
    AppBar,
    Footer,
    MaterialSnackbar,
  },

  middleware: ['handle-login-route'],
}
</script>
