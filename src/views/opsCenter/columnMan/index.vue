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
    >
      <!-- 自定义插槽显示标题-->
      <template v-slot:col-title="scope">
        <el-tooltip class="item" effect="dark" content="查看文章详细信息" placement="left">
          <a style="color: red; padding: 0 20px;" @click="handleClick('view', scope.row)">{{ scope.row.title }}</a>
        </el-tooltip>
      </template>
    </page-table>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.type === 'view' ? undefined : dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, getRowApi, createApi, updateApi, deleteApi } from '@/api/opsCenter/columnMan'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog
  },
  data () {
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        flagList: [
          { key: '草稿', value: 1 },
          { key: '审核中', value: 2 },
          { key: '已发布', value: 3 },
          { key: '审核失败', value: 4 },
          { key: '封禁', value: 5 }
        ],
        typeList: [
          { key: '原创', value: 1 },
          { key: '转载', value: 2 },
          { key: '翻译', value: 3 }
        ],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ]
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          title: '',
          type: '',
          flag: ''
        },
        list: [
          { type: 'input', label: '专栏名称', value: 'name' },
          { type: 'select', label: '状态', value: 'flag', list: 'flagList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '专栏名称', value: 'name', minWidth: 180 },
          { label: '专栏地址', value: 'url', minWidth: 180 },
          { label: '状态', value: 'flag', width: 90, type: 'select', list: 'flagList' },
          { label: '创建人', value: 'create_user_name' },
          { label: '创建时间', value: 'create_time', width: 180 }
          // {label: '更新人', value: 'update_user_name'},
          // {label: '更新时间', value: 'update_time', minWidth: 180}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            // { label: '查看', type: 'primary', icon: 'el-icon-browse', event: 'view', show: true },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false, ifRender (row) {
              return row.flag === 1
            }
            }
          ]
        }
      },
      // 文章相关
      articleInfo: {},
      // 弹窗相关
      dialogInfo: {
        width: '80%',
        title: {
          create: '添加',
          update: '编辑'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'dataPerms'
    ])
  },
  watch: {
  },
  mounted () {
    this.initList()
    this.initDataPerms()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      const btList1 = this.filterInfo.list
      this.$initDataPerms('articleMan', btList)
      this.$initDataPerms('articleMan', btList1)
    },
    initList () {
    },
    // 获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick (event, data) {
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      switch (event) {
      // 搜索
        case 'search':
        // 重置分页
          tableInfo.initCurpage = Math.random()
          tableInfo.refresh = Math.random()
          break
          // 创建
        case 'create':
          dialogInfo.type = event
          dialogInfo.visible = true
          break
          // 查看和编辑
        case 'view':
          // falls through 告诉ESlint不检查这一行
        case 'update':
          dialogInfo.type = event
          dialogInfo.visible = true
          this.articleInfo = JSON.parse(JSON.stringify(data))
          getRowApi(data.id).then(res => {
            if (res.success) {
              this.articleInfo = res.content[0]
            }
          })
          break
          // 删除
        case 'delete':
          this.$handleAPI(event, deleteApi, data.id).then(res => {
            if (res.success) {
              tableInfo.refresh = Math.random()
            }
          })
          break
          // 弹窗点击关闭
        case 'close':
          dialogInfo.visible = false
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
            this.$set(item, 'statusLoading', false)
            item.create_time = this.$fn.switchTime(item.create_time, 'YYYY-MM-DD hh:mm:ss')
            item.update_time = this.$fn.switchTime(item.update_time, 'YYYY-MM-DD hh:mm:ss')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a{
  cursor: pointer;
}
.title{
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 40px;
  color: black;
}
</style>
