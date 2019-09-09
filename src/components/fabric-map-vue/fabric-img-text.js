const DEFAULT_OPTIONS = {
}

export default class FabricImgText extends fabric.Group {
  constructor (img, text, options = {}) {
    const objects = [img, text]
    super(objects, {
      ...DEFAULT_OPTIONS,
      ...options
    })
  }
}
