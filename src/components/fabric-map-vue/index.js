import fabricMapVue from './fabric-map-vue'
import { registerComponents, vueUse } from '../../utils/plugins'

const components = {
  fabricMapVue
}

const VuePlugin = {
  install (Vue) {
    registerComponents(Vue, components)
  }
}

vueUse(VuePlugin)

export default VuePlugin
