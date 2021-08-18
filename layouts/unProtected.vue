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
            v-model="snackbar"
            :type="'info'"
            timeout="-1"
            v-bind="{
              center: true,
              top: true,
            }"
          >
            Welcome to
            <span class="font-weight-bold"
              >&nbsp;MATERIAL DASHBOARD PRO&nbsp;</span
            >
            — a beautiful admin panel for every web developer.
          </MaterialSnackbar>

          <Nuxt />

          <Footer />
        </div>
      </v-img>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '~/components/unProtected/AppBar.vue'
import Footer from '~/components/unProtected/Footer.vue'
import MaterialSnackbar from '~/components/MaterialSnackbar.vue'

export default {
  components: {
    AppBar,
    Footer,
    MaterialSnackbar,
  },

  data: () => ({
    srcs: {
      '/auth/login': 'login.jpg',
      '/auth/register': 'register.jpg',
    },
    snackbar: true
  }),

  computed: {
    src() {
      return this.srcs[this.$route.path] || 'clint-mckoy.jpg'
    },
  },
}
</script>
