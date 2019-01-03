<template>
  <div class="index">
    <fabric-map-vue :svg-map-url="svgMapUrl" :change-cb="handleChange" :delete-cb="handleDelete" :point-list="pointList" :map-width="300" :map-height="100" :map-unit="mapUnit"></fabric-map-vue>
  </div>
</template>

<style src="./index.css"></style>

<script>
export default {
  data () {
    return {
      svgMapUrl: 'https://qiniu.qjzd.net/cf.svg',
      pointList: [
        { id: 1, coordX: 0.30141547, coordY: 0.55013478, type: 2 },
        { id: 2, coordX: 0.6944213, coordY: 0.55121297 },
      ],
      mapUnit: 'm'
    }
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
    }
  }
}
</script>
<style scoped>
  .index {
    width: 100%;
    height: 100%;
  }
</style>
