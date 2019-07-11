<template>
  <div class="layout layout-lr">
    <div class="left-wrapper">
      <ul>
        <li v-for="item of tabs" 
          :class="{ active: $route.name === item.name }"
          :key="item.name"
          @click="handleTabClick(item)">{{item.label}}</li>
      </ul>
    </div>
    <div class="right-wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabs: [
          { name: 'index', label: '热力地图' },
          { name: 'coord', label: '地图定位' },
          { name: 'distance', label: '距离绘制' },
          { name: 'mapswitch', label: '地图切换' },
        ]
      }
    },
    created () {
      console.log(this.$route)
    },
    methods: {
      handleTabClick (tab) {
        this.$router.push({ name: tab.name })
      }
    },
    components: {
    }
  }
</script>
<style lang="scss">
  .layout {
    width: 100%;
    height: 100%;
  }
  .left-wrapper {
    width: 150px;
    overflow: auto;
    background-color: #F9F9F9;
    color: #25b864;
    padding-left: 20px;

    li {
      padding: 10px 0 10px 20px;
      cursor: pointer;
      color: #8c8c8c;
      // border-left: 5px solid #8c8c8c;
      border-left: 5px solid #F9F9F9;
      margin: 15px 0;

      &.active {
        border-left-color: #25b864
      }
    }
  }
  .right-wrapper {
    height: 100%;
  }

  .op-wrapper {
    width: 250px;
    padding: 10px;
  }
  .tip {
    font-size: 14px;
    color: #8c8c8c;
  }
  .section {
    padding-bottom: 10px;
  }
</style>
