import h337 from 'heatmap.js'

export default {
  props: {
    heatmapOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    heatmapMin: {
      type: Number,
      default: 0
    },
    heatmapMax: {
      type: Number,
      default: 100
    },
    heatmapData: {
      type: Array,
      default () {
        return []
      }
    },
    heatmapClickDrawable: {
      type: Boolean,
      default: false
    },
    heatmapMoveDrawable: {
      type: Boolean,
      default: false
    },
    heatmapDrawValue: {
      type: Number,
      default: 1
    }
  },
  methods: {
    // 在组件挂载的时候会被调用
    initHeatMap () {
      this.heatmap = h337.create({
        container: this.$el.querySelector('.canvas-container')
      })
      this.renderHeatmap()
      this.canvas.on('mouse:down', this.handleCanvasMouseDownForHeatmap)
      this.canvas.on('object:scaling', this.handleCanvasScalingForHeatmap)
      this.canvas.on('object:moving', this.handleCanvasMovingForHeatmap)
    },
    handleCanvasMouseDownForHeatmap (opt) {
    },
    handleCanvasScalingForHeatmap (opt) {
      if (opt.target === this.svgMap) {
        this.renderHeatmap()
      }
    },
    handleCanvasMovingForHeatmap (opt) {
      if (opt.target === this.svgMap) {
        this.renderHeatmap()
      }
    },
    renderHeatmap () {
      const data = this.heatmapData.map(item => {
        const { coordX = 0, coordY = 0, ...rest } = item
        const { x, y } = this.svgRateInfo2Point({ coordX, coordY })
        return {
          x, y,
          ...rest
        }
      })
      this.heatmap && this.heatmap.setData({
        max: 5,
        data
      })
    },
    heatmapAddData (val) {
      return this.heatmap && this.heatmap.addData(val)
    },
    heatmapGetValueAt (val) {
      return this.heatmap && this.heatmap.getValueAt(val)
    },
    heatmapGetData () {
      return this.heatmap && this.heatmap.getData()
    },
    heatmapGetDataURL () {
      return this.heatmap && this.heatmap.getDataURL()
    },
    heatmapRepaint () {
      return this.heatmap && this.heatmap.repaint()
    },
  },
  watch: {
    heatmapData () {
      this.renderHeatmap()
    },
    heatmapOptions (val) {
      this.heatmap && this.heatmap.configure(val)
    },
    heatmapMin (val) {
      this.heatmap && this.heatmap.setDataMin(val)
    },
    heatmapMax (val) {
      this.heatmap && this.heatmap.setDataMax(val)
    }
  }
}
