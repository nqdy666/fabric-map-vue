<template>
  <div class="container layout-rl">
    <div class="op-wrapper">
      <div class="section">
        <p class="tip">提示说明</p>
        <ul>
          <li><p>设置背景色</p></li>
        </ul>
      </div>
      <div class="section">
        <p class="tip">属性编辑</p>
        <div>
          <p>背景色</p>
          <input type="text" v-model="backgroundColor" />
        </div>
      </div>
    </div>
    <div class="map-wrapper">
      <fabric-map-vue
        :svg-map-url="svgMapUrl"
        :background-color="backgroundColor"
      ></fabric-map-vue>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backgroundColor: '#3995F7',
      svgMapUrl: "https://qiniu.qjzd.net/cf.svg",
    };
  },
  mounted() {},
  methods: {
  }
};
</script>
<style scoped>
.container,
.map-wrapper {
  height: 100%;
  position: relative;
}
.textarea {
  width: 100%;
}
</style>
