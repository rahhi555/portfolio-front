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
        <div
          :class="[$vuetify.breakpoint.mdAndUp && 'fill-height']"
          class="d-block d-md-flex"
        >
          <AppBar />

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

<script>
import AppBar from '~/components/default/AppBar.vue'
import Footer from '~/components/default/Footer.vue'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'
import { SnackbarStore } from '~/store'

export default {
  components: {
    AppBar,
    Footer,
    MaterialSnackbar,
  },

  middleware: [
    'handle-login-route'
  ],

  data: () => ({
    srcs: {
      '/auth/login': 'login.jpg',
      '/auth/register': 'register.jpg',
    },
  }),

  computed: {
    src() {
      return this.srcs[this.$route.path] || 'top-image.jpg'
    },
    snackParams: {
      get() {
        return SnackbarStore.snackParams
      },
      set() {
        SnackbarStore.hidden()
      }
    }
  },
}
</script>
