<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <page-tree
        :nodeKey="treeInfo.nodeKey"
        :lazy="true"
        :lazyInfo="treeInfo.lazyInfo"
        :treeRefresh="treeInfo.refresh"
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
import { getListApi, updateApi, getAllApi } from '@/api/area'
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
        nodeKey: 'key',
        lazy: true,
        type: 0,
        lazyInfo: [
          {
            key: 'id',
            label: 'name',
            type: 1,
            api: getAllApi,
            params: {key: 'pid', value: 1}
          },
          {
            key: 'id',
            label: 'name',
            type: 2,
            api: getAllApi,
            params: {key: 'pid', value: ''},
            leaf: true
          }
        ],
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
            {label: '启用', type: '', icon: 'el-icon-edit', event: 'update', show: true}
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
    'tableInfo.data' (val) {
      this.setList(this.treeInfo.type)
    }
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
      }
    },
    // 触发事件
    handleEvent (event, data) {
      switch (event) {
      // 对表格获取到的数据做处理
      case 'leftClick':
        this.treeInfo.type = data.data.type + 1
        this.filterInfo.query.pid = data.data.id
        this.tableInfo.initCurpage = !this.tableInfo.initCurpage
        this.tableInfo.refresh = !this.tableInfo.refresh
        break
      // 根据右键点击创建节点对应菜单
      case 'rightClick':
        this.treeInfo.rightMenuList = [
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
        // 树初始化
        this.treeInfo.refresh = !this.treeInfo.refresh
        break
      }
    },
    setList (type) {
      let level = ''
      switch (type) {
      case 0:
        level = '省'
        break
      case 1:
        level = '省'
        break
      case 2:
        level = '市'
        break
      case 3:
        level = '区'
        break
      }
      this.tableInfo.data.forEach(item => {
        item.level = level
      })
    }
  }
}
</script>

<style scoped>

</style>
