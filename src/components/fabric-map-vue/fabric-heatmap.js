import h337 from 'heatmap.js'
import debounce from 'lodash.debounce'
import FabricArrowLine from './fabric-arrow-line';

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
      this.canvas.on('mouse:up', this.handleCanvasMouseUpForHeatmap)
      this.canvas.on('object:scaling', this.handleCanvasScalingForHeatmap)
      this.canvas.on('mouse:move', this.handleCanvasMouseMoveForHeatmap)
    },
    handleCanvasMouseUpForHeatmap (opt) {
      if (opt.target === this.svgMap) {
        if (this.heatmapClickDrawable && this.heatmap && opt.pointer) {
          // 根据坐标来判断，当前是处于拖动状态，还是点击状态
          if (this.svgMap.left === this.mouseDownSvgMapPointer.left
            && this.svgMap.top === this.mouseDownSvgMapPointer.top) {
              const { x, y } = opt.pointer
              this.requestCallAdd({ x, y })
            }
        }
      }
    },
    handleCanvasScalingForHeatmap (opt) {
      if (opt.target === this.svgMap) {
        this.renderHeatmap()
      }
    },
    handleCanvasMouseMoveForHeatmap (opt) {
      if (opt.target === this.svgMap) {
        if (this.heatmapMoveDrawable && this.heatmap && opt.pointer) {
          const { x, y } = opt.pointer
          this.requestCallAdd({ x, y })
        }
        this.renderHeatmap()
      }
    },
    requestCallAdd: debounce(function ({ x, y } = {}) {
      this.callAdd({ x, y })
    }, 15),
    callAdd ({ x, y } = {}) {
      const { coordX, coordY } = this.point2svgRelativeRateInfo({ x, y }, true)
      this.callFun('heatmapAddCb', { coordX, coordY, value: this.heatmapDrawValue })
    },
    renderHeatmap () {
      const data = this.heatmapData.map(item => {
        const { coordX = 0, coordY = 0, ...rest } = item
        let { x, y } = this.svgRateInfo2Point({ coordX, coordY }, true)
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
