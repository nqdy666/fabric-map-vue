<template>
  <div>
    <fm-dialog :visible.sync="visible" @close="handleCloseBtnClick">
      <p>选择类型</p>
      <div class="fm-type-select-wrapper">
        <div class="fm-type" v-for="item of TYPELIST" :key="item.type"  @click="handleItemClick(item)">
          <span v-text="item.text"></span>
        </div>
      </div>
    </fm-dialog>
    <fm-dialog :visible.sync="formVisible" @close="handleFormCloseBtnClick">
      <component :is="fmType.component" @submit="handleFormSubmit" :data="data"></component>
    </fm-dialog>
  </div>
</template>
<script>
import { POINT_TYPE_ENUM } from './constants'
import FmDialog from './FmDialog'
import FmTextForm from './FmTextForm'
import FmImgForm from './FmImgForm'

const TYPELIST = [
  { type: POINT_TYPE_ENUM.TEXT, text: '文本', component: FmTextForm },
  { type: POINT_TYPE_ENUM.IMG,  text: '图片', component: FmImgForm }
]

export default {
  props: {
    data: {
      type: Object,
      required: false
    },
  },
  components: {
    FmTextForm,
    FmDialog
  },
  data () {
    return {
      TYPELIST,
      POINT_TYPE_ENUM,
      visible: true,
      formVisible: false,
      fmType: {},
    }
  },
  mounted () {
    if (this.data) {
      this.fmType = TYPELIST.find(item => item.type === this.data.type) || {}
      if (this.fmType.type) {
        this.formVisible = true
        this.visible = false
      }
    }
  },
  methods: {
    handleItemClick (item) {
      this.fmType = item
      this.visible = false
      this.formVisible = true
    },
    handleFormCloseBtnClick () {
      if (this.data) { 
        this.$emit('close')
      } else {
        this.visible = true
      }
    },
    handleFormSubmit (data) {
      this.$emit('submit', {
        type: this.fmType.type,
        ...data,
      })
    },
    handleCloseBtnClick () {
      this.$emit('close')
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
