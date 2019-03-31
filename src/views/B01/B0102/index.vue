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
      <!-- form -->
      <page-form
      :refObj.sync="formInfo.ref"
      :data="formInfo.data"
      :fieldList="formInfo.fieldList"
      :rules="formInfo.rules"
      :labelWidth="formInfo.labelWidth"
      :listTypeInfo="listTypeInfo">
      </page-form>
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
import { getRowApi, updateApi, getAllApi } from '@/api/role'
import HandleApi from '@/common/mixin/handleApi'
import PageTree from '@/components/PageTree'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'

export default {
  mixins: [HandleApi],
  components: {
    PageTree,
    PageDialog,
    PageForm
  },
  data () {
    return {
      getRowApi,
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
      // 过滤相关配置
      filterInfo: {
        query: {
          pid: 1
        }
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
          {label: '名称', value: 'name', type: 'input', required: true},
          {label: '可创建专栏数', value: 'columns', type: 'inputNumber', min: 1, max: 1},
          {label: '可创建用户数', value: 'users', type: 'inputNumber', min: 1, max: 10},
          {label: '描述', value: 'desc', type: 'input', required: true},
          {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          add: '添加',
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
    },
    // 按钮点击
    handleClickBt (event, data) {
      switch (event) {
      }
    },
    // 触发事件
    handleEvent (event, data) {
      const tableInfo = this.tableInfo,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo
      switch (event) {
      // 左键点击的处理
      case 'leftClick':
        // 显示信息
        for (let key in formInfo.data) {
          formInfo.data[key] = data.data[key]
        }
        break
      // 根据右键点击创建节点对应菜单
      case 'rightClick':
        let arr = []
        // 根节点
        if (data.node.level === 1) {
          arr = [
            {name: '添加下级', type: 'create', data: data.data, node: data.node, vm: data.vm},
            {name: '刷新树', type: 'refreshTree', data: null, node: null, vm: null}
          ]
        } else {
          arr = [
            {name: '添加下级', type: 'create', data: data.data, node: data.node, vm: data.vm},
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
      switch (type) {
      case 'refreshTree':
        // falls through 告诉ESlint不检查这一行
      case 'refresh':
        // 树刷新
        this.treeInfo.refreshLevel = !data.node ? 0 : data.node.level
        this.treeInfo.refresh = !this.treeInfo.refresh
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
