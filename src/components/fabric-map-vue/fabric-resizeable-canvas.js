import { addResizeListener, removeResizeListener } from '../../utils/detect-element-resize'

export default class FabricResizableCavas extends fabric.Canvas {
  constructor(el, options = {}) {
    super(el, options)
    const { parentEl } = options
    this.parentEl = parentEl
    if (parentEl) {
      const resizeCanvas = () => {
        this.setHeight(parentEl.clientHeight)
        this.setWidth(parentEl.clientWidth)
        this.requestRenderAll()
      }
      addResizeListener(parentEl, () => {
        resizeCanvas()
      })
      resizeCanvas()
    }
  }
  destroy (...arg) {
    super.destroy(...arg)
    this.parentEl && removeResizeListener(this.parentEl)
  }
}
