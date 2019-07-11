import { addListener, removeListener } from 'resize-detector'

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
      addListener(parentEl, () => {
        resizeCanvas()
      })
      resizeCanvas()
    }
  }
  destroy () {
    this.parentEl && removeListener(this.parentEl)
  }
}
