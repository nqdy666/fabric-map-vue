<template>
  <form class="fm-form">
    <div class="fm-form-item">
      <label>文本内容:</label><input v-model.trim="text" placeholder="例如：text"/>
    </div>
    <div class="fm-form-item">
      <label>字体大小:</label><input v-model.number="fontSize" placeholder="例如：12"/>
    </div>
    <div class="fm-btn-wrapper">
      <button class="fm-btn" @click.prevent="handleSubmitBtnClick">确定</button>
    </div>
  </form>
</template>
<script>
export default {
  data () {
    return {
      text: '',
      fontSize: 12
    }
  },
  methods: {
    handleSubmitBtnClick () {
      this.$emit('submit', {
        text: this.text,
        fontSize: this.fontSize
      })
    }
  }
}
</script>
<style>
  .fm-form input {
    border: 1px solid #bdb7b7;
    border-radius: 5px;
    min-height: 30px;
    min-width: 200px;
    padding: 0 10px;
    font-size: 16px;
    color: #000;
  }
  .fm-form .fm-form-item {
    padding: 5px;
  }
  .fm-form-item label {
    padding-right: 10px;
  }
  .fm-btn-wrapper .fm-btn {
    padding: 5px;
    border-radius: 5px;
    border: none;
    min-width: 80px;
    line-height: 1.5;
    background-color: #409eff;
    border-color: #409eff;
    color: white;
  }
</style>
