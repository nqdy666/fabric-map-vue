import './styles/index.scss'
import * as components from './components'
import {
  vueUse
} from './utils/plugins'

const VuePlugin = {
  install: function (Vue) {
    if (Vue._fabric_map_vue) {
      return
    }
    Vue._fabric_map_vue = true
    
    // Register component plugins
    for (let plugin in components) {
      Vue.use(components[plugin])
    }
  }
}

vueUse(VuePlugin)

export default VuePlugin
