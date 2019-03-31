<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <page-tree
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
        @handleEvent="handleEvent"></page-tree>
    </div>
    <div class="right">
      <!-- 卡片 -->
      <page-card
        :title="cardInfo.title"
        :data.sync="cardInfo.data"
        :fieldList="cardInfo.fieldList"
        :listTypeInfo="listTypeInfo">
      </page-card>
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
      :refObj.sync="formInfo.ref"
      :data="formInfo.data"
      :fieldList="formInfo.fieldList"
      :rules="formInfo.rules"
      :labelWidth="formInfo.labelWidth"
      :listTypeInfo="listTypeInfo">
      </page-form>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createApi, updateApi, deleteApi, getAllApi } from '@/api/role'
import HandleApi from '@/common/mixin/handleApi'
import PageTree from '@/components/PageTree'
import PageCard from '@/components/PageCard'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'

export default {
  mixins: [HandleApi],
  components: {
    PageTree,
    PageCard,
    PageDialog,
    PageForm
  },
  data () {
    return {
      createApi,
      updateApi,
      deleteApi,
      getAllApi,
      // 相关列表
      listTypeInfo: {
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
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
          api: getAllApi // 获取数据的接口
        },
        rightMenuList: []
      },
      // 卡片相关
      cardInfo: {
        title: '角色详情',
        data: {},
        fieldList: [
          {label: '所属角色', value: 'pid', list: 'treeList'},
          {label: '角色名称', value: 'name'},
          {label: '可创建专栏数', value: 'columns', width: 120},
          {label: '可创建用户数', value: 'users', width: 120},
          {label: '描述', value: 'desc', minWidth: 200},
          {label: '状态', value: 'status', list: 'statusList'},
          {label: '创建人', value: 'create_user'},
          {label: '创建时间', value: 'create_time', minWidth: 180},
          {label: '更新人', value: 'update_user'},
          {label: '更新时间', value: 'update_time', minWidth: 180}
        ]
      },
      // 表单相关
      formInfo: {
        data: {
          id: '', // *唯一ID
          pid: '', // *父ID
          name: '', // *角色名称
          columns: 1, // 专栏数量, 0为无限
          users: 10, // 可创建多少个用户, 0为无限
          desc: '', // 描述
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          {label: '所属角色', value: 'pid', type: 'tag', list: 'treeList', required: true},
          {label: '名称', value: 'name', type: 'input', required: true},
          {label: '可创建专栏数', value: 'columns', type: 'inputNumber', min: 1, max: 1, required: true},
          {label: '可创建用户数', value: 'users', type: 'inputNumber', min: 1, max: 10, required: true},
          {label: '描述', value: 'desc', type: 'textarea'},
          {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加',
          update: '编辑'
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
      'userInfo'
    ])
  },
  watch: {
    'dialogInfo.visible' (val) {
      if (!val) {
        // 表单验证初始化
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        this.resetForm()
      }
    },
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      this.initTree(val)
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    initTree (val) {
      const treeInfo = this.treeInfo
      // 初始化树
      if (!treeInfo.initTree) {
        treeInfo.initTree = true
        // 设置默认
        treeInfo.defaultClicked = {id: val[0].id}
        treeInfo.defaultHighLight = val[0].id
        treeInfo.defaultExpanded = [val[0].id]
      }
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
      // 设置列表
      this.listTypeInfo.treeList = val.map(item => {
        item.key = item.name
        item.value = item.id
        return item
      })
      this.listTypeInfo.treeList.unshift({key: 'admin', value: 0})
    },
    // 获取列表
    getList () {
    },
    // 按钮点击
    handleClickBt (event, data) {
      const treeInfo = this.treeInfo,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo
      switch (event) {
      // 弹窗点击关闭
      case 'close':
        dialogInfo.visible = false
        break
      // 弹窗点击保存
      case 'save':
        formInfo.ref.validate(valid => {
          if (valid) {
            let api, params = formInfo.data,
              type = dialogInfo.type
            if (type === 'create') {
              api = createApi
            } else if (type === 'update') {
              api = updateApi
            } else {
              return
            }
            dialogInfo.btLoading = true
            this.handleAPI(type, api, params).then(res => {
              if (res.success) {
                dialogInfo.visible = false
                // 刷新树
                treeInfo.refresh = !treeInfo.refresh
                // 设置默认项
                if (type === 'create') {
                  treeInfo.defaultClickedAsyc = params.pid
                  treeInfo.defaultHighLightAsyc = params.pid
                  treeInfo.defaultExpandedAsyc = [params.pid]
                } else if (type === 'update') {
                  treeInfo.defaultClickedAsyc = params.id
                  treeInfo.defaultHighLightAsyc = params.id
                  treeInfo.defaultExpandedAsyc = [params.pid]
                }
              }
              dialogInfo.btLoading = false
            }).catch(e => {
              dialogInfo.btLoading = true
            })
          }
        })
        break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const cardInfo = this.cardInfo
      // treeInfo = this.treeInfo
      // formInfo = this.formInfo
      switch (event) {
      // 对表格获取到的数据做处理
      case 'list':
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
        break
      // 根据右键点击创建节点对应菜单
      case 'rightClick':
        let arr = []
        // 根节点
        if (data.node.level === 1) {
          arr = [
            {name: '添加下级角色', type: 'create', data: data.data, node: data.node, vm: data.vm},
            {name: '刷新树', type: 'refreshTree', data: null, node: null, vm: null}
          ]
        } else {
          arr = [
            {name: '添加下级角色', type: 'create', data: data.data, node: data.node, vm: data.vm},
            {name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm},
            {name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm},
            {name: '刷新树', type: 'refreshTree', data: null, node: null, vm: null}
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
        treeInfo.refresh = !this.treeInfo.refresh
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
        this.handleAPI(type, deleteApi, nodeData.id).then(res => {
          if (res.success) {
            treeInfo.refresh = !treeInfo.refresh
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
        name: '', // *角色昵称
        columns: 1, // 专栏数量, 0为无限
        users: 10, // 可创建多少个用户, 0为无限
        desc: '', // 描述
        status: 1 // *状态: 0：停用，1：启用(默认为1)',
        // create_user: '', // 创建人
        // create_time: '', // 创建时间
        // update_user: '', // 修改人
        // update_time: '' // 修改时间
      }
    }
  }
}
</script>

<style scoped>

</style>
