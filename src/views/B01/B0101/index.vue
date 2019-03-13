<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="listInfo.query"
      :filterList="filterList"
      :listTypeInfo="listTypeInfo">
    </page-filter>
    <!-- 表格 -->
    <page-table></page-table>
    <!-- 弹窗 -->
  </div>
</template>

<script>
// import { getRowApi, getListApi, updateApi, deleteApi } from '@/api/user'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import List from '@/common/mixin/list'

export default {
  mixins: [List],
  components: {
    PageFilter,
    PageTable,
    PageForm
  },
  data () {
    return {
      // getRowApi,
      // getListApi,
      // updateApi,
      // deleteApi,
      // 相关列表
      listTypeInfo: [],
      // 查询配置
      filterList: [
        {type: 'input', key: '关键字', value: 'keyword'},
        {type: 'select', key: '用户', value: 'uderId'},
        {type: 'date', key: '创建时间', value: 'date'},
        {type: 'button', key: '搜索', btType: 'primary', icon: 'el-icon-search'}
      ]
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
