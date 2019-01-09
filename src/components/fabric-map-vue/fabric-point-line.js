import FabricArrowLine from './fabric-arrow-line'

const OBJ_POINT = 'point'

export default {
  props: {
    mapWidth: {
      type: Number,
      default: 0
    },
    mapHeight: {
      type: Number,
      default: 0
    },
    mapUnit: {
      type: String,
      default: 'm'
    },
    showLine: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 在组件挂载的时候会被调用
    initPointLine () {
      this.lineX = new FabricArrowLine([0, 0, 0, 0])
      this.lineY = new FabricArrowLine([0, 0, 0, 0])
      this.linxRightX = new FabricArrowLine([0, 0, 0, 0])
      this.linxRightY = new FabricArrowLine([0, 0, 0, 0])

      this.canvas.add(this.lineX)
      this.canvas.add(this.lineY)
      this.canvas.add(this.linxRightX)
      this.canvas.add(this.linxRightY)
    },
    updateLine (point, isPointInGroup) {
      if (!this.showLine) {
        return this.clearLine()
      }

      const svgMap = this.svgMap
      const self = this
      let { left, top } = svgMap
      let scaledWidth = svgMap.getScaledWidth()
      let scaleHeight = svgMap.getScaledHeight()

      // 如果是点在group中的，就需要进行坐标转换
      if (isPointInGroup) {
        const newPoint = this.svgMap2CanvasPoint({ x: point.left, y: point.top })
        point = { left: newPoint.x, top: newPoint.y }
      }

      // 查找包括住基站点的块
      const wrapperObjs = []
      svgMap.forEachObject(item => {
        // 过滤基站点
        if (item.mType && item.mType === OBJ_POINT) return
        // 画一个点线，用这个电线判断是否在图形中
        const testPoint = new fabric.Line([point.left, point.top, point.left, point.top])
        // 坐标转换 计算出块的范围
        const scaledWidth = item.width * svgMap.scaleX
        const scaleHeight = item.height * svgMap.scaleY
        const newPoint = this.svgMap2CanvasPoint({x: item.left, y: item.top })
        const pointBR = new fabric.Point(newPoint.x + scaledWidth, newPoint.y + scaleHeight)
        if (testPoint.isContainedWithinRect(newPoint, pointBR)) {
          wrapperObjs.push(item)
        }
      })

      // 根据块的宽度，来取最近包围的块
      const minObj = wrapperObjs.reduce((min, item) => {
        if (!min) return item
        if (item.width < min.width) {
          min = item
        }
        return min
      }, undefined)

      // 如果有最近包含的块，设置划线的作用域块
      if (minObj) {
        const newPoint = this.svgMap2CanvasPoint({x: minObj.left, y: minObj.top})
        left = newPoint.x
        top = newPoint.y
        scaledWidth = minObj.width * svgMap.scaleX
        scaleHeight = minObj.height * svgMap.scaleY
      }
      
      const mapWidth = this.mapWidth
      const mapHeight = this.mapHeight
      const mapUnit = this.mapUnit
      
      // 划线
      self.lineX.set({ x1: left, y1: point.top, x2: point.left, y2: point.top })
      self.lineY.set({ x1: point.left, y1: top, x2: point.left, y2: point.top })
      self.linxRightX.set({ x2: point.left, y2: point.top, x1: left + scaledWidth, y1: point.top })
      self.linxRightY.set({ x2: point.left, y2: point.top, x1: point.left, y1: top + scaleHeight })
      // 设置线的text X
      const lineXText = ((self.lineX.getLength() / this.svgMap.getScaledWidth()) * mapHeight).toFixed(2)
      self.lineX.text = lineXText ? `${lineXText}${mapUnit}` : ''
      // 设置线的text  Y
      const lineYText = ((self.lineY.getLength() / this.svgMap.getScaledHeight()) * mapWidth).toFixed(2)
      self.lineY.text = lineYText ? `${lineYText}${mapUnit}` : ''
      // 设置线的text RX
      const lineRXText = ((self.linxRightX.getLength() / this.svgMap.getScaledWidth()) * mapHeight).toFixed(2)
      self.linxRightX.text = lineRXText ? `${lineRXText}${mapUnit}` : ''
      // 设置线的text  RY
      const lineRYText = ((self.linxRightY.getLength() / this.svgMap.getScaledHeight()) * mapWidth).toFixed(2)
      self.linxRightY.text = lineRYText ? `${lineRYText}${mapUnit}` : ''

      self.lineX.setCoords()
      self.lineY.setCoords()
      self.linxRightX.setCoords()
      self.linxRightY.setCoords()
      self.canvas.discardActiveObject()
      self.canvas.bringToFront(self.lineX)
      self.canvas.bringToFront(self.lineY)
      self.canvas.bringToFront(self.linxRightX)
      self.canvas.bringToFront(self.linxRightY)
      self.canvas.requestRenderAll()
    },
    clearLine () {
      const self = this
      self.lineX.set({ x1: 0, y1: 0, x2: 0, y2: 0 })
      self.lineY.set({ x1: 0, y1: 0, x2: 0, y2: 0 })
      self.linxRightX.set({ x1: 0, y1: 0, x2: 0, y2: 0 })
      self.linxRightY.set({ x1: 0, y1: 0, x2: 0, y2: 0 })
      self.lineX.setCoords()
      self.lineY.setCoords()
      self.linxRightX.setCoords()
      self.linxRightY.setCoords()
      self.canvas.requestRenderAll()
    },
    updatePointLine () {
      this.updateActivePointLine()
      this.updateSelectedPointLine()
    },
    updateActivePointLine () {
      if (this.activePoint) {
        this.activePoint.scale(this.svgMap.scaleX) // 随着地图的方法缩放而缩放
        this.updateLine(this.activePoint)
      }
    },
    updateSelectedPointLine () {
      if (this.selectedPoint) {
        this.updateLine(this.selectedPoint, true)
      }
    },
  },
  watch: {
    mapWidth () {
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
    mapHeight () {
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
    mapUnit () {
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
  }
}
