<template>
  <div>
    <fm-dialog :visible.sync="visible">
      <p>选择类型</p>
      <div class="fm-type-select-wrapper">
        <div class="fm-type" v-for="item of TYPELIST" :key="item.type"  @click="handleItemClick(item)">
          <span v-text="item.text"></span>
        </div>
      </div>
    </fm-dialog>
    <fm-dialog :visible.sync="formVisible" @close="handleFormCloseBtnClick">
      <component :is="fmType.component" @submit="handleFormSubmit"></component>
    </fm-dialog>
  </div>
</template>
<script>
import FmDialog from './FmDialog'
import FmTextForm from './FmTextForm'
import FmImgForm from './FmImgForm'

const TYPE_ENUM = {
  TEXT: 'text',
  IMG: 'image'
}

const TYPELIST = [
  { type: TYPE_ENUM.TEXT, text: '文本', component: FmTextForm },
  { type: TYPE_ENUM.IMG,  text: '图片', component: FmImgForm }
]

export default {
  components: {
    FmTextForm,
    FmDialog
  },
  data () {
    return {
      TYPELIST,
      TYPE_ENUM,
      visible: true,
      formVisible: false,
      fmType: {},
    }
  },
  methods: {
    handleItemClick (item) {
      this.fmType = item
      this.visible = false
      this.formVisible = true
    },
    handleFormCloseBtnClick () {
      this.visible = true
    },
    handleFormSubmit (data) {
      console.log({
        type: this.fmType.type,
        ...data,
      })
      this.$emit('submit', {
        type: this.fmType.type,
        ...data,
      })
    }
  }
}
</script>
<style>
  .fm-type-select-wrapper {
    display: flex;
    box-sizing: border-box;
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
  .fm-type:active {
  }
  .fm-type input {
    display: none;
  }
</style>
