<template>
  <div class="fm-b-wrapper">
    <fabric-map-vue
        v-if="mapData"
        :svg-map-url="mapData.svgMapUrl" 
        :background-color="mapData.backgroundColor"
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
    <div class="fm-b-back-wrapper" v-if="historyCount > 1">
      <i class="fm-icon-left-circle fm-b-back-icon" @click="handleBackBtnClick"></i>
    </div>
    <div class="fm-b-floor-wrapper" v-if="floorList">
      <ul class="fm-b-floor-list">
        <li class="fm-b-floor-item" 
          v-for="(item, index) of floorList" :key="index" @click="handleFloorClick(item)"
          :class="{active: item === mapData}">{{item.name}}</li>
      </ul>
    </div>  
  </div>
</template>
<script>
import FabricMapVue from '../fabric-map-vue/fabric-map-vue'
import './fabric-building-map-vue.css'

const TYPE_ENUM = {
  AREA: 1,
  BUILDING: 2,
  FLOOR: 3,
}

// 从树找到ID的节点
function getItemFromTreeById (tree, id) {
  let res
  function travalNode (node) {
    if (node.id === id) return node
    if (node.children && node.children.length) {
      for (const item of node.children) {
        if (item && item.id === id) {
          res = item
          return
        }
        travalNode(item)
      }
    }
  }
  travalNode(tree)
  return res
}

// 通过引用查询其父亲节点
function getParentFromTreeByRef (tree, data) {
  let res
  function travalNode (node) {
    if (node.children && node.children.length) {
      for (const item of node.children) {
        if (item && item === data) {
          res = node
          return
        }
        travalNode(item)
      }
    }
  }
  travalNode(tree)
  return res
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
          // id: 1,
          // type: TYPE_ENUM.AREA,
          // svgMapUrl: 'https://qiniu.qjzd.net/cf.svg',
          // pointList: [
          //   { id: 2, coordX: 0.30141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
          //   { zoomThreshold: 0.5, id: 2, coordX: 0.6944213, coordY: 0.55121297, type: 'text', fill: 'red', text: '餐饮  店', fontSize: 16, angle: 10, underline: true },
          //   { coordX: 0.0016652789342214821, coordY: 0.5929919137466307, id: 3}
          // ],
          // heatmapData: [{"coordX":0.058284762697751874,"coordY":0.3706199460916442},{"coordX":0.15736885928393005,"coordY":0.3706199460916442},{"coordX":0.2206494587843464,"coordY":0.3706199460916442},{"coordX":0.24313072439633637,"coordY":0.35983827493261455},{"coordX":0.24895920066611157,"coordY":0.3490566037735849},{"coordX":0.2514571190674438,"coordY":0.33153638814016173},{"coordX":0.25228975853455454,"coordY":0.31805929919137466},{"coordX":0.2514571190674438,"coordY":0.3086253369272237},{"coordX":0.2456286427976686,"coordY":0.2991913746630728},{"coordX":0.23980016652789343,"coordY":0.29784366576819404},{"coordX":0.2373022481265612,"coordY":0.29649595687331537},{"coordX":0.23563696919233973,"coordY":0.29649595687331537},{"coordX":0.23813488759367193,"coordY":0.3005390835579515},{"coordX":0.24229808492922564,"coordY":0.3059299191374663},{"coordX":0.2547876769358868,"coordY":0.316711590296496},{"coordX":0.2664446294754371,"coordY":0.3247978436657682},{"coordX":0.27643630308076605,"coordY":0.33423180592991913},{"coordX":0.28309741881765194,"coordY":0.34097035040431267},{"coordX":0.28642797668609493,"coordY":0.3504043126684636},{"coordX":0.28642797668609493,"coordY":0.35444743935309975},{"coordX":0.28642797668609493,"coordY":0.36253369272237196},{"coordX":0.28642797668609493,"coordY":0.3706199460916442},{"coordX":0.28559533721898417,"coordY":0.37870619946091644},{"coordX":0.28309741881765194,"coordY":0.38409703504043125},{"coordX":0.28309741881765194,"coordY":0.3867924528301887},{"coordX":0.2839300582847627,"coordY":0.40161725067385445},{"coordX":0.29308909242298087,"coordY":0.4299191374663073},{"coordX":0.31973355537052456,"coordY":0.48247978436657685},{"coordX":0.3638634471273938,"coordY":0.5512129380053908},{"coordX":0.42714404662781014,"coordY":0.6199460916442049}],
          // children: [
          //   {
          //     id: 2,
          //     type: TYPE_ENUM.BUILDING,
          //     children: [{
          //       id: 3,
          //       type: TYPE_ENUM.FLOOR,
          //       name: '1F',
          //       svgMapUrl: 'https://vve.qiniu.qjzd.net/FjX8v4j87gKoqHLeKTfcRyxxdm7t',
          //       pointList: [
          //         { id: 2, coordX: 0.40141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
          //       ],
          //       heatmapData: [{"coordX":0.58284762697751874,"coordY":0.3706199460916442, value: 100 }]
          //     },
          //     {
          //       id: 4,
          //       type: TYPE_ENUM.FLOOR,
          //       name: '2F',
          //       svgMapUrl: 'https://vve.qiniu.qjzd.net/FjX8v4j87gKoqHLeKTfcRyxxdm7t',
          //       pointList: [
          //         { id: 2, coordX: 0.40141547, coordY: 0.55013478, type: 'img', url: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw' },
          //       ],
          //       heatmapData: [{"coordX":0.78284762697751874,"coordY":0.3706199460916442, value: 100 }]
          //     }]
          //   }
          // ],
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
      historyMaps: [],
      historyCount: 0
    }
  },
  computed: {
    mapData () {
      return this.value
    },
    floorList () {
      if (this.mapData) {
        const parent = getParentFromTreeByRef(this.buildData, this.mapData)
        return parent && parent.children.filter(item => item.type === TYPE_ENUM.FLOOR)
      }
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
        if (node && node.type === TYPE_ENUM.BUILDING) {
          node = node.children[0]
        }
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
      if (data.info && data.info.id) {
        let node = getItemFromTreeById(this.buildData, data.info.id)
        if (node && node.type === TYPE_ENUM.BUILDING) {
          node = node.children[0]
        }
        if (node) {
          this.emitValue(node)
        }
      }
    },
    handleFloorClick (floor) {
      this.emitValue(floor)
    },
    handleBackBtnClick () {
      if (this.historyCount <= 1) return
      const mapData = this.historyMaps[this.historyCount - 2]
      this.historyCount--
      this.$emit('input', mapData)
    },
    emitValue (mapData) {
      this.$emit('input', mapData)
      this.historyMaps.push(mapData)
      this.historyCount++
    }
  },
  watch: {
    buildData (val) {
      if (!this.mapData) this.emitValue(this.buildData)
    }
  }
}
</script>
