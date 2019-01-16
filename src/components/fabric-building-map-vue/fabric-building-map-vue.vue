<template>
  <div class="fm-b-wrapper">
    <fabric-map-vue
        v-if="mapData"
        :svg-map-url="mapData.svgMapUrl" 
        :point-list="mapData.pointList"
        :map-width="mapData.mapWidth"
        :map-height="mapData.mapHeight"
        :map-unit="mapData.mapUnit"
        :heatmapOptions="mapData.heatmapOptions"
        :heatmap-min="mapData.heatmapMin"
        :heatmap-max="mapData.heatmapMax"
        :heatmap-data="mapData.heatmapData"
        :zoom-type="mapData.zoomType"
        :max-zoom="mapData.maxZoom"
        :min-zoom="mapData.minZoom"
        :zoom-rate="mapData.zoomRate"
        :click-active-fill-color="mapData.clickActiveFillColor"
        :allow-active-area-on-click="mapData.allowActiveAreaOnClick"
        @pointClick="handlePointClick"
        @pointDbClick="handlePointDbClick"
        @areaClick="handleAreaClick"
        @areaDbClick="handleAreaDbClick">
      </fabric-map-vue>
  </div>
</template>
<script>
import FabricMapVue from '../fabric-map-vue/fabric-map-vue'

// 从树找到ID的节点
function getItemFromTreeById (tree, id) {
  function travalNode (node) {
    if (node.id === id) return node
    if (node.children && node.children.length) {
      for (const item of node.children) {
        const res = travalNode(item)
        if (res && res.id === id) return res
      }
    }
  }
  return travalNode(tree)
}

export default {
  components: {
    FabricMapVue
  },
  props: {
    buildData: {
      type: Object,
      default () {
        return {
          // id: 2,
          // svgMapUrl: 'https://qiniu.qjzd.net/cf.svg',
          // pointList: [
          //   { id: 1, coordX: 0.30141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
          //   { zoomThreshold: 0.5, id: 2, coordX: 0.6944213, coordY: 0.55121297, type: 'text', fill: 'red', text: '餐饮  店', fontSize: 16, angle: 10, underline: true },
          //   { coordX: 0.0016652789342214821, coordY: 0.5929919137466307, id: 3}
          // ],
          // heatmapData: [{"coordX":0.058284762697751874,"coordY":0.3706199460916442},{"coordX":0.15736885928393005,"coordY":0.3706199460916442},{"coordX":0.2206494587843464,"coordY":0.3706199460916442},{"coordX":0.24313072439633637,"coordY":0.35983827493261455},{"coordX":0.24895920066611157,"coordY":0.3490566037735849},{"coordX":0.2514571190674438,"coordY":0.33153638814016173},{"coordX":0.25228975853455454,"coordY":0.31805929919137466},{"coordX":0.2514571190674438,"coordY":0.3086253369272237},{"coordX":0.2456286427976686,"coordY":0.2991913746630728},{"coordX":0.23980016652789343,"coordY":0.29784366576819404},{"coordX":0.2373022481265612,"coordY":0.29649595687331537},{"coordX":0.23563696919233973,"coordY":0.29649595687331537},{"coordX":0.23813488759367193,"coordY":0.3005390835579515},{"coordX":0.24229808492922564,"coordY":0.3059299191374663},{"coordX":0.2547876769358868,"coordY":0.316711590296496},{"coordX":0.2664446294754371,"coordY":0.3247978436657682},{"coordX":0.27643630308076605,"coordY":0.33423180592991913},{"coordX":0.28309741881765194,"coordY":0.34097035040431267},{"coordX":0.28642797668609493,"coordY":0.3504043126684636},{"coordX":0.28642797668609493,"coordY":0.35444743935309975},{"coordX":0.28642797668609493,"coordY":0.36253369272237196},{"coordX":0.28642797668609493,"coordY":0.3706199460916442},{"coordX":0.28559533721898417,"coordY":0.37870619946091644},{"coordX":0.28309741881765194,"coordY":0.38409703504043125},{"coordX":0.28309741881765194,"coordY":0.3867924528301887},{"coordX":0.2839300582847627,"coordY":0.40161725067385445},{"coordX":0.29308909242298087,"coordY":0.4299191374663073},{"coordX":0.31973355537052456,"coordY":0.48247978436657685},{"coordX":0.3638634471273938,"coordY":0.5512129380053908},{"coordX":0.42714404662781014,"coordY":0.6199460916442049}],
          // children: [
          //   {
          //     id: 1,
          //     svgMapUrl: 'https://vve.qiniu.qjzd.net/FjX8v4j87gKoqHLeKTfcRyxxdm7t',
          //     pointList: [
          //       { id: 2, coordX: 0.40141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
          //     ],
          //     heatmapData: [{"coordX":0.58284762697751874,"coordY":0.3706199460916442, value: 100 }]
          //   }
          // ]
        }
      }
    },
    value: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    mapData () {
      return this.value
    }
  },
  mounted () {
    if (!this.mapData) this.emitValue(this.buildData)
  },
  methods: {
    handleAreaClick (data) {
      this.$emit('areaClick', data, this.mapData)
    },
    handleAreaDbClick (data) {
      this.$emit('areaDbClick', data, this.mapData)
      if (data.id) {
        const node = getItemFromTreeById(this.buildData, data.id)
        if (node) {
          this.emitValue(node)
        }
      }
    },
    handlePointClick (data) {
      this.$emit('pointClick', data, this.mapData)
    },
    handlePointDbClick(data) {
      this.$emit('pointDbClick', data, this.mapData)
      // if (data.info && data.info.id) {
      //   const node = getItemFromTreeById(this.buildData, data.info.id)
      //   if (node) {
      //     this.emitValue(node)
      //   }
      // }
    },
    emitValue (mapData) {
      this.$emit('input', mapData)
    }
  },
  watch: {
    buildData (val) {
      if (!this.mapData) this.emitValue(this.buildData)
    }
  }
}
</script>
<style>
  .fm-b-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
