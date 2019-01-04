<template>
  <div class="fm-dir-btn-wrapper">
    <div class="fm-row">
      <i class="fm-icon-up-circle" @click="handleDirBtnClick('up')"></i>
    </div>
    <div class="fm-row">
      <i class="fm-icon-left-circle" @click="handleDirBtnClick('left')" ></i>
      <i class="fm-icon-right-circle" @click="handleDirBtnClick('right')"></i>
    </div>
    <div class="fm-row">
      <i class="fm-icon-down-circle"  @click="handleDirBtnClick('down')"></i>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleDirBtnClick (type) {
      this.$emit('change', type)
    }
  }
}
</script>
<style lang="scss"></style>
