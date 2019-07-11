<template>
  <div class="index">
    <div class="map-wrapper">
      <fabric-map-vue
        v-if="showMap"
        :svg-map-url="svgMapUrl" 
        :change-cb="handleChange"
        :delete-cb="handleDelete"
        :point-list="pointList"
        :map-width="300"
        :map-height="100"
        :map-unit="mapUnit"
        :show-op="showOp"
        :zoom-type="zoomType"
        :heatmap-data="heatmapData"
        @heatmapAdd="handleHeatmapAdd"
        @pointClick="handlePointClick"
        @areaClick="handleAreaClick"></fabric-map-vue>
    </div>
    <div class="op-wrapper">
      <label><input type="checkbox" v-model="showMap"/>显示地图</label>
      &nbsp;<label><input type="checkbox" v-model="showOp"/>显示操作</label>
      &nbsp;<select v-model="zoomType" placeholder="缩放类型"><option :value="1">canvas缩放</option><option :value="2">svg地图缩放</option></select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showMap: true,
      showOp: false,
      zoomType: 1,
      svgMapUrl: 'https://qiniu.qjzd.net/cf.svg',
      pointList: [
        { id: 1, coordX: 0.30141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
        { zoomThreshold: 0.5, id: 2, coordX: 0.6944213, coordY: 0.55121297, type: 'text', fill: 'red', text: '餐饮  店', fontSize: 16, angle: 10, underline: true },
        { coordX: 0.0016652789342214821, coordY: 0.5929919137466307, id: 3 },
        { 
          startPoints: [
            {
              "coordX": 0.24424091035248402,
              "coordY": 0.38933812518718175,
            },
            {
              "coordX": 0.15820149875104078,
              "coordY": 0.5091344713986223,
            },
            {
              "coordX": 0.32750485706355814,
              "coordY": 0.4941599281221922,
            }
          ],
          type: 'area', id: 4
        }, {
          type: 'area',
          id: 5,
          absolute: true,
          startPoints: [{"x":1210.2708333333335,"y":297.7391666666667},{"x":1171.3816666666667,"y":322.51092592592596},{"x":1226.340925925926,"y":371.47462962962965},{"x":1210.3527777777779,"y":300.52722222222224},{"x":1189.3683333333333,"y":329.50574074074075},{"x":1198.3616666666667,"y":323.5101851851852},{"x":1209.3535185185185,"y":302.52574074074073},{"x":1210.2708333333335,"y":297.7391666666667}]
        }
      ],
      mapUnit: 'm',
      // heatmapData: [],
      heatmapData: [{"coordX":0.058284762697751874,"coordY":0.3706199460916442},{"coordX":0.15736885928393005,"coordY":0.3706199460916442},{"coordX":0.2206494587843464,"coordY":0.3706199460916442},{"coordX":0.24313072439633637,"coordY":0.35983827493261455},{"coordX":0.24895920066611157,"coordY":0.3490566037735849},{"coordX":0.2514571190674438,"coordY":0.33153638814016173},{"coordX":0.25228975853455454,"coordY":0.31805929919137466},{"coordX":0.2514571190674438,"coordY":0.3086253369272237},{"coordX":0.2456286427976686,"coordY":0.2991913746630728},{"coordX":0.23980016652789343,"coordY":0.29784366576819404},{"coordX":0.2373022481265612,"coordY":0.29649595687331537},{"coordX":0.23563696919233973,"coordY":0.29649595687331537},{"coordX":0.23813488759367193,"coordY":0.3005390835579515},{"coordX":0.24229808492922564,"coordY":0.3059299191374663},{"coordX":0.2547876769358868,"coordY":0.316711590296496},{"coordX":0.2664446294754371,"coordY":0.3247978436657682},{"coordX":0.27643630308076605,"coordY":0.33423180592991913},{"coordX":0.28309741881765194,"coordY":0.34097035040431267},{"coordX":0.28642797668609493,"coordY":0.3504043126684636},{"coordX":0.28642797668609493,"coordY":0.35444743935309975},{"coordX":0.28642797668609493,"coordY":0.36253369272237196},{"coordX":0.28642797668609493,"coordY":0.3706199460916442},{"coordX":0.28559533721898417,"coordY":0.37870619946091644},{"coordX":0.28309741881765194,"coordY":0.38409703504043125},{"coordX":0.28309741881765194,"coordY":0.3867924528301887},{"coordX":0.2839300582847627,"coordY":0.40161725067385445},{"coordX":0.29308909242298087,"coordY":0.4299191374663073},{"coordX":0.31973355537052456,"coordY":0.48247978436657685},{"coordX":0.3638634471273938,"coordY":0.5512129380053908},{"coordX":0.42714404662781014,"coordY":0.6199460916442049}]
    }
  },
  mounted () {
  },
  methods: {
    handleChange (data) {
      if (!data.id){
        data.id = Math.max.apply(null, this.pointList.map(item => item.id).concat(0)) + 1
        this.pointList.push(data)
      } else {
        const point = this.pointList.find(item => item.id === data.id)
        this.pointList.splice(this.pointList.indexOf(point), 1, data)
      }
    },
    handleDelete (data) {
      const point = this.pointList.find(item => item.id === data.id)
      this.pointList.splice(this.pointList.indexOf(point), 1)
    },
    handleHeatmapAdd (data) {
      this.heatmapData.push(data)
    },
    handlePointClick (info) {
      console.log('point', info)
    },
    handleAreaClick (info) {
      console.log('area', info)
    }
  }
}
</script>
<style scoped>
  .index,.map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .op-wrapper {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 2;
    background: transparent;
  }
</style>
