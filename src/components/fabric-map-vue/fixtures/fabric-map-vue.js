window.app = new Vue({
  el: '#app',
  data: {
    pointList: [
      {
        id: 1,
        coordX: 0.30141547,
        coordY: 0.55013478,
        type: "img",
        url: "http://vve.qiniu.qjzd.net/Fgjso-fDXte_VzkvQS2n2d_Fb5uw"
      },
      {
        zoomThreshold: 0.5,
        id: 2,
        coordX: 0.6944213,
        coordY: 0.55121297,
        type: "text",
        fill: "red",
        text: "餐饮店",
        fontSize: 16,
        angle: 10,
        underline: true
      }
    ]
  }
})
