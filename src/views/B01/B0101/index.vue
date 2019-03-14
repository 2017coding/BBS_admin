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
      :refresh="tableInfo.refresh"
      :api="getListApi"
      :query="filterInfo.query"
      :fieldList="tableInfo.fieldList"
      :listTypeInfo="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
    </page-table>
    <!-- 弹窗 -->
    <page-dialog
      :dialogTitle="dialogInfo.title[dialogInfo.type]"
      :dialogVisible.sync="dialogInfo.visible"
      :formInfo="dialogInfo.formInfo"
      :listTypeInfo="listTypeInfo"
      :btList="dialogInfo.btList"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
    </page-dialog>
  </div>
</template>

<script>
// import { getRowApi, getListApi, updateApi, deleteApi } from '@/api/user'
import { getListApi, deleteApi } from '@/api/user'
import HandleApi from '@/common/mixin/handleApi'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'

export default {
  mixins: [HandleApi],
  components: {
    PageFilter,
    PageTable,
    PageDialog
  },
  data () {
    return {
      // getRowApi,
      getListApi,
      // updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        sexList: [
          {key: '女', value: 1},
          {key: '男', value: 0}
        ],
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
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
          {type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search'},
          {type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'add'}
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: false,
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
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          add: '添加',
          update: '编辑'
        },
        visible: false,
        type: '',
        formInfo: {
          data: {
            account: '',
            name: ''
          },
          fieldList: [
            {label: '账号', value: 'account', type: 'input'},
            {label: '用户名', value: 'name', type: 'input'},
            {label: '性别', value: 'sex', type: 'select', list: 'sexList'},
            // {label: '账号类型', value: 'type', width: 100},
            {label: '状态', value: 'status', type: 'select', list: 'statusList'}
          ],
          rules: {},
          labelWidth: '120px'
        },
        btList: [
          {label: '关闭', type: '', icon: '', event: 'close', show: true},
          {label: '保存', type: 'primary', icon: '', event: 'save', show: true}
        ]
      }
    }
  },
  watch: {
    'filterInfo.query': {
      handler: function (val) {
        // console.log(val)
      },
      deep: true
    }
  },
  methods: {
    // 按钮点击
    handleClickBt (event, data) {
      switch (event) {
      // 搜索
      case 'search':
        this.tableInfo.refresh = !this.tableInfo.refresh
        break
      // 添加
      case 'add':
        this.dialogInfo.type = event
        this.dialogInfo.visible = true
        break
      // 编辑
      case 'update':
        this.dialogInfo.type = event
        this.dialogInfo.visible = true
        break
      // 删除
      case 'delete':
        this.handleAPI(event, deleteApi, data.id).then(() => {
          this.tableInfo.refresh = !this.tableInfo.refresh
        })
        break
      // 弹窗点击关闭
      case 'close':
        this.dialogInfo.visible = false
        break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      switch (event) {
      // 对表格获取到的数据做处理
      case 'list':
        data.forEach(item => {
          item.create_time = this.$fn.switchTime(new Date(), 'YYYY-MM-DD hh:mm:ss')
        })
        break
      }
    }
  }
}
</script>

<style scoped>

</style>
