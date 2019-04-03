<template>
  <div class="permissions">
    <el-tabs v-model="modType" @tab-click="handleEvent('tabClick')">
      <el-tab-pane
        class="tab"
        :label="item.key"
        v-for="(item, index) in listTypeInfo.modTypeList"
        :name="item.value + ''"
        :key="index">
        <!-- 左侧树 -->
        <div class="left">
          <page-tree
            :expandAll="true"
            :rightClick="false"
            :checkBox="true"
            :defaultClicked="treeInfo.defaultClicked"
            :defaultHighLight="treeInfo.defaultHighLight"
            :defaultExpanded="treeInfo.defaultExpanded"
            :baseData.sync="treeInfo.baseData"
            :nodeKey="treeInfo.nodeKey"
            :loadInfo.sync="treeInfo.loadInfo"
            :treeRefresh="treeInfo.refresh"
            :refreshLevel="treeInfo.refreshLevel"
            @handleClickBt="handleClickBt"
            @handleEvent="handleEvent">
          </page-tree>
        </div>
        <div class="right">
          <!-- 点击页面组件时显示 -->
          <!-- 表格 -->
          <page-table
            v-if="treeInfo.leftClickData.components === 1"
            :checkBox="true"
            :class="'table'"
            :refresh="tableInfo.refresh"
            :pager="tableInfo.pager"
            :data.sync="tableInfo.data"
            :api="dataControlGetAllApi"
            :query="{modId: treeInfo.leftClickData.id}"
            :fieldList="tableInfo.fieldList"
            :listTypeInfo="listTypeInfo"
            :handle="tableInfo.handle"
            @handleClickBt="handleClickBt"
            @handleEvent="handleEvent">
          </page-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllApi } from '@/api/mod'
import { getPermissionsApi } from '@/api/roleRelation'
import { getAllApi as dataControlGetAllApi } from '@/api/dataControl'
import HandleApi from '@/common/mixin/handleApi'
import PageTree from '@/components/PageTree'
import PageTable from '@/components/PageTable'

export default {
  mixins: [HandleApi],
  components: {
    PageTree,
    PageTable
  },
  data () {
    return {
      getAllApi,
      dataControlGetAllApi,
      // 模块类型
      modType: '1',
      // 相关列表
      listTypeInfo: {
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
        ],
        modTypeList: [
          {key: '平台端', value: 1, status: false},
          {key: '论坛端', value: 2, status: false},
          {key: '移动端', value: 3, status: false}
        ],
        componentsList: [
          {key: '根目录', value: -1},
          {key: '页面组件', value: 1},
          {key: '默认布局组件', value: 2}
        ],
        dataControlTypeList: [
          {key: '按钮点击', value: 1},
          {key: '右键菜单', value: 2},
          {key: '链接访问', value: 3}
        ],
        reqTypeList: [
          {key: 'GET', value: 1},
          {key: 'POST', value: 2},
          {key: 'PUT', value: 3},
          {key: 'DELETE', value: 4}
        ],
        treeList: []
      },
      // 树相关信息
      treeInfo: {
        initTree: false, // 初始化加载
        refresh: false, // 刷新
        nodeKey: 'key', // 节点绑定字段
        defaultClicked: {}, // 默认点击 (设置为对象，保证数据能被监听到)
        defaultHighLight: '', // 默认高亮
        defaultExpanded: [], // 默认展开
        // 对树删除编辑添加时的临时存储，在树刷新后赋值这些数据的
        defaultClickedAsyc: '', // 默认点击
        defaultHighLightAsyc: '', // 默认高亮
        defaultExpandedAsyc: [], // 默认展开
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'id', // 节点id
          pKey: 'pid', // 节点父级id
          rootPValue: 0, // 根节点的值
          label: 'name', // 节点名称字段
          api: getAllApi, // 获取数据的接口
          params: {data: [{key: 'type', value: 1}], type: 'query'}
        },
        leftClickData: {}
      },
      // 表格相关
      tableInfo: {
        refresh: false,
        initTable: false,
        initCurpage: false,
        pager: false,
        data: [],
        fieldList: [
          {label: '所属模块', value: 'mod_id', type: 'tag', list: 'treeList', required: true},
          {label: '类型', value: 'type', list: 'dataControlTypeList', required: true},
          {label: '编码', value: 'code', required: true},
          {label: '名称', value: 'name', required: true},
          {label: 'api', value: 'api', required: true},
          {label: '请求方式', value: 'method', list: 'reqTypeList', required: true}
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'modType' (val) {
      const treeInfo = this.treeInfo
      // 修改树组件参数
      treeInfo.loadInfo.params.data[0].value = val
      // 设置树重新初始化
      treeInfo.initTree = false
      // 刷新树
      treeInfo.refresh = !treeInfo.refresh
    },
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      this.initTree(val)
    }
  },
  mounted () {
    getPermissionsApi().then(res => {
    })
  },
  methods: {
    initTree (val) {
      const treeInfo = this.treeInfo
      // 初始化树
      if (!treeInfo.initTree) {
        treeInfo.initTree = true
        // 容错处理
        val[0] = val[0] ? val[0] : {}
        // 设置默认
        treeInfo.defaultClicked = {id: val[0].id}
        treeInfo.defaultHighLight = val[0].id
        treeInfo.defaultExpanded = [val[0].id]
      }

      // 设置列表
      this.listTypeInfo.treeList = val.map(item => {
        item.key = item.name
        item.value = item.id
        return item
      })
    },
    // 按钮点击
    handleClickBt (event, data) {
      switch (event) {
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const treeInfo = this.treeInfo,
        tableInfo = this.tableInfo
      switch (event) {
      // 左键点击的处理
      case 'leftClick':
        tableInfo.refresh = !tableInfo.refresh
        treeInfo.leftClickData = JSON.parse(JSON.stringify(data.data))
        break
      }
    }
  }
}
</script>

<style scoped lang="scss">
  $treeWidth: 240px;
  .permissions{
    .tab{
      display: flex;
      padding-bottom: 10px;
      width: 100%;
      height: 400px;
      overflow: auto;
    }
    .left{
      // position: absolute;
      width: $treeWidth;
      // border: 1px solid rgb(200, 200, 200);
    }
    .right{
      margin-left: 10px;
      flex: 1;
    }
  }
</style>
