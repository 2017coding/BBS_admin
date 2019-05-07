<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 表格 -->
    <page-table
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi } from '@/api/sysMan/log'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data () {
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {
        originList: [
          { key: '手机', value: 0 },
          { key: '论坛', value: 1 },
          { key: '管理平台', value: 2 }
        ],
        typeList: [
          { key: '用户登录', value: 1 },
          { key: '用户登出', value: 2 },
          { key: '模块访问', value: 3 },
          { key: '功能操作', value: 4 }
        ]
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          origin: '',
          type: ''
        },
        list: [
          { type: 'select', label: '日志来源', value: 'origin', list: 'originList' },
          { type: 'select', label: '日志类型', value: 'type', list: 'typeList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '日志来源', value: 'origin', list: 'originList' },
          { label: '日志类型', value: 'type', list: 'typeList' },
          { label: '日志标题', value: 'title', list: 'sexList' },
          { label: '日志描述', value: 'desc', list: 'accountTypeList' },
          { label: '访问IP', value: 'ip', minWidth: 160 },
          { label: '用户', value: 'create_user_name' },
          { label: '时间', value: 'create_time', minWidth: 180 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick (event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
      // 搜索
        case 'search':
        // 重置分页
          tableInfo.initCurpage = Math.random()
          tableInfo.refresh = Math.random()
          break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      switch (event) {
      // 对表格获取到的数据做处理
        case 'list':
          if (!data) return
          data.forEach(item => {
            item.create_time = this.$fn.switchTime(item.create_time, 'YYYY-MM-DD hh:mm:ss')
            item.update_time = this.$fn.switchTime(item.update_time, 'YYYY-MM-DD hh:mm:ss')
          })
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
