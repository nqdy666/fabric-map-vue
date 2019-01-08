<template>
  <div class="fm-svg-map-wrapper" :style="{'background-color': backgroundColor}">
    <div class="fm-map-wrapper">
      <canvas id="map-canvas" class="fm-m-canvas"></canvas>
    </div>
    <!-- 放大缩小 -->
    <div class="fm-zoom-btn-wrapper">
      <i @click="handleZoomOutBtnClick" class="fm-icon-plus"></i>
      <i @click="handleZoomInBtnClick" class="fm-icon-minus"></i>
    </div>
    <!-- 添加基站按钮 -->
    <div class="fm-add-btn-wrapper" v-show="showAddPointBtn">
      <i class="fm-icon-plus-circle" @click="handleAddPointBtnClick"></i>
    </div>
    <!-- 扫码删除按钮 -->
    <div class="fm-op-btn-wrapper" v-show="showOpBtnWrapper">
      <i class="fm-icon-delete" @click="handleDelBtnClick" v-show="showDeleteBtn"></i>
      <i class="fm-icon-lock" v-show="lockBtn" @click="handleLockBtnClick" v-if="showLockBtn"></i>
      <i class="fm-icon-unlock" v-show="!lockBtn" @click="handleUnLockBtnClick" v-if="showLockBtn"></i>
    </div>
    <!-- 山下左右的按钮 -->
    <dir-btn v-show="showDirBtn" @change="handleDirBtnClick"></dir-btn>
    <!-- 添加信息 -->
    <div class="fm-add-tip-wrapper" v-show="addTipInfoShow">
      <p>请在地图中点击以添加点</p>
    </div>
    <div class="fm-reload-wrapper">
      <i class="fm-icon-reload" @click="handleReloadBtnClick"></i>
    </div>
  </div>
</template>
<script>
import fabricHeatmapMixin from './fabric-heatmap'
import './fabric-map-vue.scss'
import FabricReizeableCavas from './fabric-resizeable-canvas'
import FabricArrowLine from './fabric-arrow-line'
import DirBtn from './dir-btn'

const DEFAULT_ZOOM_STEP = 0.1

const OBJ_POINT = 'point'

// 点的类型
const POINT_TYPE = {
  NORMAL: 1,
  ACTIVE: 2,
}

// 点的图标
const POINT_ICON = {
  [POINT_TYPE.NORMAL]: 'http://vve.qiniu.qjzd.net/FlMiBGKRZHyNtFL03ZCWv5ucIlCw',
  [POINT_TYPE.ACTIVE]: 'http://vve.qiniu.qjzd.net/Fn4PgPav04qGpPzpIDw_1qyK9F5Y'
}

