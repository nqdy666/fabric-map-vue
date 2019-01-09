<template>
  <div>
    <fm-dialog :visible.sync="visible">
      <p>选择类型</p>
      <div class="fm-type-select-wrapper">
        <label class="fm-type" :class="{active: fmType === 'text'}">
          <input type="radio" v-model="fmType" value="text"/>文字</label>
        <label class="fm-type" :class="{active: fmType === 'image'}">
          <input type="radio" v-model="fmType" value="image"/>图片</label>
      </div>
    </fm-dialog>
  </div>
</template>
<script>
import FmDialog from './FmDialog'

export default {
  components: {
    FmDialog
  },
  data () {
    return {
      visible: true,
      fmType: undefined,
    }
  }
}
</script>
<style>
  .fm-type-select-wrapper {
    display: flex;
  }
  .fm-type {
    flex: 1;
    margin: 10px;
    text-align: center;
    background: #ff6f91;
    padding: 20px 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .fm-type.active {
    border: 5px solid #5079bb;
  }
  .fm-type input {
    display: none;
  }
</style>
