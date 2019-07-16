const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/fabric-map-vue/'
  }
} : {
  router: {
    base: '/'
  }
}

module.exports = Object.assign(routerBase, {
  srcDir: __dirname,
  server: {
    port: 3001, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  build: {
    extractCSS: true,
    cssSourceMap: true,
    // postcss: [],
    extend (config) {
      config.devtool = 'source-map'
    }
  },

  loading: {
    color: '#59cc93'
  },

  manifest: {
    name: 'fabric map vue',
    description: 'fabric map with Vue.js',
    theme_color: '#563d7c'
  },

  generate: {
    dir: 'docs-dist'
  },

  plugins: [
    { src: '~plugins/fabric-map-vue.js', ssr: false }
  ],

  modules: [
    '@nuxtjs/pwa'
  ],

  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
    ],
    script: [
      { src: routerBase.router.base + 'js/fabric.js' },
    ]
  },
  css: [
    '~assets/css/app.scss'
  ]
})
