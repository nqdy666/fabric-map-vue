import fabricBuildingMapVue from './fabric-building-map-vue'
import { registerComponents, vueUse } from '../../utils/plugins'

const components = {
  fabricBuildingMapVue
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
