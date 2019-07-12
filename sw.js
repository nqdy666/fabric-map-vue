importScripts('/fabric-map-vue/_nuxt/workbox.4c4f5ca6.js')



workbox.precaching.precacheAndRoute([
  {
    "url": "/fabric-map-vue/_nuxt/09c75918bc129a184caf.js",
    "revision": "e4156d57f64d59f83afaf223b1b22270"
  },
  {
    "url": "/fabric-map-vue/_nuxt/296339a253806675247f.js",
    "revision": "4bb98319cd06ae4cb5b3e3f0bc60c95d"
  },
  {
    "url": "/fabric-map-vue/_nuxt/3e8c12211255312b1f2e.js",
    "revision": "a265221249064ba80415b59b8356476e"
  },
  {
    "url": "/fabric-map-vue/_nuxt/413ff65d9efb16ad25e4.js",
    "revision": "57e9025501731969b3e4f6f5bdc3409a"
  },
  {
    "url": "/fabric-map-vue/_nuxt/91b7d363b8687063f812.css",
    "revision": "29432a0c1cd1bcb5608fb3af0e7973d2"
  },
  {
    "url": "/fabric-map-vue/_nuxt/9270370e39a1b1c7649e.js",
    "revision": "1f8150718fe54819d08cd1e572205772"
  },
  {
    "url": "/fabric-map-vue/_nuxt/9c5b474add055f906709.js",
    "revision": "e88adb75a962bb969f0a7c34e99fc0d0"
  },
  {
    "url": "/fabric-map-vue/_nuxt/a47e4f085f7c973f1337.css",
    "revision": "0e16a03320057fc99c9750ecfb44b7b1"
  },
  {
    "url": "/fabric-map-vue/_nuxt/b256bbf3881232ef0977.css",
    "revision": "2afbf2c1f2f1e86d818acc056b04cc2c"
  },
  {
    "url": "/fabric-map-vue/_nuxt/b93d2fdcc6833c039a61.css",
    "revision": "9eab1056c87352f9a5253187f2d9fc96"
  },
  {
    "url": "/fabric-map-vue/_nuxt/b984da60cc3f94c9f459.js",
    "revision": "67a6fed44680609c367624746268216c"
  },
  {
    "url": "/fabric-map-vue/_nuxt/c723aa07bf4cc2e48b4f.js",
    "revision": "00fe46c8ea7bed5424b8e77a398d8aa8"
  },
  {
    "url": "/fabric-map-vue/_nuxt/d3b2c4c5512ca88e4105.css",
    "revision": "131e2b6f692ca43c3b84f2b33bae9607"
  },
  {
    "url": "/fabric-map-vue/_nuxt/dfa6f8bcd668c47b3c6c.css",
    "revision": "c5c30e9f591d8f4c1e48117876e8e05b"
  },
  {
    "url": "/fabric-map-vue/_nuxt/e311fe41f2a2d4a8e2f1.css",
    "revision": "0f6895b7428e28faf1342e29a326f316"
  },
  {
    "url": "/fabric-map-vue/_nuxt/f6d741e5b8cb22a8febc.js",
    "revision": "7710d65d42e536bfbfbb8c50ad9d2c11"
  },
  {
    "url": "/fabric-map-vue/_nuxt/fb55cd31e98e43e07c8e.js",
    "revision": "b940c3747e31bfbfd43e0b2cd4cbd2ad"
  }
], {
  "cacheId": "fabric-map-vue",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/fabric-map-vue/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/fabric-map-vue/.*'), workbox.strategies.networkFirst({}), 'GET')





