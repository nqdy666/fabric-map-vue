<template>
  <div class="container layout-rl">
    <div class="op-wrapper">
      <div class="section">
        <p class="tip">提示说明</p>
        <ul>
          <li><p>支持图片、文本、多边形的显示。</p></li>
          <li><p><code>show-op</code>属性开启后，支持可视化在图上添加图片和文本。</p></li>
        </ul>
      </div>
      <div class="section">
        <p class="tip">属性编辑</p>
        <div>
          <p>显示操作</p>
          <input type="checkbox" v-model="showOp" />
        </div>
        <div>
          <p>点处于编辑状态时，是否移动时点位跟随</p>
          <input type="checkbox" v-model="movingMinion" />
        </div>
        <div>
          <p>点处于编辑状态时，是否缩放时点位跟随（缩放类型为svg图片缩放有效）</p>
          <input type="checkbox" v-model="scalingMinion" />
        </div>
        <div>
          <p>缩放类型</p>
          <select v-model="zoomType" placeholder="请选择">
            <option :value="1">canvas缩放</option>
            <option :value="2">svg图片缩放</option>
          </select>
        </div>
        <div>
          <p>点数据：</p>
          <textarea class="textarea" :rows="10" readonly :value="JSON.stringify(pointList)"></textarea>
        </div>
      </div>
    </div>
    <div class="map-wrapper">
      <fabric-map-vue
        :svg-map-url="svgMapUrl"
        @change="handleChange"
        @delete="handleDelete"
        :point-list="pointList"
        :show-op="showOp"
        :moving-minion="movingMinion"
        :scaling-minion="scalingMinion"
        :zoom-type="zoomType"
      ></fabric-map-vue>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showOp: false,
      movingMinion: false,
      scalingMinion: false,
      zoomType: 1,
      svgMapUrl: "https://qiniu.qjzd.net/cf.svg",
      pointList: [
        { 
          id: 123,
          type: 'imgtext',
          coordX: 0.2,
          coordY: 0.2,
          image: {
            url: "http://vve.qiniu.qjzd.net/Fgjso-fDXte_VzkvQS2n2d_Fb5uw",
            originX: 'center',
            originY: 'center',
            width: 20,
            height: 23,
            top: 0,
            left: 0,
          },
          text: {
            text: '12sdfsdf3',
            originX: 'center',
            originY: 'center',
            top: 25,
            left: 0,
            fontSize: 16,
          },
        },
        {
          id: 1,
          coordX: 0.5,
          coordY: 0.5,
          type: "img",
          // originX: 'left',
          // originY: 'top',
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
        },
        { coordX: 0.0016652789342214821, coordY: 0.5929919137466307, id: 3 },
        {
          startPoints: [
            {
              coordX: 0.24424091035248402,
              coordY: 0.38933812518718175
            },
            {
              coordX: 0.15820149875104078,
              coordY: 0.5091344713986223
            },
            {
              coordX: 0.32750485706355814,
              coordY: 0.4941599281221922
            }
          ],
          type: "area",
          id: 4
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleChange(data) {
      if (!data.id) {
        data.id =
          Math.max.apply(null, this.pointList.map(item => item.id).concat(0)) + 1;
        this.pointList.push(data);
      } else {
        const point = this.pointList.find(item => item.id === data.id);
        this.pointList.splice(this.pointList.indexOf(point), 1, data);
      }
    },
    handleDelete(data) {
      const point = this.pointList.find(item => item.id === data.id);
      this.pointList.splice(this.pointList.indexOf(point), 1);
    }
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
