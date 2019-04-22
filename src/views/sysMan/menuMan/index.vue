<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <div class="" style="padding-bottom: 10px;">
        <el-select v-model="formInfo.data.type" placeholder="请选择菜单类型" style="width: 240px">
          <el-option v-for="(item, index) in listTypeInfo.menuTypeList" :key="index" :label="item.key" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <page-tree
        :expandAll="true"
        :defaultClicked="treeInfo.defaultClicked"
        :defaultHighLight="treeInfo.defaultHighLight"
        :defaultExpanded="treeInfo.defaultExpanded"
        :baseData.sync="treeInfo.baseData"
        :nodeKey="treeInfo.nodeKey"
        :loadInfo.sync="treeInfo.loadInfo"
        :rightMenuList="treeInfo.rightMenuList"
        :treeRefresh="treeInfo.refresh"
        :refreshLevel="treeInfo.refreshLevel"
        @handleClickBt="handleClickBt"
        @handleEvent="handleEvent">
      </page-tree>
    </div>
    <div class="right">
      <el-tabs v-model="tabActive" @tab-click="handleEvent('tabClick')">
        <el-tab-pane label="菜单详情" name="menu">
          <!-- 卡片 -->
          <page-card
            :class="'card'"
            :title="cardInfo.title"
            :data.sync="cardInfo.data"
            :fieldList="cardInfo.fieldList"
            :listTypeInfo="listTypeInfo">
          </page-card>
        </el-tab-pane>
        <!-- 点击页面组件时显示 -->
        <el-tab-pane label="数据权限" name="menuData" v-if="treeInfo.leftClickData.component === 1">
          <template>
            <div class="">
              <el-button
                v-waves
                icon="el-icon-plus"
                type="primary"
                style="margin-bottom: 10px;"
                v-if="dataPerms.includes('menuMan:persCreate')"
                @click="handleClickBt('addMenuData')">添加
              </el-button>
              <el-button
                v-waves
                icon="el-icon-refresh"
                type="primary"
                style="margin-bottom: 10px;"
                @click="tableInfo.refresh = Math.random()">刷新
              </el-button>
            </div>
            <!-- 表格 -->
            <page-table
              :class="'table'"
              :refresh="tableInfo.refresh"
              :pager="tableInfo.pager"
              :data.sync="tableInfo.data"
              :api="dataPermsGetAllApi"
              :query="{menuId: treeInfo.leftClickData.id}"
              :fieldList="tableInfo.fieldList"
              :listTypeInfo="listTypeInfo"
              :handle="tableInfo.handle"
              @handleClickBt="handleClickBt"
              @handleEvent="handleEvent">
            </page-table>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :btLoading="dialogInfo.btLoading"
      :btList="dialogInfo.btList"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
      <!-- form -->
      <page-form
        v-if="dialogInfo.type === 'create' || dialogInfo.type === 'update'"
        :refObj.sync="formInfo.ref"
        :data="formInfo.data"
        :fieldList="formInfo.fieldList"
        :rules="formInfo.rules"
        :labelWidth="formInfo.labelWidth"
        :listTypeInfo="listTypeInfo">
      </page-form>
      <page-form
        v-if="dialogInfo.type === 'addMenuData' || dialogInfo.type === 'updateMenuData'"
        :refObj.sync="dataControlFormInfo.ref"
        :data="dataControlFormInfo.data"
        :fieldList="dataControlFormInfo.fieldList"
        :rules="dataControlFormInfo.rules"
        :labelWidth="dataControlFormInfo.labelWidth"
        :listTypeInfo="listTypeInfo">
      </page-form>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createApi, updateApi, deleteApi, getAllApi, dataPermsCreateApi, dataPermsUpdateApi, dataPermsDeleteApi, dataPermsGetAllApi } from '@/api/sysMan/menuMan'
import Validate from '@/common/mixin/validate'
import HandleApi from '@/common/mixin/handleApi'
import PageTree from '@/components/PageTree'
import PageCard from '@/components/PageCard'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import { iconList } from './icon.js'

