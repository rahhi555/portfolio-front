export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - portfolio-front',
    title: 'portfolio-front',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.ts',
    '~/plugins/vee-validate.js',
    '~/plugins/auth.client.ts',
    '~/plugins/tutorial.client.ts',
    '~/plugins/actioncable.client.ts',
    '~/plugins/googlemap.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/protected'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/device',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dayjs'
  ],

  dayjs: {
    locales: ['ja'],
    defaultLocale: 'ja',
    defaultTimeZone: 'Asia/Tokyo',
    plugins: ['utc', 'timezone'],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://api:3000',
  },

  publicRuntimeConfig: {
    axios: {
      serverMiddlewareURL: process.env.SERVER_MIDDLEWARE_URL || 'http://localhost/server',
      browserBaseURL: process.env.BROWSER_BASE_URL || 'http://localhost:3000',
    },
    actioncable: process.env.ACTION_CABLE_URL || 'ws://localhost:3000/cable',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    mapId: process.env.NODE_ENV === 'production' ? '4e384070ccf92e35' : '4dc9698e063c78e7',
    rectColors: {
      NO_ATTACH_COLOR: 'rgba(225,222,227,0.5)',
      TODO_COLOR: 'rgba(127,124,128,0.5)',
      DOING_COLOR: 'rgba(212,252,172,0.5)',
      DONE_COLOR: 'rgba(82,245,54,0.6)'
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    },
  }, 

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: "svg-portfolio",
      title: "svg-portfolio",
      'og:title': 'svg-portfolio',
      description: 'svgを使用したポートフォリオです。',
      'og:description': 'svgを使用したポートフォリオです。',
      lang: 'ja',
      theme_color: "#529b58",
      background_color: "#bde0c0",
      display: "standalone",
      scope: "/",
      start_url: "/"
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // assetsに指定するとv-imgの際に SassError: this file is already being loaded
    // が発生するので別ディレクトリを指定
    customVariables: ['~/styles/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: '#E91E63',
          secondary: '#9C27b0',
          accent: '#e91e63',
          info: '#00CAE3',
          success: '#4CAF50',
          warning: '#FB8C00',
          error: '#FF5252',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      "vee-validate/dist/rules",
    ],
  },

  serverMiddleware: [
    { path: '/server', handler: '~/server' }
  ],

  loading: '~/components/Loading.vue',
}
