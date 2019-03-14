<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PageDialog',
  props: {
    dialogTitle: {
      type: String
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>