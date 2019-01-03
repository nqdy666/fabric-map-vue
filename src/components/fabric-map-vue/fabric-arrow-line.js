const DEFAULT_OPTIONS = {
  selectable: false,
  strokeWidth: 2,
  evented: false,
  stroke: 'red',
  text: '',
  textStyle: 'red',
  // strokeDashArray: [5, 5],
}

export default class FabricArrowLine extends fabric.Line {
  constructor(points, options = {}) {
    super(points, {
      ...DEFAULT_OPTIONS,
      ...options
    })
  }
  // 获取线的长度
  getLength () {
    var p = this.calcLinePoints()
    const xDiff = p.x2 - p.x1
    const yDiff = p.y2 - p.y1
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
  }
  _render (ctx) {
    super._render(ctx)
    // 若果不显示或者坐标是一个点就不画箭头和文字
    var p = this.calcLinePoints()
    const xDiff = p.x2 - p.x1
    const yDiff = p.y2 - p.y1
    if (!this.visible || (!xDiff && !yDiff)) return
    
    const angle = Math.atan2(yDiff, xDiff)

    ctx.strokeStyle = this.stroke
    if (this.strokeDashArray) {
      ctx.setLineDash(this.strokeDashArray)
    }

     // 画开始箭头
    ctx.save()
    ctx.translate((p.x2 - p.x1) / 2, (p.y2 - p.y1) / 2)
    ctx.rotate(angle)
    ctx.moveTo(-8, 8)
    ctx.lineTo(0, 0)
    ctx.lineTo(-8, -8)
    ctx.stroke()
    ctx.restore()

    // 画结束箭头
    ctx.save()
    ctx.translate(-(p.x2 - p.x1) / 2, -(p.y2 - p.y1) / 2)
    ctx.rotate(angle)
    ctx.moveTo(8, 8)
    ctx.lineTo(0, 0)
    ctx.lineTo(8, -8)
    ctx.stroke()
    ctx.restore()
    // 添加文字
    ctx.save()
    // 保证文字从左至右，且下到上
    ctx.rotate(xDiff > 0 ? Math.atan2(yDiff,xDiff) : Math.atan2(-yDiff,-xDiff))

    // 绘制文字，放在点的起始位置
    ctx.fillStyle = this.textStyle
    ctx.textAlign = (xDiff <= 0 ? 'left' : 'right')
    ctx.fillText(this.text, 0, -10)
    ctx.restore()
  }
}
