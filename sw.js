importScripts('/fabric-map-vue/_nuxt/workbox.4c4f5ca6.js')



workbox.precaching.precacheAndRoute([
  {
    "url": "/fabric-map-vue/_nuxt/01d1d5840947afdfff2d.js",
    "revision": "13a7f4700c7c9abbf9ea5b20edd4e3b1"
  },
  {
    "url": "/fabric-map-vue/_nuxt/263fa48e23f7644e1fb4.js",
    "revision": "0879a3a4f5a4d734f0ecd9c142a3620b"
  },
  {
    "url": "/fabric-map-vue/_nuxt/296339a253806675247f.js",
    "revision": "4bb98319cd06ae4cb5b3e3f0bc60c95d"
  },
  {
    "url": "/fabric-map-vue/_nuxt/3058b923b4bdb1e526de.js",
    "revision": "5d80849996d59584c1465b117b1fb48f"
  },
  {
    "url": "/fabric-map-vue/_nuxt/3e8c12211255312b1f2e.js",
    "revision": "a265221249064ba80415b59b8356476e"
  },
  {
    "url": "/fabric-map-vue/_nuxt/53f3d321c387a8f5cae7.js",
    "revision": "077ce189ae712b542fd1d84da2a1163f"
  },
  {
    "url": "/fabric-map-vue/_nuxt/5a307b6ede86dd381ab6.js",
    "revision": "284259a9a738d9100f095cfd50902a33"
  },
  {
    "url": "/fabric-map-vue/_nuxt/6c98354469cf3fb33236.js",
    "revision": "eb17ee2475e02a49af4b0f130e5b86df"
  },
  {
    "url": "/fabric-map-vue/_nuxt/6d006fbf231f2583811f.css",
    "revision": "62e7156233e91a6ff6238aad6d18ca9d"
  },
  {
    "url": "/fabric-map-vue/_nuxt/76f0057af0b6fbb6f089.css",
    "revision": "54d1c368486ba6b184dd6857b4d65dd4"
  },
  {
    "url": "/fabric-map-vue/_nuxt/9270370e39a1b1c7649e.js",
    "revision": "1f8150718fe54819d08cd1e572205772"
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
    "url": "/fabric-map-vue/_nuxt/d04ff888785893e72995.css",
    "revision": "b5175a8f5ce34d33db7d0919b0aa0b96"
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
    "url": "/fabric-map-vue/_nuxt/e22f0188055d738e299a.js",
    "revision": "71752338ac0078a6607df588be8f1143"
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





