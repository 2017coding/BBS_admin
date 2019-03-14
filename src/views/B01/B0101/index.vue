<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filterList="filterInfo.list"
      :listTypeInfo="listTypeInfo"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
    </page-filter>
    <!-- 表格 -->
    <page-table
      :api="getListApi"
      :query="filterInfo.query"
      :fieldList="tableInfo.fieldList"
      :listTypeInfo="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
    </page-table>
    <!-- 弹窗 -->
    <!-- <page-dialog></page-dialog> -->
  </div>
</template>

<script>
// import { getRowApi, getListApi, updateApi, deleteApi } from '@/api/user'
import { getListApi } from '@/api/user'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
// import PageDialog from '@/components/PageDialog'

export default {
  components: {
    PageFilter,
    PageTable
    // PageDialog
  },
  data () {
    return {
      // getRowApi,
      getListApi,
      // updateApi,
      // deleteApi,
      // 相关列表
      listTypeInfo: {
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 2}
        ]
      },
      // 查询配置
      filterInfo: {
        query: {
          keyword: '',
          userId: '',
          date: ''
        },
        list: [
          {type: 'input', label: '关键字', value: 'keyword'},
          {type: 'select', label: '用户', value: 'userId'},
          {type: 'date', label: '创建时间', value: 'date'},
          {type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search'}
        ]
      },
      // 表格相关
      tableInfo: {
        data: [
          {accpunt: 1, accpunt1: 2, accpunt2: 3, name: '测试', sex: '性别', type: '管理'}
        ],
        fieldList: [
          {label: '账号', value: 'account'},
          {label: '用户名', value: 'name'},
          {label: '性别', value: 'sex', width: 80},
          {label: '账号类型', value: 'type', width: 100},
          {label: '状态', value: 'status', width: 90, list: 'statusList'},
          {label: '创建人', value: 'create_user'},
          {label: '创建时间', value: 'create_time'}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            {label: '编辑', type: '', icon: 'el-icon-edit', event: 'update', show: true},
            {label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: true}
          ]
        }
      }
    }
  },
  watch: {
    'filterInfo.query' (val) {
      console.log(val)
    }
  },
  methods: {
    // 按钮事件
    handleClickBt (event, data) {
      console.log(event, data)
    },
    // 触发事件
    handleEvent (event, data) {
      console.log(event)
      // 对表格获取到的数据做处理
      if (event === 'list') {
        data.forEach(item => {
          item.create_time = this.$fn.switchTime(new Date(), 'YYYY-MM-DD hh:mm:ss')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
