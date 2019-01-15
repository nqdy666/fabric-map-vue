import { OBJ_POINT } from './constants'

export default {
  props: {
    clickActiveFillColor: {
      type: String,
      default: 'red'
    },
    allowActiveAreaOnClick: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initAreaDistinguish () {
      this.canvas.on('mouse:down', this.handleCanvasMouseDownForAreaDistinguish)
      this.canvas.on('mouse:up', this.handleCanvasMouseUpForAreaDistinguish)
      this.canvas.on('mouse:dblclick', this.handleCanvasMouseDbClickForAreaDistinguish)
    },
    handleCanvasMouseDownForAreaDistinguish (opt) {
      if (opt && opt.subTargets && opt.subTargets.length > 0) {
        if (opt.subTargets[0].mType && opt.subTargets[0].mType === OBJ_POINT) {
          this.$emit('pointClick', { info: opt.subTargets[0].mPointInfo }, opt.subTargets[0], opt)
        } else {
          this.$emit('areaClick', { id: opt.subTargets[0].id }, opt.subTargets[0], opt)
        }
        if (this.allowActiveAreaOnClick) {
          this._distinguishTargetOriginInfo = {
            fill: opt.subTargets[0].fill
          }
          opt.subTargets[0].set('fill', this.clickActiveFillColor)
          this.canvas.requestRenderAll()
        }
      }
    },
    handleCanvasMouseUpForAreaDistinguish (opt) {
      if (opt && opt.subTargets && opt.subTargets.length > 0) {
        Object.keys(this._distinguishTargetOriginInfo || {}).forEach(key => {
          console.log(key, this._distinguishTargetOriginInfo[key])
          opt.subTargets[0].set(key, this._distinguishTargetOriginInfo[key])
        })
        this._distinguishTargetOriginInfo = {}
        this.canvas.requestRenderAll()
      }
    },
    handleCanvasMouseDbClickForAreaDistinguish (opt) {
      if (opt && opt.subTargets && opt.subTargets.length > 0) {
        if (opt.subTargets[0].mType && opt.subTargets[0].mType === OBJ_POINT) {
          this.$emit('pointDbClick', { info: opt.subTargets[0].mPointInfo }, opt.subTargets[0], opt)
        } else {
          this.$emit('areaDbClick', { id: opt.subTargets[0].id }, opt.subTargets[0], opt)
        }
      }
    }
  }
}
