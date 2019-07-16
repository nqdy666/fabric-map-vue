import { loadFixture, testVM } from '../../../tests/utils'

describe('fabric-map-vue', async () => {
  beforeEach(loadFixture(__dirname, 'fabric-map-vue'))
  testVM()

  it('should has fm-svg-map-wrapper class', async () => {
    const { app: { $refs } } = window

    expect($refs.fm).toHaveClass('fm-svg-map-wrapper')
  })
})
