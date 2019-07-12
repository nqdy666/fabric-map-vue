<template>
  <div class="container layout-rl">
    <div class="op-wrapper">
      <div class="section">
        <p class="tip">提示说明</p>
        <ul>
          <li><p>canvas缩放是画布整体缩放，通过滚轮会沿着鼠标焦点缩放</p></li>
          <li><p>svg图片缩放是svg地图本身缩放，原点在svg图片左上角</p></li>
        </ul>
      </div>
      <div class="section">
        <p class="tip">属性编辑</p>
        <p>缩放类型</p>
        <select v-model="zoomType" placeholder="请选择">
          <option :value="1">canvas缩放</option>
          <option :value="2">svg图片缩放</option>
        </select>
      </div>
    </div>
    <div class="map-wrapper">
      <fabric-map-vue
        :svg-map-url="svgMapUrl" 
        :zoom-type="zoomType"
      ></fabric-map-vue>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zoomType: 1,
      svgMapUrl: 'https://qiniu.qjzd.net/cf.svg',
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
.container,
.map-wrapper {
  height: 100%;
  position: relative;
}
</style>
