<template>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleClose"
      :append-to-body="true"
      class="page-dialog"
      :class="className">
      <slot></slot>
      <div slot="footer" class="dialog-footer" v-if="btList">
        <el-button
          v-for="(item, index) in getConfigList()"
          :key="index"
          :type="item.type"
          :icon="item.icon"
          v-waves
          @click="handleClickBt(item.event)"
          :disabled="item.disabled"
          :loading="btLoading">
          {{item.label}}
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'PageDialog',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 弹窗标题
    title: {
      type: String
    },
    // 弹窗是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗宽度
    width: {
      type: String
    },
    // 按钮加载
    btLoading: {
      type: Boolean
    },
    // 操作栏配置
    btList: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  watch: {
    visible (val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 获取按钮列表
    getConfigList () {
      return this.btList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show))
    },
    // 绑定的相关事件
    handleEvent (evnet) {
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClickBt (event, data) {
      this.$emit('handleClickBt', event, data)
    },
    // 关闭弹窗前的回调
    handleClose (done) {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
