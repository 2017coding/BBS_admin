<template>
  <el-table
    class="page-table"
    :data="data"
    style="width: 100%">
  </el-table>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
