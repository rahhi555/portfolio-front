export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns#',
    },
    titleTemplate: '%s - minimap',
    title: 'minimap',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Minimapは位置情報を組み合わせた新しいTodoリストです。todoはリアルタイムに仲間と共有され、マップ上に反映されます。現場で働く作業員、イベントスタッフなどの方にぴったりです。',
      },
      { name: 'format-detection', content: 'telephone=no' },

      { hid: 'og:site_name', property: 'og:site_name', content: 'minimap' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://www.minimap.work' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'minimap(ミニマップ)「場所」と「情報」を共有する新しいタスクツール',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Minimapは位置情報を組み合わせた新しいTodoリストです。todoはリアルタイムに仲間と共有され、マップ上に反映されます。現場で働く作業員、イベントスタッフなどの方にぴったりです。',
      },
      { hid: 'og:image', property: 'og:image', content: 'https://www.minimap.work/ogp_image.jpg' },

      { hid: 'fb:app_id', property: 'fb:app_id', content: '646306193077394' },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@6MvpqmS7ThQbuBc' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

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
    dirs: ['~/components', '~/components/protected'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    ['@nuxt/typescript-build', { typeCheck: false }],
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    'unplugin-vue2-script-setup/nuxt',
    '@nuxtjs/device',
    ['unplugin-auto-import/nuxt', { imports: ['@nuxtjs/composition-api'] }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dayjs',
    'nuxt-webfontloader',
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

  webfontloader: {
    google: {
      families: ['Domine', 'Noto+Sans+JP:wght@300'],
    },
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
      DONE_COLOR: 'rgba(82,245,54,0.6)',
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'minimap',
      title: 'minimap',
      'og:title': 'minimap',
      description:
        'Minimapは位置情報を組み合わせた新しいTodoリストです。todoはリアルタイムに仲間と共有され、マップ上に反映されます。現場で働く作業員、イベントスタッフなどの方にぴったりです。',
      'og:description':
        'Minimapは位置情報を組み合わせた新しいTodoリストです。todoはリアルタイムに仲間と共有され、マップ上に反映されます。現場で働く作業員、イベントスタッフなどの方にぴったりです。',
      lang: 'ja',
      theme_color: '#4f68ab',
      background_color: '#b7e5fc',
    },
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
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
    },
  },

  serverMiddleware: [{ path: '/server', handler: '~/server' }],

  loading: '~/components/Loading.vue',
}
