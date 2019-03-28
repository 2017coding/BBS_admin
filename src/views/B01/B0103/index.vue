<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <page-tree
        :nodeKey="treeInfo.nodeKey"
        :loadInfo="treeInfo.loadInfo"
        :rightMenuList="treeInfo.rightMenuList"
        :treeRefresh="treeInfo.refresh"
        :refreshLevel="treeInfo.refreshLevel"
        @handleClickBt="handleClickBt"
        @handleEvent="handleEvent"></page-tree>
    </div>
    <div class="right">
      <!-- 表格 -->
      <page-table
        :refresh="tableInfo.refresh"
        :initCurpage="tableInfo.initCurpage"
        :data.sync="tableInfo.data"
        :api="getListApi"
        :query="filterInfo.query"
        :fieldList="tableInfo.fieldList"
        :listTypeInfo="listTypeInfo"
        :handle="tableInfo.handle"
        @handleClickBt="handleClickBt"
        @handleEvent="handleEvent">
      </page-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, updateApi, getAllApi } from '@/api/mod'
import HandleApi from '@/common/mixin/handleApi'
import PageTree from '@/components/PageTree'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  mixins: [HandleApi],
  components: {
    PageTree,
    PageFilter,
    PageTable
  },
  data () {
    return {
      getListApi,
      updateApi,
      getAllApi,
      // 相关列表
      listTypeInfo: {
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
        ]
      },
      // 树相关信息
      treeInfo: {
        refresh: false,
        refreshLevel: 0,
        nodeKey: 'key',
        loadInfo: {
          key: 'id',
          pKey: 'pid',
          rootPValue: 0,
          label: 'name',
          api: getAllApi
        },
        rightMenuList: []
      },
      // 查询配置
      filterInfo: {
        query: {
          pid: 1
        }
      },
      // 表格相关
      tableInfo: {
        refresh: false,
        initCurpage: false,
        data: [],
        fieldList: [
          {label: '名称', value: 'name'},
          {label: '级别', value: 'level'},
          {label: '状态', value: 'status', list: 'statusList'}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            {key: '', label: '启用', type: 'success', icon: 'el-icon-process', event: 'status', loading: 'statusLoading', show: true}
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
  },
  created () {
    this.initParams()
  },
  mounted () {
    this.getList()
  },
  methods: {
    initParams () {
    },
    // 获取列表
    getList () {
      this.tableInfo.refresh = !this.tableInfo.refresh
    },
    // 按钮点击
    handleClickBt (event, data) {
      switch (event) {
      case 'status':
        let params = JSON.parse(JSON.stringify(data))
        params.status = params.status - 1 >= 0 ? 0 : 1
        data.statusLoading = true
        this.handleAPI('update', updateApi, params).then(res => {
          data.statusLoading = false
          if (res.success) {
            data.status = params.status
          }
        }).catch(() => {
          data.statusLoading = false
        })
        break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      switch (event) {
      // 对表格获取到的数据做处理
      case 'list':
        if (!data) return
        // 初始化数据
        data.forEach(item => {
          item.statusLoading = false
        })
        break
      // 左键点击的处理
      case 'leftClick':
        this.treeInfo.type = data.data.type + 1
        this.filterInfo.query.pid = data.data.id
        this.tableInfo.initCurpage = !this.tableInfo.initCurpage
        this.tableInfo.refresh = !this.tableInfo.refresh
        break
      // 根据右键点击创建节点对应菜单
      case 'rightClick':
        this.treeInfo.rightMenuList = [
          {name: '添加下级', type: 'create', data: data.data, node: data.node, vm: data.vm},
          {name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm},
          {name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm},
          {name: '刷新树', type: 'refreshTree', data: null, node: null, vm: null}
        ]
        break
      // 右键菜单对应的事件处理
      case 'rightEvent':
        this.handleRightEvent(data.type, data)
        break
      }
    },
    // 具体的右键事务处理
    handleRightEvent (type, data) {
      switch (type) {
      case 'refreshTree':
        // 表格初始化
        this.filterInfo.query.pid = 1
        this.tableInfo.initCurpage = !this.tableInfo.initCurpage
        this.tableInfo.refresh = !this.tableInfo.refresh
        // falls through 告诉ESlint不检查这一行
      case 'refresh':
        // 树刷新
        this.treeInfo.refreshLevel = !data.node ? 0 : data.node.level
        this.treeInfo.refresh = !this.treeInfo.refresh
        break
      }
    }
  }
}
</script>

<style scoped>

</style>