export default {
  mixins: [Validate, HandleApi],
  components: {
    PageTree,
    PageCard,
    PageTable,
    PageDialog,
    PageForm
  },
  data () {
    return {
      createApi,
      updateApi,
      deleteApi,
      getAllApi,
      dataPermsCreateApi,
      dataPermsUpdateApi,
      dataPermsDeleteApi,
      dataPermsGetAllApi,
      // 选项卡默认点击
      tabActive: 'menu',
      // 相关列表
      listTypeInfo: {
        iconList: iconList.map(item => {
          item.key = item.class
          item.value = item.class
          return item
        }),
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
        ],
        menuTypeList: [
          {key: '平台端', value: 1},
          {key: '论坛端', value: 2},
          {key: '移动端', value: 3}
        ],
        componentList: [
          {key: '根目录', value: -1},
          {key: '页面组件', value: 1},
          {key: '默认布局组件', value: 2}
        ],
        componentList1: [
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
        refresh: 1, // 刷新
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
          label: 'name', // 节点名称字段
          api: getAllApi, // 获取数据的接口
          params: {data: [{key: 'type', value: 1}], type: 'query'}
        },
        leftClickData: {},
        rightClickData: {},
        rightMenuList: []
      },
      // 卡片相关
      cardInfo: {
        title: '菜单详情',
        data: {},
        fieldList: [
          {label: '所属菜单', value: 'pid', list: 'treeList'},
          {label: '菜单类型', value: 'type', list: 'menuTypeList'},
          {label: '菜单编码', value: 'code'},
          {label: '菜单名称', value: 'name'},
          {label: '菜单组件', value: 'component', list: 'componentList'},
          {label: '菜单图标', value: 'icon'},
          {label: '重定向路径', value: 'redirect'},
          {label: '排序', value: 'sort'},
          {label: '描述', value: 'desc'},
          {label: '状态', value: 'status', list: 'statusList'},
          {label: '创建人', value: 'create_user_name'},
          {label: '创建时间', value: 'create_time'},
          {label: '更新人', value: 'update_user_name'},
          {label: '更新时间', value: 'update_time'}
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
          {label: '所属菜单', value: 'menu_id', type: 'tag', list: 'treeList', required: true},
          {label: '功能类型', value: 'type', list: 'dataControlTypeList', required: true},
          {label: '功能编码', value: 'code', required: true, minWidth: 160},
          {label: '功能名称', value: 'name', required: true},
          {label: '功能api', value: 'api', required: true},
          {label: '请求方式', value: 'method', list: 'reqTypeList', required: true}
          // {label: '创建人', value: 'create_user'},
          // {label: '创建时间', value: 'create_time', minWidth: 180},
          // {label: '更新人', value: 'update_user'},
          // {label: '更新时间', value: 'update_time', minWidth: 180}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            {label: '编辑', type: '', icon: 'el-icon-edit', event: 'updateMenuData', show: false},
            {label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteMenuData', show: false}
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          pid: '', // *父ID
          type: 1, // *菜单类型
          code: '', // *菜单编码
          name: '', // *菜单名称
          component: '', // *菜单组件
          icon: '', // 菜单图标
          redirect: '', // 重定向路径
          sort: '', // *排序
          desc: '', // 描述
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          {label: '所属菜单', value: 'pid', type: 'select', list: 'treeList', required: true},
          {label: '菜单类型', value: 'type', type: 'tag', list: 'menuTypeList', required: true},
          {label: '菜单编码', value: 'code', type: 'input', required: true},
          {label: '菜单名称', value: 'name', type: 'input', required: true},
          {label: '菜单组件', value: 'component', type: 'select', list: 'componentList1', required: true},
          {label: '菜单图标', value: 'icon', type: 'select', list: 'iconList'},
          {label: '重定向路径', value: 'redirect', type: 'input'},
          {label: '排序', value: 'sort', type: 'input', required: true},
          {label: '描述', value: 'desc', type: 'textarea', className: 'el-form-block'},
          {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      dataControlFormInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          menu_id: '', // *菜单ID
          code: '', // *编码
          type: '', // *类型
          name: '', // *名称
          api: '', // *对应请求API
          method: '' // *请求方式
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          {label: '所属菜单', value: 'menu_id', type: 'tag', list: 'treeList', required: true},
          {label: '功能类型', value: 'type', type: 'select', list: 'dataControlTypeList', required: true},
          {label: '功能编码', value: 'code', type: 'input', required: true},
          {label: '功能名称', value: 'name', type: 'input', required: true},
          {label: '功能api', value: 'api', type: 'input'},
          {label: '请求方式', value: 'method', type: 'select', list: 'reqTypeList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加菜单',
          update: '编辑菜单',
          addMenuData: '添加菜单权限',
          updateMenuData: '编辑菜单权限'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          {label: '关闭', type: '', icon: '', event: 'close', show: true},
          {label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true}
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
    'dialogInfo.visible' (val) {
      const formInfo = this.formInfo,
        dataControlFormInfo = this.dataControlFormInfo
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        if (dataControlFormInfo.ref) {
          dataControlFormInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
      }
    },
    'formInfo.data.type' (val) {
      const treeInfo = this.treeInfo
      // 初始化卡片显示
      this.cardInfo.data = {}
      // 修改树组件参数
      treeInfo.loadInfo.params.data[0].value = val
      // 设置树重新初始化
      treeInfo.initTree = false
      // 刷新树
      treeInfo.refresh = Math.random()
    },
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      this.initTree(val)
    },
    // 从菜单详情切换到数据权限，获取数据权限列表
    tabActive (val) {
      if (val !== 'menuData') return
      const tableInfo = this.tableInfo
      tableInfo.data = []
      tableInfo.refresh = Math.random()
    }
  },
  mounted () {
    this.getList()
    this.initDataPerms()
    // mixin中的方法, 初始化字段验证规则
    this._initRules(this.formInfo)
    this._initRules(this.dataControlFormInfo)
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      btList[0].show = this.dataPerms.includes('menuMan:persUpdate')
      btList[1].show = this.dataPerms.includes('menuMan:persDelete')
    },
    initTree (val) {
      const treeInfo = this.treeInfo
      // 操作完后，树刷新，重新设置默认项
      if (treeInfo.initTree) {
        if (treeInfo.defaultClickedAsyc || treeInfo.defaultClickedAsyc === 0) {
          treeInfo.defaultClicked = {id: treeInfo.defaultClickedAsyc}
        }
        if (treeInfo.defaultHighLightAsyc || treeInfo.defaultHighLightAsyc === 0) {
          treeInfo.defaultHighLight = treeInfo.defaultHighLightAsyc
        }
        if (treeInfo.defaultExpandedAsyc.length > 0) {
          treeInfo.defaultExpanded = treeInfo.defaultExpandedAsyc
        }
      }
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
    // 获取列表
    getList () {
    },
    // 按钮点击
    handleClickBt (event, data) {
      const treeInfo = this.treeInfo,
        tableInfo = this.tableInfo,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo,
        dataControlFormInfo = this.dataControlFormInfo
      switch (event) {
      case 'addMenuData':
        dialogInfo.type = event
        dialogInfo.visible = true
        // 设置参数
        dataControlFormInfo.data.menu_id = treeInfo.leftClickData.id
        break
      case 'updateMenuData':
        dialogInfo.type = event
        dialogInfo.visible = true
        // 显示信息
        for (let key in data) {
          // 存在则赋值
          if (key in dataControlFormInfo.data) {
            dataControlFormInfo.data[key] = data[key]
          }
        }
        break
      case 'deleteMenuData':
        this._handleAPI('delete', dataPermsDeleteApi, data.id).then(res => {
          if (res.success) {
            tableInfo.refresh = Math.random()
          }
        })
        break
      // 弹窗点击关闭
      case 'close':
        dialogInfo.visible = false
        break
      // 弹窗点击保存
      case 'save':
        let api, params, type = dialogInfo.type, ref
        if (type === 'create' || type === 'update') {
          params = formInfo.data
          ref = formInfo.ref
        } else if (type === 'addMenuData' || type === 'updateMenuData') {
          params = dataControlFormInfo.data
          ref = dataControlFormInfo.ref
        } else {
          return
        }
        ref.validate(valid => {
          if (valid) {
            if (type === 'create') {
              api = createApi
            } else if (type === 'update') {
              api = updateApi
            } else if (type === 'addMenuData') {
              api = dataPermsCreateApi
            } else if (type === 'updateMenuData') {
              api = dataPermsUpdateApi
            } else {
              return
            }
            dialogInfo.btLoading = true
            this._handleAPI(this.getApiType(type), api, params).then(res => {
              if (res.success) {
                dialogInfo.visible = false
                // 设置默认项
                if (type === 'create') {
                  treeInfo.defaultClickedAsyc = params.pid
                  treeInfo.defaultHighLightAsyc = params.pid
                  treeInfo.defaultExpandedAsyc = [params.pid]
                  // 刷新树
                  treeInfo.refresh = Math.random()
                } else if (type === 'update') {
                  treeInfo.defaultClickedAsyc = params.id
                  treeInfo.defaultHighLightAsyc = params.id
                  treeInfo.defaultExpandedAsyc = [params.pid]
                  // 刷新树
                  treeInfo.refresh = Math.random()
                } else if (type === 'addMenuData' || type === 'updateMenuData') {
                  tableInfo.refresh = Math.random()
                }
              }
              dialogInfo.btLoading = false
            }).catch(e => {
              dialogInfo.btLoading = false
            })
          }
        })
        break
      }
    },
    // 返回对应的api类型
    getApiType (type) {
      if (type === 'create' || type === 'update') {
        return type
      } else if (type === 'addMenuData') {
        return 'create'
      } else if (type === 'updateMenuData') {
        return 'update'
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const cardInfo = this.cardInfo,
        treeInfo = this.treeInfo,
        tableInfo = this.tableInfo
      switch (event) {
      // 对表格获取到的数据做处理
      case 'list':
        if (!data) return
        data.forEach(item => {
          item.create_time = this.$fn.switchTime(item.create_time, 'YYYY-MM-DD hh:mm:ss')
          item.update_time = this.$fn.switchTime(item.update_time, 'YYYY-MM-DD hh:mm:ss')
        })
        break
      case 'tabClick':
        // 懒加载，第一次点击，刷新列表
        if (this.tabActive === 'menuData' && !tableInfo.initTable) {
          tableInfo.initTable = true
          tableInfo.refresh = !tableInfo.refresh
        }
        break
      // 左键点击的处理
      case 'leftClick':
        let obj = JSON.parse(JSON.stringify(data.data))
        if (obj.columns === -1) {
          obj.columns = '无限'
        }
        if (obj.users === -1) {
          obj.users = '无限'
        }
        obj.create_time = this.$fn.switchTime(obj.create_time, 'YYYY-MM-DD hh:mm:ss')
        obj.update_time = this.$fn.switchTime(obj.update_time, 'YYYY-MM-DD hh:mm:ss')
        cardInfo.data = obj
        treeInfo.leftClickData = obj
        // tab为数据权限页面，点击刷新表格
        if (this.tabActive === 'menuData') {
          tableInfo.data = []
          tableInfo.refresh = Math.random()
        }
        // 点击不为页面组件，tab显示为菜单详情
        if (obj.component !== 1) {
          this.tabActive = 'menu'
        }
        break
      // 根据右键点击创建节点对应菜单
      case 'rightClick':
        let arr = []
        // 根节点
        if (data.node.level === 1) {
          arr = [
            {name: '添加下级菜单', type: 'create', data: data.data, node: data.node, vm: data.vm, show: false},
            {name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true}
          ]
        } else {
          arr = [
            {name: '添加下级菜单', type: 'create', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('menuMan:create')},
            {name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('menuMan:update')},
            {name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('menuMan:delete')},
            {name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true}
          ]
        }
        this.treeInfo.rightMenuList = arr
        break
      // 右键菜单对应的事件处理
      case 'rightEvent':
        this.handleRightEvent(data.type, data)
        break
      }
    },
    // 具体的右键事务处理
    handleRightEvent (type, data) {
      const nodeData = data.data,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo,
        treeInfo = this.treeInfo
      switch (type) {
      case 'refreshTree':
        // falls through 告诉ESlint不检查这一行
      case 'refresh':
        // 树刷新
        treeInfo.initTree = false
        treeInfo.refreshLevel = !data.node ? 0 : data.node.level
        treeInfo.refresh = Math.random()
        break
      case 'create':
        dialogInfo.type = type
        dialogInfo.visible = true
        // 设置参数
        formInfo.data.pid = nodeData.id
        break
      case 'update':
        dialogInfo.type = type
        dialogInfo.visible = true
        // 显示信息
        for (let key in nodeData) {
          // 存在则赋值
          if (key in formInfo.data) {
            formInfo.data[key] = nodeData[key]
          }
        }
        break
      case 'delete':
        this._handleAPI(type, deleteApi, nodeData.id).then(res => {
          if (res.success) {
            // 删除后，树组件默认指针指向删除元素的父级
            treeInfo.defaultClickedAsyc = nodeData.pid
            treeInfo.defaultHighLightAsyc = nodeData.pid
            treeInfo.defaultExpandedAsyc = [nodeData.pid]
            // 刷新树
            treeInfo.refresh = Math.random()
          }
        })
        break
      }
    },
    // 初始化表单
    resetForm () {
      this.formInfo.data = {
        id: '', // *唯一ID
        pid: '', // *父ID
        type: 1, // *菜单类型
        code: '', // *菜单编码
        name: '', // *菜单名称
        component: '', // *菜单组件
        icon: '', // 菜单图标
        redirect: '', // 重定向路径
        sort: '', // *排序
        desc: '', // 描述
        status: 1 // *状态: 0：停用，1：启用(默认为1)',
        // create_user: '', // 创建人
        // create_time: '', // 创建时间
        // update_user: '', // 修改人
        // update_time: '' // 修改时间
      }
      this.dataControlFormInfo.data = {
        id: '', // *唯一ID
        menu_id: '', // *菜单ID
        code: '', // *编码
        type: '', // *类型
        name: '', // *名称
        api: '', // *对应请求API
        method: '' // *请求方式
        // create_user: '', // 创建人
        // create_time: '', // 创建时间
        // update_user: '', // 修改人
        // update_time: '' // 修改时间
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .right{
    height: 100%;
    overflow: auto;
  }
</style>
