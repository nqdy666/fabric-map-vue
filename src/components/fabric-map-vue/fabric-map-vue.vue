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
import { POINT_TYPE_ENUM } from './constants'
import fabricHeatmapMixin from './fabric-heatmap'
import fabricZoom from './fabric-zoom'
import fabricPointLine from './fabric-point-line'
import './fabric-map-vue.scss'
import FabricReizeableCavas from './fabric-resizeable-canvas'
import DirBtn from './dir-btn'

const OBJ_POINT = 'point'

// 过滤key
function filterObjByKeys(arrKeys = [], obj = {}) {
  return arrKeys.reduce((val, key) => {
    if (obj[key] !== undefined) val[key] = obj[key]
    return val
  }, {})
}

export default {
  mixins: [fabricHeatmapMixin, fabricZoom, fabricPointLine],
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
    pointList () {
      this.renderPoints()
      this.canvas && this.canvas.requestRenderAll()
    },
    backgroundColor (val) {
      this.canvas && (this.canvas.backgroundColor = val)
      this.canvas && this.canvas.requestRenderAll()
    },
  },
  async mounted () {
    await this.draw()
    this.initPointLine()
    this.initZoom()
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
      var canvas = new FabricReizeableCavas(this.$el.querySelector("#map-canvas"), { parentEl: this.$el.querySelector('.fm-map-wrapper') })
      canvas.backgroundColor = this.backgroundColor
      canvas.selection = false
      this.canvas = canvas

      await this.renderSvgMap(this.svgMapUrl)

      canvas.on('mouse:down', this.handleCanvasMouseDown)
      canvas.on('object:scaling', this.handleCanvasScaling)
      canvas.on('object:moving', this.handleCanvasMoving)
      canvas.on('mouse:up', this.handleCanvasMouseUp)
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
      let point
      if (mPointInfo.type === POINT_TYPE_ENUM.IMG) {
        point = await this.loadImage(mPointInfo.url, filterObjByKeys(
          ["angle","stroke","strokeWidth","fill","backgroundColor","opacity"], mPointInfo))
      } else if (mPointInfo.type === POINT_TYPE_ENUM.TEXT) {
        point = new fabric.IText(mPointInfo.text, filterObjByKeys(
          [
            "angle","stroke","strokeWidth","fill",
            "fontFamily","fontSize","fontWeight","fontStyle",
            "underline","overline","linethrough","deltaY",
            "textBackgroundColor", "backgroundColor","opacity"
          ],
          mPointInfo
        ))
      } else {
        return // 如果不是要求的类型，不显示
      }
      point.originX = 'center'
      point.originY = 'bottom'
      point.hasControls = false
      point.hasBorders = false
      point.lockRotation = true
      point.mPointInfo = Object.keys(mPointInfo).length > 0 ? mPointInfo : undefined
      point.mType = OBJ_POINT
      point.set(options)
      point.setCoords()
      this.initPointEvents(point)
      return point
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
        if (pointImage) {
          this.svgMap.add(pointImage)
          this.canvas.requestRenderAll()
        }
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
    // 支持缓存
    async loadImage (imageUrl, options) {
      if (!this.imagePointCached) this.imagePointCached = {}
      return new Promise((resolve, reject) => {
        if (this.imagePointCached[imageUrl]) {
          this.imagePointCached[imageUrl].clone(cloned => {
            resolve(cloned)
          })
        } else {
          fabric.Image.fromURL(imageUrl, img => {
            this.imagePointCached[imageUrl] = img
            this.imagePointCached[imageUrl].clone(cloned => {
              resolve(cloned)
            })
          }, options)
        }
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
      this.canvas.discardActiveObject()
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
      this.rememberRelationShip()
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
        const { x, y } = this.invertPointer(opt.pointer)
        const pointImage = await this.makePointImageObj({
          left: x,
          top: y
        })
        if (pointImage) {
          this.canvas.add(pointImage)
          this.canvas.bringToFront(pointImage)
          this.selectedPoint = null
          this.activePoint = pointImage
          this.updatePointLine() // 强制更新线条，并且接口第一次点击偶尔会不显示图标的问题
        }
      }
    },
    handleSvgMapMouseDown (opt) {
      // 备份点击状态下的位置，用于判断move状态还是click状态
      this.mouseDownSvgMapPointer = { left: this.svgMap.left, top: this.svgMap.top }
      if (this.activePoint) {
        this.updatePointLine()
      }
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
    // 当canvas画布本身进行了变化，事件的点坐标也需要进行变换
    invertPointer ({ x, y } = {}) {
      const mInverse = fabric.util.invertTransform(this.canvas.viewportTransform)
      const newPoint = fabric.util.transformPoint({ x, y }, mInverse)
      return newPoint
    },
    // 获取相对于svg图的比例坐标
    point2svgRelativeRateInfo ({ x, y } = {}, absoulte) {
      if (absoulte) {
         // canvas viewport发生变换，也需要反向计算出基于canvas变换后新的位置
        const mInverse = fabric.util.invertTransform(this.canvas.viewportTransform)
        const newPoint = fabric.util.transformPoint({ x, y }, mInverse)
        x = newPoint.x
        y = newPoint.y
      }
      const coordY = (y - this.svgMap.top) / this.svgMap.getScaledHeight()
      const coordX = (x - this.svgMap.left) / this.svgMap.getScaledWidth()
      return { coordX, coordY }
    },
    // svg图的比例坐标转换成canvas坐标点
    svgRateInfo2Point ({ coordX, coordY } = {}, absoulte) {
      let x = Math.round(coordX * this.svgMap.getScaledWidth() + this.svgMap.left)
      let y = Math.round(coordY * this.svgMap.getScaledHeight() + this.svgMap.top)
      // canvas viewport发生变换，也需要计算出基于canvas变换后新的位置
      if (absoulte) {
        const newPoint = fabric.util.transformPoint({ x, y }, this.canvas.viewportTransform)
        x = Math.floor(newPoint.x)
        y = Math.floor(newPoint.y)
      }
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
        this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
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