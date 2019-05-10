<template>
  <el-dialog
    class="select-file"
    :title="'选择' + initType(type)"
    :visible.sync="visible"
    width="width"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <div class="content">
      <!-- 左侧树 -->
      <div class="left">
        <page-tree
          :expand-all="true"
          :load-type="1"
          :default-clicked="treeInfo.defaultClicked"
          :default-high-light="treeInfo.defaultHighLight"
          :default-expanded="treeInfo.defaultExpanded"
          :tree-data="treeInfo.treeData"
          :base-data.sync="treeInfo.baseData"
          :node-key="treeInfo.nodeKey"
          :load-info.sync="treeInfo.loadInfo"
          :right-menu-list="treeInfo.rightMenuList"
          :tree-refresh="treeInfo.refresh"
          :refresh-level="treeInfo.refreshLevel"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </div>
      <div class="right">
        <!-- 条件栏 -->
        <page-filter
          class="filter"
          :query.sync="filterInfo.query"
          :filter-list="filterInfo.list"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <!-- 表格 -->
        <page-table
          :listen-height="false"
          :refresh="tableInfo.refresh"
          :init-curpage="tableInfo.initCurpage"
          :data.sync="tableInfo.data"
          :api="getFileAllApi"
          :pager="false"
          :query="filterInfo.query"
          :field-list="tableInfo.fieldList"
          :list-type-info="listTypeInfo"
          :handle="tableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getAllApi } from '@/api/library/folder'
import { getAllApi as getFileAllApi } from '@/api/library/file'
import PageTree from '@/components/PageTree'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
function initType (type) {
  switch (type) {
    case 1:
      return '文件'
    case 2:
      return '图片'
    case 3:
      return '音乐'
    case 4:
      return '视频'
  }
}
export default {
  name: 'SelectFile',
  components: {
    PageTree,
    PageFilter,
    PageTable
  },
  // 注册v-model
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    // 文件类型，默认为图片
    type: {
      type: Number,
      default: 2
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      getFileAllApi,
      // 相关列表
      listTypeInfo: {
        treeList: []
      },
      // 树相关信息
      treeInfo: {
        initTree: false, // 初始化加载
        refresh: 1, // 刷新
        nodeKey: 'key', // 节点绑定字段
        defaultClicked: {}, // 默认点击 (设置为对象，保证数据能被监听到)
        defaultHighLight: '', // 默认高亮
        defaultExpanded: [], // 默认展开
        // 对树删除编辑添加时的临时存储，在树刷新后赋值这些数据的
        defaultClickedAsyc: '', // 默认点击
        defaultHighLightAsyc: '', // 默认高亮
        defaultExpandedAsyc: [], // 默认展开
        treeData: [], // 树渲染数据(非懒加载时由外部渲染)
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'id', // 节点id
          pKey: 'pid', // 节点父级id
          label: 'name', // 节点名称字段
          api: getAllApi, // 获取数据的接口
          params: { data: [{ key: 'type', value: this.type }], type: 'query' },
          resFieldList: ['content'] // 数据所在字段
        },
        leftClickData: {},
        rightClickData: {},
        rightMenuList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          name: '',
          suffix: '',
          f_id: '',
          type: this.type
        },
        list: [
          { type: 'input', label: initType(this.type) + '名称', value: 'name' },
          // {type: 'input', label: initType(this.type) + '类型', value: 'suffix'},
          { type: 'select', label: '所在目录', value: 'f_id', list: 'treeList' },
          // {type: 'date', label: '创建时间', value: 'create_time'},
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initTable: false,
        initCurpage: 1,
        pager: false,
        data: [],
        fieldList: [
          { label: '所属目录', value: 'f_id', list: 'treeList' },
          { label: '图片', value: 'completePath', type: 'image', hidden: this.type !== 2 },
          { label: initType(this.type) + '名称', value: 'name' },
          { label: initType(this.type) + '类型', value: 'suffix' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-ship', event: 'selectFile', show: true }
          ]
        }
      }
    }
  },
  watch: {
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      // 得到树状数据
      this.treeInfo.treeData = this.$fn.getTreeArr({
        key: 'id',
        pKey: 'pid',
        data: val
      })
      console.log(val)
      this.initTree(val)
    }
  },
  mounted () {
    // hack, 在table创建出来之后再去调用
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    initType,
    initTree (val) {
      const treeInfo = this.treeInfo
      // 操作完后，树刷新，重新设置默认项
      if (!treeInfo.initTree) {
        if (treeInfo.defaultClickedAsyc || treeInfo.defaultClickedAsyc === 0) {
          treeInfo.defaultClicked = { id: treeInfo.defaultClickedAsyc }
        }
        if (treeInfo.defaultHighLightAsyc || treeInfo.defaultHighLightAsyc === 0) {
          treeInfo.defaultHighLight = treeInfo.defaultHighLightAsyc
        }
        if (treeInfo.defaultExpandedAsyc.length > 0) {
          treeInfo.defaultExpanded = treeInfo.defaultExpandedAsyc
        }
      }
      // // 初始化树
      // if (!treeInfo.initTree) {
      //   treeInfo.initTree = true
      //   // 容错处理
      //   val[0] = val[0] ? val[0] : {}
      //   // 设置默认
      //   treeInfo.defaultClicked = {id: val[0].id}
      //   treeInfo.defaultHighLight = val[0].id
      //   treeInfo.defaultExpanded = [val[0].id]
      // }
      // 设置列表
      this.listTypeInfo.treeList = val.map(item => {
        item.key = item.name
        item.value = item.id
        return item
      })
    },
    // 获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick (event, data) {
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      const filterInfo = this.filterInfo
      switch (event) {
      // 搜索
        case 'search':
        // 重置分页
          tableInfo.refresh = Math.random()
          // 搜索完之后要将数据对应
          treeInfo.defaultClicked = { id: filterInfo.query.f_id }
          treeInfo.defaultHighLight = filterInfo.query.f_id || null
          break
        case 'selectFile':
        // 将选择的数据派发出去
          this.$emit('input', data.completePath)
          // 关闭弹窗
          this.handleClose()
          break
          // 弹窗点击关闭
        case 'close':
          dialogInfo.visible = false
          break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      const filterInfo = this.filterInfo
      switch (event) {
      // 对表格获取到的数据做处理
        case 'list':
          if (!data) return
          data.forEach(item => {
            item.size = this.$fn.bytesToSize(item.size)
            item.create_time = this.$fn.switchTime(item.create_time, 'YYYY-MM-DD hh:mm:ss')
            item.update_time = this.$fn.switchTime(item.update_time, 'YYYY-MM-DD hh:mm:ss')
          })
          break
          // 左键点击的处理
        case 'leftClick':
          const obj = JSON.parse(JSON.stringify(data.data))
          treeInfo.leftClickData = obj
          // 重置分页
          tableInfo.initCurpage = Math.random()
          // 刷新列表
          tableInfo.refresh = Math.random()
          // 定义当前数据搜索范围
          filterInfo.query.f_id = obj.id
          break
      }
    },
    // 关闭弹窗前的回调
    handleClose (done) {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-file{
  .content{
    display: flex;
    .left, .right{
      height: 400px;
      overflow: auto;
    }
    .left{
      width: 180px;
    }
    .right{
      position: relative;
      margin-left: 10px;
      flex: 1;
      .filter{
        top: 0;
        position: sticky;
        z-index: 10;
        background: white;
      }
    }
  }
}
</style>
