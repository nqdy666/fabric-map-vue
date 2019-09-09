const DEFAULT_OPTIONS = {
}

export default class FabricImgText extends fabric.Group {
  constructor (img, text, options = {}) {
    const objects = []
    if (img) {
      objects.push(img)
    }
    if (text) {
      objects.push(text)
    }
    super(objects, {
      ...DEFAULT_OPTIONS,
      ...options
    })
  }
}
