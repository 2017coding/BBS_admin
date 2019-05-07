<template>
  <div class="app-container">
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
      />
    </div>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.type === 'uploadFile' ? undefined : dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        v-if="dialogInfo.type === 'create' || dialogInfo.type === 'update'"
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <page-form
        v-else-if="dialogInfo.type === 'updateFile'"
        :ref-obj.sync="fileFormInfo.ref"
        :data="fileFormInfo.data"
        :field-list="fileFormInfo.fieldList"
        :rules="fileFormInfo.rules"
        :label-width="fileFormInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <Upload
        v-else-if="dialogInfo.type === 'uploadFile' && dialogInfo.visible"
        :upload-data="{fid: treeInfo.rightClickData.id, type: treeInfo.rightClickData.type}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createApi, updateApi, deleteApi, getAllApi } from '@/api/library/folder'
import { updateApi as updateFileApi, deleteApi as deleteFileApi, getListApi } from '@/api/library/file'
import PageTree from '@/components/PageTree'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import Upload from '@/components/Upload'

export default {
  components: {
    PageTree,
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    Upload
  },
  data () {
    return {
      createApi,
      updateApi,
      deleteApi,
      getAllApi,
      getListApi,
      // 相关列表
      listTypeInfo: {
        iconList: [],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
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
        treeData: [], // 树渲染数据(非懒加载时由外部渲染)
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'id', // 节点id
          pKey: 'pid', // 节点父级id
          label: 'name', // 节点名称字段
          api: getAllApi, // 获取数据的接口
          params: { data: [{ key: 'type', value: 2 }], type: 'query' },
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
          type: 2
        },
        list: [
          { type: 'input', label: '图片名称', value: 'name' },
          { type: 'input', label: '图片类型', value: 'suffix' },
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
          { label: '图片', value: 'completePath', type: 'image' },
          { label: '图片名称', value: 'name' },
          // {label: '文件路径', value: 'completePath'},
          { label: '图片类型', value: 'suffix', type: 'tag' },
          { label: '图片大小', value: 'size' }
          // {label: '创建人', value: 'create_user'},
          // {label: '创建时间', value: 'create_time', minWidth: 180},
          // {label: '更新人', value: 'update_user'},
          // {label: '更新时间', value: 'update_time', minWidth: 180}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '300',
          btList: [
            { label: '复制地址', type: 'primary', icon: 'el-icon-ship', event: 'copyFile', show: true },
            { label: '编辑', type: '', icon: 'el-icon-edit', event: 'updateFile', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteFile', show: false }
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          pid: '', // *父ID
          name: '', // *目录名称
          type: 2, // *目录类型: 1.文件 2.图片 3.音乐 4.视频
          // path: '', // *目录路径
          sort: '', // 排序
          desc: '' // 文件描述
          // status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          { label: '所属目录', value: 'pid', type: 'tag', list: 'treeList', required: true },
          { label: '目录名称', value: 'name', type: 'input', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true },
          { label: '描述', value: 'desc', type: 'textarea', className: 'el-form-block' }
          // {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      fileFormInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          f_id: '', // *文件夹ID
          name: '', // *文件名称
          type: 2, // *文件类型: 1.文件 2.图片 3.音乐 4.视频
          // path: '', // *文件路径
          // suffix: '', // *文件后缀
          // size: '', // *文件大小
          desc: '' // 文件描述
          // sort: '', // 排序
          // status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          { label: '所属目录', value: 'f_id', type: 'tag', list: 'treeList', required: true },
          { label: '图片名称', value: 'name', type: 'input', required: true }
          // {label: '图片路径', value: 'completePath', type: 'tag', required: true},
          // {label: '图片类型', value: 'suffix', type: 'tag', required: true},
          // {label: '图片大小', value: 'size', type: 'tag'},
          // {label: '排序', value: 'sort', type: 'input', required: true},
          // {label: '描述', value: 'desc', type: 'textarea'}
          // {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加目录',
          update: '编辑目录',
          uploadFile: '上传图片',
          updateFile: '编辑图片'
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
    'dialogInfo.visible' (val) {
      const formInfo = this.formInfo
      const fileFormInfo = this.fileFormInfo
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        if (fileFormInfo.ref) {
          fileFormInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
      }
    },
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData' (val) {
      // 得到树状数据
      this.treeInfo.treeData = this.$fn.getTreeArr({
        key: 'id',
        pKey: 'pid',
        data: val
      })
      this.initTree(val)
    }
  },
  mounted () {
    this.getList()
    this.initDataPerms()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      this.$initDataPerms('imgMan', btList)
    },
    // 初始化验证
    initRules () {
      const formInfo = this.formInfo
      const fileFormInfo = this.fileFormInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
      fileFormInfo.rules = this.$initRules(fileFormInfo.fieldList)
    },
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
      const formInfo = this.formInfo
      const fileFormInfo = this.fileFormInfo
      const filterInfo = this.filterInfo
      switch (event) {
      // 搜索
        case 'search':
        // 重置分页
          tableInfo.initCurpage = Math.random()
          tableInfo.refresh = Math.random()
          // 搜索完之后要将数据对应
          treeInfo.defaultClicked = { id: filterInfo.query.f_id }
          treeInfo.defaultHighLight = filterInfo.query.f_id || null
          break
        case 'updateFile':
          dialogInfo.type = event
          dialogInfo.visible = true
          // 显示信息
          for (const key in data) {
          // 存在则赋值
            if (key in fileFormInfo.data) {
              fileFormInfo.data[key] = data[key]
            }
          }
          break
        case 'deleteFile':
          this.$handleAPI('delete', deleteFileApi, data.id).then(res => {
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
          let api; let params; const type = dialogInfo.type; let ref
          if (type === 'create' || type === 'update') {
            params = formInfo.data
            ref = formInfo.ref
          } else if (type === 'uploadFile' || type === 'updateFile') {
            params = fileFormInfo.data
            ref = fileFormInfo.ref
          } else {
            return
          }
          ref.validate(valid => {
            if (valid) {
              if (type === 'create') {
                api = createApi
              } else if (type === 'update') {
                api = updateApi
              } else if (type === 'uploadFile') {
              // api = dataPermsCreateApi
              } else if (type === 'updateFile') {
                api = updateFileApi
              } else {
                return
              }
              dialogInfo.btLoading = true
              this.$handleAPI(this.getApiType(type), api, params).then(res => {
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
                  } else if (type === 'uploadFile' || type === 'updateFile') {
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
        case 'copyFile':
          this.$fn.copyData(data.completePath)
          break
      }
    },
    // 返回对应的api类型
    getApiType (type) {
      if (type === 'create' || type === 'update') {
        return type
      } else if (type === 'uploadFile') {
        return 'create'
      } else if (type === 'updateFile') {
        return 'update'
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
          // 根据右键点击创建节点对应菜单
        case 'rightClick':
          let arr = []
          // 根节点
          if (data.node.level === 1) {
            arr = [
              { name: '添加下级目录', type: 'create', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('imgMan:create') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          } else {
            arr = [
              { name: '上传图片', type: 'uploadFile', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('imgMan:upload') },
              { name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('imgMan:update') },
              { name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPerms.includes('imgMan:delete') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          }
          this.treeInfo.rightMenuList = arr
          treeInfo.rightClickData = JSON.parse(JSON.stringify(data.data))
          break
          // 右键菜单对应的事件处理
        case 'rightEvent':
          this.handleRightEvent(data.type, data)
          break
          // 组件上传之后的回调
        case 'upload':
          if (data) {
          // 数据指针对应
            filterInfo.query.f_id = treeInfo.rightClickData.id
            treeInfo.defaultClicked = { id: filterInfo.query.f_id }
            treeInfo.defaultHighLight = filterInfo.query.f_id
            // 刷新列表
            tableInfo.refresh = Math.random()
            // 关闭弹窗
            this.handleClick('close')
          }
          break
      }
    },
    // 具体的右键事务处理
    handleRightEvent (type, data) {
      const nodeData = data.data
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      const treeInfo = this.treeInfo
      const fileFormInfo = this.fileFormInfo
      switch (type) {
        case 'refreshTree':
        // falls through 告诉ESlint不检查这一行
        case 'refresh':
        // 树刷新
          treeInfo.initTree = false
          treeInfo.refreshLevel = !data.node ? 0 : data.node.level
          treeInfo.refresh = Math.random()
          break
        case 'uploadFile':
          dialogInfo.type = type
          dialogInfo.visible = true
          fileFormInfo.data.f_id = nodeData.id
          // 设置参数
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
          for (const key in nodeData) {
          // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = nodeData[key]
            }
          }
          break
        case 'delete':
          this.$handleAPI(type, deleteApi, nodeData.id).then(res => {
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
        name: '', // *目录名称
        type: 2, // *目录类型: 1.文件 2.图片 3.音乐 4.视频
        // path: '', // *目录路径
        sort: '', // 排序
        desc: '' // 文件描述
        // status: 1 // *状态: 0：停用，1：启用(默认为1)',
        // create_user: '', // 创建人
        // create_time: '', // 创建时间
        // update_user: '', // 修改人
        // update_time: '' // 修改时间
      }
      this.fileFormInfo.data = {
        id: '', // *唯一ID
        f_id: '', // *文件夹ID
        name: '', // *文件名称
        type: 2, // *文件类型: 1.文件 2.图片 3.音乐 4.视频
        // path: '', // *文件路径
        // suffix: '', // *文件后缀
        // size: '', // *文件大小
        desc: '' // 文件描述
        // sort: '', // 排序
        // status: 1 // *状态: 0：停用，1：启用(默认为1)',
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
</style>
