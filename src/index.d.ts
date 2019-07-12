declare module 'fabric-map-vue' {
  import Vue, { PluginFunction, PluginObject } from 'vue'

  class FabricMapVue implements PluginObject<{}> {
    [key: string]: any
    public install: PluginFunction<{}>
  }

  const VuePlugin: FabricMapVue

  export default VuePlugin

  // Interfaces
  export interface FabricMapVue extends Vue {
  }
}
