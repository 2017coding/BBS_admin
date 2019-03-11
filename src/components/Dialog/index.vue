<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :width="width">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    name: 'PageDialog',
    dialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
