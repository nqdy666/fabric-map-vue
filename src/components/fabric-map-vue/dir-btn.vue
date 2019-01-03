<template>
  <div class="fc-dir-btn-wrapper">
    <div class="fc-row">
      <i class="fc-icon-up-circle" @click="handleDirBtnClick('up')"></i>
    </div>
    <div class="fc-row">
      <i class="fc-icon-left-circle" @click="handleDirBtnClick('left')" ></i>
      <i class="fc-icon-right-circle" @click="handleDirBtnClick('right')"></i>
    </div>
    <div class="fc-row">
      <i class="fc-icon-down-circle"  @click="handleDirBtnClick('down')"></i>
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
