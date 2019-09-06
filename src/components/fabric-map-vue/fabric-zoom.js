import { OBJ_POINT, ZOOM_TYPE } from './constants'

const DEFAULT_ZOOM_STEP = 0.1

export default {
  props: {
    maxZoom: {
      type: Number,
      default: 5
    },
    minZoom: {
      type: Number,
      default: 0.1
    },
    zoomRate: {
      type: Number,
      default: 1000,
    },
    zoomType: {
      type: Number,
      default: ZOOM_TYPE.CANVAS
    }
  },
  methods: {
    initZoom () {
      this.canvas.on('mouse:wheel', this.handleCanvasMousewheelForZoom)
      this.canvas.on('object:scaling', this.handleCanvasObjectScalingForZoom)
    },
    handleCanvasObjectScalingForZoom (opt) {
      if (!this.svgMap) return
      const zoom = this.zoomType === ZOOM_TYPE.MAP ? this.svgMap.scaleX : this.canvas.getZoom()
      for (let item of this.svgMap.getObjects()) {
        if (item.mType && item.mType === OBJ_POINT && item.mPointInfo) {
          item.visible = !(item.mPointInfo.zoomThreshold && zoom < item.mPointInfo.zoomThreshold) // 缩小至某个值不显示
        }
      }
      this.canvas.requestRenderAll()
    },
    handleCanvasMousewheelForZoom (opt) {
      opt.e && opt.e.stopPropagation()
      if (this.svgMap) {
        const delta = opt.e.deltaY;
        if (this.zoomType === ZOOM_TYPE.MAP) {
          // svg scale, 缺点无法沿着鼠标点缩放，只能沿着originX,originY缩放
          let scale = Number(this.svgMap.scaleX)
          scale = scale + -(delta / this.zoomRate)
          if (scale > this.maxZoom) scale = this.maxZoom
          if (scale < this.minZoom) scale = this.minZoom
          this.svgMap.scale(scale)
          // svg scale end
        } else {
          // canvas zoom, 支持沿着中心点缩放
          if (opt.target === this.svgMap) {
            let zoom = this.canvas.getZoom()
            zoom = zoom + -(delta / this.zoomRate)
            if (zoom > this.maxZoom) zoom = this.maxZoom
            if (zoom < this.minZoom) zoom = this.minZoom
            this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
          }
        }
        this.canvas.fire('object:scaling', { target: this.svgMap })
        this.updatePointLine()
        this.canvas.requestRenderAll()
      }
    },
    handleZoomOutBtnClick () {
      if (!this.svgMap) return
      if (this.activePoint) this.rememberRelationShip()
      if (this.zoomType === ZOOM_TYPE.MAP) {
        const { scaleX } = this.svgMap
        this.svgMap.scale(Math.min(Number(scaleX) + DEFAULT_ZOOM_STEP, this.maxZoom))
      } else {
        this.canvas.setZoom(Math.min(Number(this.canvas.getZoom()) + DEFAULT_ZOOM_STEP, this.maxZoom))
      }
      this.canvas.fire('object:scaling', { target: this.svgMap })
      this.updatePointLine()
      this.canvas.requestRenderAll()
    },
    handleZoomInBtnClick () {
      if (!this.svgMap) return
      if (this.activePoint) this.rememberRelationShip()
      if (this.zoomType === ZOOM_TYPE.MAP) {
        const { scaleX } = this.svgMap
        this.svgMap.scale(Math.max(Number(scaleX) - DEFAULT_ZOOM_STEP, 0.1))
      } else {
        this.canvas.setZoom(Math.max(Number(this.canvas.getZoom()) - DEFAULT_ZOOM_STEP, this.minZoom))
      }
      this.canvas.fire('object:scaling', { target: this.svgMap })
      this.canvas.requestRenderAll()
      this.updatePointLine()
    }
  }
}
