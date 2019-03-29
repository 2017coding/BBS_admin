<template>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      class="page-dialog">
      <slot></slot>
      <div slot="footer" class="dialog-footer" v-if="btList">
        <el-button
          v-for="(item, index) in btList"
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
    // 弹窗class
    className: {
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
    // 绑定的相关事件
    handleEvent (evnet) {
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClickBt (event, data) {
      this.$emit('handleClickBt', event, data)
    }
  }
}
</script>

<style scoped>

</style>
