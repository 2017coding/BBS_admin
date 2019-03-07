<template>
  <el-table
    :data="tableData_P"
    stripe
    width="50%"
    height="400">
    <el-table-column
      fixed
      type="index">
    </el-table-column>
    <el-table-column
      align="center"
      fixed
      prop="starttime"
      label="时间"
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="r0p1"
      label="正向有功电量"
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="r0p2"
      label="反向有功电量"
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="r0p3"
      label="正向无功电量"
      >
    </el-table-column>
    <el-table-column
      align="center"
      prop="r0p4"
      label="反向无功电量"
      >
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props:{
      tableData_P:Array
    },
    data() {
      return {
        tableData: this.tableData_P
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