export default {
  mixins: [fabricHeatmapMixin],
  components: {
    DirBtn
  },
  props: {
    svgMapUrl: {
      type: String,
      default: 'https://qiniu.qjzd.net/cf.svg'
    },
    pointList: {
      type: Array,
      default () {
        return [
        ]
      }
    },
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
    changeCb: {
      type: Function,
      default () {
        return () => {}
      }
    },
    deleteCb: {
      type: Function,
      default () {
        return () => {}
      }
    },
    movingMinion: {
      type: Boolean,
      default: false
    },
    scalingMinion: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#17171A'
    },
    pointSvgImageUrl: {
      type: String,
      default: POINT_ICON[POINT_TYPE.NORMAL]
    },
    pointActiveSvgImageUrl: {
      type: String,
      default: POINT_ICON[POINT_TYPE.ACTIVE]
    }
  },
  data () {
    return {
      addTipInfoShow: false,
      activePoint: undefined,
      selectedPoint: undefined
    }
  },
  computed: {
    lockBtn () {
      return !this.activePoint
    },
    showLockBtn () {
      const point = (this.selectedPoint || this.activePoint)
      return point
    },
    showOpBtnWrapper () {
      return !!(this.selectedPoint || this.activePoint)
    },
    showDeleteBtn () {
      const point = (this.activePoint || this.selectedPoint)
      return point
    },
    showAddPointBtn () {
      return !(this.selectedPoint || this.activePoint) && !this.addTipInfoShow
    },
    showDirBtn () {
      return !!this.activePoint
    },
    pointInfo () {
      return (this.selectedPoint && this.selectedPoint.mPointInfo) || {}
    },
    mPointList () {
      return this.pointList
    },
  },
  watch: {
    svgMapUrl (val) {
      this.renderSvgMap(val)
    },
    pointSvgImageUrl () {
      this.renderPoints()
    },
    pointActiveSvgImageUrl () {
      this.renderPoints()
    },
    pointList () {
      this.renderPoints()
      this.canvas && this.canvas.requestRenderAll()
    },
    mapWidth () {
      this.clearLine()
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
    mapHeight () {
      this.clearLine()
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
    mapUnit () {
      this.clearLine()
      this.updatePointLine()
      this.canvas && this.canvas.requestRenderAll()
    },
    backgroundColor (val) {
      this.canvas && (this.canvas.backgroundColor = val)
      this.canvas && this.canvas.requestRenderAll()
    },
  },
  async mounted () {
    await this.draw()
    this.initHeatMap()
  },
  beforeDestroy () {
    this.canvas && this.canvas.destroy()
  },
  methods: {
    async callFun(name, ...arg) {
      this.$emit(name.replace('Cb', ''), ...arg)
      if (this[name] && this[name].then) await this[name](...arg)
      else this[name] && this[name](...arg)
    },
    // 保存点坐标信息
    async savePointInfo (data = {}) {
      await this.callFun('changeCb', data)
      return data
    },
    async draw () {
      this.lineX = new FabricArrowLine([0, 0, 0, 0])
      this.lineY = new FabricArrowLine([0, 0, 0, 0])
      this.linxRightX = new FabricArrowLine([0, 0, 0, 0])
      this.linxRightY = new FabricArrowLine([0, 0, 0, 0])

      var canvas = new FabricReizeableCavas(this.$el.querySelector("#map-canvas"), { parentEl: this.$el.querySelector('.fm-map-wrapper') })
      canvas.backgroundColor = this.backgroundColor
      canvas.selection = false
      this.canvas = canvas

      await this.renderSvgMap(this.svgMapUrl)

      canvas.add(this.lineX)
      canvas.add(this.lineY)
      canvas.add(this.linxRightX)
      canvas.add(this.linxRightY)
      canvas.on('mouse:down', this.handleCanvasMouseDown)
      canvas.on('object:scaling', this.handleCanvasScaling)
      canvas.on('object:moving', this.handleCanvasMoving)
      canvas.on('mouse:up', this.handleCanvasMouseUp)
      canvas.on('mouse:wheel', this.handleCanvasMousewheel)
    },
    // 清除点信息
    clearPoints () {
      for (let item of this.svgMap.getObjects()) {
        if (item.mType && item.mType === OBJ_POINT) {
          this.svgMap.remove(item)
        }
      }
    },
    // 创建point image对象
    async makePointImageObj (data = {}) {
      const { mPointInfo = {}, ...options } = data 
      const img = await this.loadImage(mPointInfo.type === POINT_TYPE.ACTIVE ? this.pointActiveSvgImageUrl : this.pointSvgImageUrl)
      img.originX = 'center'
      img.originY = 'bottom'
      img.hasControls = false
      img.hasBorders = false
      img.lockRotation = true
      img.mPointInfo = Object.keys(mPointInfo).length > 0 ? mPointInfo : undefined
      img.mType = OBJ_POINT
      img.set(options)
      img.setCoords()
      this.initPointEvents(img)
      return img
    },
    // 渲染点的信息
    async renderPoints () {
      this.clearPoints()
      // 初始化从接口来的点
      for (const pointInfo of this.mPointList) {
        const { coordX, coordY } = pointInfo
        const { x, y } = this.svgRateInfo2Point({ coordX, coordY })
        // 坐标点转换
        const newPoint = this.canvas2SvgMapPoint({ x, y })
        const pointImage = await this.makePointImageObj({
          mPointInfo: pointInfo,
          left:  newPoint.x,
          top: newPoint.y
        })
        this.svgMap.add(pointImage)
        this.canvas.requestRenderAll()
      }
    },
    // 渲染svgmap，如果已经初始化，就销毁，重新初始化
    async renderSvgMap (svgMapUrl) {
      if (this.svgMap) {
        this.handleReloadBtnClick()
        this.canvas.remove(this.svgMap)
        this.svgMap.destroy()
      }
      this.svgMap = await this.loadSvgMap(svgMapUrl)
      this.svgMap.hasControls = false
      this.svgMap.hasBorders = false
      this.svgMap.on('mousedown', this.handleSvgMapMouseDown)
      this.svgMap.on('mouseup', this.handleSvgMapMouseUp)
      this.svgMap.on('mousemove', this.handleSvgMapMouseMove)
      this.svgMap.on('scaling', this.handleSvgMapScaling) // info 通过api scale设置不会触发
      this.svgMap.on('scaled', this.handleSvgMapScaled) // info 通过api scale设置不会触发
      // 初始化位置
      this.initSvgMapPosition()
      // 重新渲染点
      await this.renderPoints ()

      this.canvas.add(this.svgMap)
    },
    async loadSvgMap (url) {
      return new Promise((resolve, reject) => {
        fabric.loadSVGFromURL(url, async (objects, options) => {
          const obj = fabric.util.groupSVGElements(objects, {
            ...options,
            lockRotation: true,
            subTargetCheck: true
          })
          resolve(obj)
        })
      }, {
        crossOrigin: 'anonymous'
      })
    },
    // 根据屏幕大小，缩放到全部内容可以整个屏幕展示
    initSvgMapPosition () {
      const parentEl = this.$el.querySelector('.fm-map-wrapper')
      const clientWidth = parentEl.clientWidth
      const clientHeight = parentEl.clientHeight
      const defaultScale = Math.min( clientWidth / this.svgMap.width, clientHeight / this.svgMap.height).toFixed(1)
      this.svgMap.scale(defaultScale)
      this.svgMap.top = Math.floor(clientHeight / 2 - this.svgMap.getScaledHeight() / 2)
      this.svgMap.left = Math.floor(clientWidth / 2 - this.svgMap.getScaledWidth() / 2)
      this.svgMap.setCoords()
      this.canvas.fire('object:scaling', { target: this.svgMap })
      this.svgMap.fire('scaling')
    },
    async loadImage (imageUrl, options) {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(imageUrl, img => {
          resolve(img)
        }, options)
      })
    },
    limitActivePointPosition () {
      if (!this.svgMap) return
      if (!this.activePoint) return
      // 参考 https://codepen.io/elifitch/pen/RPEEOJ
      const movingBox = this.activePoint
      const boundingBox = this.svgMap
      var topBound = boundingBox.top;
      var bottomBound = topBound + boundingBox.getScaledHeight();
      var leftBound = boundingBox.left;
      var rightBound = leftBound + boundingBox.getScaledWidth();
      const movingBoxWidth = movingBox.getScaledWidth()
      const movingBoxHeight = movingBox.getScaledHeight()
      movingBox.left = (Math.min(Math.max(movingBox.left, leftBound + movingBoxWidth / 2), rightBound - movingBoxHeight / 2));
      movingBox.top = (Math.min(Math.max(movingBox.top, topBound + movingBoxHeight), bottomBound));
      movingBox.setCoords()
      this.canvas.requestRenderAll()
    },
    // 记住图和点的矩阵关系
    rememberRelationShip () {
      if (this.activePoint && this.svgMap) {
        const bossTransform = this.svgMap.calcTransformMatrix()
        const invertedBossTransform = fabric.util.invertTransform(bossTransform)
        this.activePoint.relationship = fabric.util.multiplyTransformMatrices(invertedBossTransform, this.activePoint.calcTransformMatrix())
      }
    },
    // 限制点
    updateMinions () {
      if (this.activePoint && this.svgMap && this.activePoint.relationship) {
        const o = this.activePoint
        const boss = this.svgMap
        const relationship = o.relationship;
        const newTransform = fabric.util.multiplyTransformMatrices(
          boss.calcTransformMatrix(),
          relationship
        );
        const opt = fabric.util.qrDecompose(newTransform);
        o.set({
          flipX: false,
          flipY: false,
        });
        o.setPositionByOrigin(
          { x: opt.translateX, y: opt.translateY },
          'center',
          'center'
        );
        o.set(opt);
        o.setCoords();
      }
    },
    handleCanvasMouseDown () {
      this.rememberRelationShip()
    },
    handleCanvasScaling (e) {
      if (this.scalingMinion) this.updateMinions()
      this.limitActivePointPosition()
    },
    handleCanvasMoving (opt) {
      if (opt.target === this.svgMap) {
         if (this.movingMinion) this.updateMinions()
      }
      this.updatePointLine()
      this.limitActivePointPosition()
    },
    handleCanvasMouseUp (opt) {
      if (this.selectedPoint && !opt.target) {
        this.selectedPoint = null
        this.clearLine()
      }
    },
    handleCanvasMousewheel (opt) {
      if (this.svgMap) {
         const delta = opt.e.deltaY;
        let scale = Number(this.svgMap.scaleX)
        scale = scale + -(delta / 1000)
        if (scale > 20) scale = 20
        if (scale < 0.1) scale = 0.1
        this.svgMap.scale(scale)
        this.svgMap.fire('scaling')
        this.canvas.fire('object:scaling', { target: this.svgMap })
        this.canvas.requestRenderAll()
      }
    },
    async handleSvgMapMouseUp (opt) {
      // 根据坐标来判断，当前是处于拖动状态，还是点击状态
      if (this.svgMap.left === this.mouseDownSvgMapPointer.left
        && this.svgMap.top === this.mouseDownSvgMapPointer.top) {
        // 如果进入点击状态，取消选中状态
        if (this.selectedPoint) {
          this.selectedPoint = null
          this.clearLine()
        }
        // 只有在进入到可点击状态才能允许放入位置点
        if (!this.addTipInfoShow) return
        this.addTipInfoShow = false
        const { x, y } = opt.pointer
        const pointImage = await this.makePointImageObj({
          left: x,
          top: y
        })
        this.canvas.add(pointImage)
        this.canvas.bringToFront(pointImage)
        this.selectedPoint = null
        this.activePoint = pointImage
        this.updatePointLine() // 强制更新线条，并且接口第一次点击偶尔会不显示图标的问题
      }
    },
    handleSvgMapMouseDown (opt) {
      // 备份点击状态下的位置，用于判断move状态还是click状态
      this.mouseDownSvgMapPointer = { left: this.svgMap.left, top: this.svgMap.top }
    },
    handleSvgMapMouseMove (opt) {
    },
    handleSvgMapScaling (opt) {
      this.updatePointLine()
    },
    handleSvgMapScaled () {
      this.updatePointLine()
    },
    initPointEvents (point) {
      const self = this
      point.on('mousedown', function (opt) {
      })
      point.on('mousemove', function (opt) {
        self.updatePointLine()
      })
      point.on('mouseup', function (opt) {
        if (!self.activePoint) {
          self.selectedPoint = point
        }
      })
    },
    updateLine (svgMap, point, isPointInGroup) {
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
        this.updateLine(this.svgMap, this.activePoint)
      }
    },
    removeActivePoint () {
      if (this.activePoint) {
        this.canvas.remove(this.activePoint)
        this.clearLine()
        this.activePoint = null
      }
    },
    removeSelectPoint () {
      if (this.selectedPoint) {
        this.svgMap.remove(this.selectedPoint)
        this.clearLine()
        this.selectedPoint = null
      }
    },
    updateSelectedPointLine () {
      if (this.selectedPoint) {
        this.updateLine(this.svgMap, this.selectedPoint, true)
      }
    },
    addActivePointToSvgMap () {
      if (this.activePoint) {
        const scaleX = this.svgMap.scaleX

        const newPoint = this.canvas2SvgMapPoint({x: this.activePoint.left, y: this.activePoint.top })

        this.activePoint.scale(1)
        this.activePoint.left = newPoint.x
        this.activePoint.top = newPoint.y
        this.activePoint.setCoords()
        // 加入到group中
        this.svgMap.add(this.activePoint)
      }
    },
    handleZoomOutBtnClick () {
      if (!this.svgMap) return
      if (this.activePoint) this.rememberRelationShip()
      const { scaleX } = this.svgMap
      this.svgMap.scale(Number(scaleX) + DEFAULT_ZOOM_STEP)
      this.canvas.fire('object:scaling', { target: this.svgMap })
      this.svgMap.fire('scaling')
      this.updatePointLine()
      this.canvas.requestRenderAll()
    },
    handleZoomInBtnClick () {
      if (!this.svgMap) return
      if (this.activePoint) this.rememberRelationShip()
      const { scaleX } = this.svgMap
      this.svgMap.scale(Math.max(Number(scaleX) - DEFAULT_ZOOM_STEP, 0.1))
      this.canvas.requestRenderAll()
      this.canvas.fire('object:scaling', { target: this.svgMap })
      this.svgMap.fire('scaling')
      this.updatePointLine()
    },
    handleAddPointBtnClick () {
      this.addTipInfoShow = true
    },
    async handleDelBtnClick () {
      const point = this.activePoint || this.selectedPoint
      if (point) {
        point.mPointInfo && await this.callFun('deleteCb', point.mPointInfo)
        this.removeActivePoint()
        this.removeSelectPoint()
      }
    },
    // 获取相对于svg图的比例坐标
    point2svgRelativeRateInfo ({ x, y } = {}) {
      const coordY = (y - this.svgMap.top) / this.svgMap.getScaledHeight()
      const coordX = (x - this.svgMap.left) / this.svgMap.getScaledWidth()
      return { coordX, coordY }
    },
    // svg图的比例坐标转换成canvas坐标点
    svgRateInfo2Point ({ coordX, coordY } = {}) {
      const x = Math.round(coordX * this.svgMap.getScaledWidth() + this.svgMap.left)
      const y = Math.round(coordY * this.svgMap.getScaledHeight() + this.svgMap.top)
      return { x, y }
    },
    // 保存节点
    async savePoint () {
      const point = this.activePoint || this.selectedPoint
      const isInSvgMap = point === this.selectedPoint
      let { left, top } = point
      if (isInSvgMap) {
        const newPoint = this.svgMap2CanvasPoint({ x: point.left, y: point.top })
        left = newPoint.x
        top = newPoint.y
      }
      const { coordX, coordY } = this.point2svgRelativeRateInfo({ x: left, y: top })
      const { mPointInfo = {} } = point
      const res = await this.savePointInfo({
        ...mPointInfo,
        coordX,
        coordY,
      })
    },
    async handleUnLockBtnClick () {
      // 保存点位信息并绑定进svg地图
      if (this.activePoint) {
        await this.savePoint()
        // 如果处于活跃状态，就绑定
        // this.addActivePointToSvgMap()
        this.removeActivePoint()
      }
    },
    // 选中点与地图解绑，之后可以拖动移动
    handleLockBtnClick () {
      if (this.selectedPoint) {
        this.svgMap.remove(this.selectedPoint)
        this.activePoint = this.selectedPoint
        this.selectedPoint = null 
        const point = this.activePoint
        point.hasControls = false
        point.hasBorders = false
        point.lockRotation = true
        const newPoint = this.svgMap2CanvasPoint({ x: point.left, y: point.top })
        point.leftBackup = newPoint.x
        point.topBackup = newPoint.y
        point.left = newPoint.x
        point.top = newPoint.y
        point.scale(this.svgMap.scaleX)
        point.setCoords()
        this.canvas.add(point)
      }
    },
    handleDirBtnClick (direction) {
      const obj = this.activePoint || this.selectedPoint
      if (direction === 'up') {
        obj.top -= 1
      } else if (direction === 'down') {
        obj.top += 1
      } else if (direction === 'left') {
        obj.left -= 1
      } else if (direction === 'right') {
        obj.left += 1
      }
      if (obj === this.selectedPoint) {
        // 更新group中的对象的位置，不会触发更新，故先删除再添加保证能够出发更新，不过因为没有边界判定，可能出现越界问题
        this.svgMap.remove(obj)
        this.svgMap.add(obj) // 可能超出边界
      }
      this.canvas.fire('object:moving', { target: obj })
      this.updatePointLine()
    },
    handleReloadBtnClick () {
      if (this.svgMap) {
        if (this.activePoint) {
          if (this.activePoint.leftBackup && this.activePoint.topBackup) {
            this.canvas.remove(this.activePoint)
            this.activePoint.left = this.activePoint.leftBackup
            this.activePoint.top = this.activePoint.topBackup
            this.addActivePointToSvgMap()
          } else {
             this.canvas.remove(this.activePoint)
          }
          this.activePoint = null
        }
        this.selectedPoint = null
        this.clearLine()
        this.initSvgMapPosition()
        this.canvas.requestRenderAll()
      }
    },
    // canvas中的点转换到svg图中的相对位置点
    // 转换到group中坐标 参考https://github.com/nqdy666/Fabric-Tutorial_zh-CN/blob/master/part-6.md
    canvas2SvgMapPoint ({ x, y } = {}) {
      let matrix = this.svgMap.calcTransformMatrix()
      const invertMatrix = fabric.util.invertTransform(matrix)
      return fabric.util.transformPoint({ x, y }, invertMatrix)
    },
    // svgMap中相对位置的点转换到canvas中
    svgMap2CanvasPoint ({ x, y } = {}) {
      let matrix = this.svgMap.calcTransformMatrix()
      return fabric.util.transformPoint({ x, y }, matrix)
    },
  }
}
</script>