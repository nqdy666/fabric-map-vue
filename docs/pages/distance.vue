<template>
  <div class="container layout-rl">
    <div class="op-wrapper">
      <div class="section">
        <p class="tip">提示说明</p>
        <ul>
          <li>
            <p>点击点，会绘制改点到最近svg图层的上下左右的线。</p>
          </li>
          <li>
            <p>线上回标识距离信息，距离信息根据地图的比例*高度（宽度）进行换算得来。</p>
          </li>
        </ul>
      </div>
      <div class="section">
        <p class="tip">属性编辑</p>
        <div>
          <p>宽度：</p>
          <input type="number" v-model="mapWidth" />
        </div>
        <div>
          <p>高度：</p>
          <input type="number" v-model="mapHeight" />
        </div>
        <div>
          <p>单位：</p>
          <input type="text" v-model="mapUnit" />
        </div>
        <div>
          <p>是否显示线：</p>
          <input type="checkbox" v-model="showLine" />
        </div>
      </div>
    </div>
    <div class="map-wrapper">
      <fabric-map-vue
        :svg-map-url="svgMapUrl"
        :map-width="mapWidth"
        :map-height="mapHeight"
        :map-unit="mapUnit"
        :show-line="showLine"
        :point-list="pointList"
      ></fabric-map-vue>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      svgMapUrl: "https://qiniu.qjzd.net/cf.svg",
      mapWidth: 200,
      mapHeight: 100,
      mapUnit: "m",
      showLine: true,
      pointList: [
        {
          id: 1,
          coordX: 0.30141547,
          coordY: 0.55013478,
          type: "img",
          url: "http://vve.qiniu.qjzd.net/Fgjso-fDXte_VzkvQS2n2d_Fb5uw"
        },
        {
          type: "img",
          url: "http://vve.qiniu.qjzd.net/FuDI3JgWy-1YMlVDCcOiL5ZuzIZI",
          coordX: 0.5056159494127854,
          coordY: 0.35076244510206794,
          id: 5
        },
        {
          type: "img",
          url: "http://vve.qiniu.qjzd.net/Fgjso-fDXte_VzkvQS2n2d_Fb5uw",
          angle: 10,
          coordX: 0.7675189090676184,
          coordY: 0.7379224549035871,
          id: 6
        },
        {
          type: "img",
          url: "http://vve.qiniu.qjzd.net/Fgjso-fDXte_VzkvQS2n2d_Fb5uw",
          angle: 30,
          coordX: 0.4972895547416779,
          coordY: 0.7134186568148835,
          id: 7
        }
      ]
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.container,
.map-wrapper {
  height: 100%;
  position: relative;
}
</style>
