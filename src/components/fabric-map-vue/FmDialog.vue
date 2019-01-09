<template>
  <div v-show="visible">
    <div class="fm-dialog" >
      <div class="fm-dialog-content" :style="{'width': width, 'min-height': minHeight}">
        <div class="fm-dialog-close-btn" @click.prevent="handleCloseBtnClick">x</div>
        <div class="fm-dialog-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: '50%'
    },
    minHeight: {
      type: String,
      default: '100px'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCloseBtnClick () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style>
  .fm-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .fm-dialog-content {
    position: relative;
    background: #845ec2;
    color: #fff;
    border-radius: .2em;
  }
  .fm-dialog-close-btn {
    position: absolute;
    top: -15px;
    right: -15px;
    color: #fff;
    padding: 5px 10px;
    border-radius: 50%;
    background: #FF6F91;
    font-size: 20px;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
  }
  .fm-dialog-body {
    padding: 20px;
  }
</style>
