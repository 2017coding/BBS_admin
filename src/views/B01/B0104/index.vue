<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <page-tree
        :baseData.sync="treeInfo.baseData"
        :nodeKey="treeInfo.nodeKey"
        :lazy="true"
        :lazyInfo="treeInfo.lazyInfo"
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
        refresh: 1,
        refreshLevel: 0,
        nodeKey: 'key',
        lazy: true,
        type: 0, // 省市区类型
        baseData: [], // 树的基础数据，从组件中获取到
        lazyInfo: [
          {
            key: 'id', // 节点唯一标识字段
            label: 'name', // 节点显示字段
            type: 1, // 数据类型
            api: getAllApi, // 获取数据的接口
            params: {key: 'pid', value: 1, type: 'url'} // 获取数据的参数
          },
          {
            key: 'id',
            label: 'name',
            type: 2,
            api: getAllApi,
            params: {key: 'pid', value: '', type: 'url'},
            leaf: true
          }
        ],
        rightMenuList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          pid: 1
        }
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: false,
        data: [],
        fieldList: [
          {label: '名称', value: 'name'},
          {label: '级别', value: 'level'},
          {label: '状态', value: 'status', width: 80}
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
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClickBt (event, data) {
      switch (event) {
      case 'status':
        let params = JSON.parse(JSON.stringify(data))
        params.status = params.status - 1 >= 0 ? 0 : 1
        data.statusLoading = true
        delete params.statusLoading
        this._handleAPI('update', updateApi, params).then(res => {
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
        this.tableInfo.refresh = Math.random()
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
        this.tableInfo.refresh = Math.random()
        // falls through 告诉ESlint不检查这一行
      case 'refresh':
        // 树刷新
        this.treeInfo.refreshLevel = !data.node ? 0 : data.node.level
        this.treeInfo.refresh = Math.random()
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
