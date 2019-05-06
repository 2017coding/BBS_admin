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
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-status="scope">
        <i
          :class="scope.row.status === 1 ? 'el-icon-check' : 'el-icon-close'"
          :style="{color: scope.row.status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"
        />
      </template>
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-status="scope">
        <el-button
          v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
          v-waves
          size="mini"
          :type="scope.data.row.status - 1 >= 0 ? 'danger' : 'success'"
          :icon="scope.data.item.icon"
          :disabled="scope.data.item.disabled"
          :loading="scope.data.row[scope.data.item.loading]"
          @click="handleClick(scope.data.item.event, scope.data.row)"
        >
          {{ scope.data.row.status - 1 >= 0 ? '停用' : '启用' }}
        </el-button>
      </template>
    </page-table>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
      <page-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      >
        <!-- 自定义插槽的使用 -->
        <template v-slot:form-image>
          <div class="slot-image">
            <img
              :src="formInfo.data.image"
              style="height: 100px;"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('selectFile')"
            >
              {{ formInfo.data.image ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
      </page-form>
    </page-dialog>
    <!-- 选择文件组件 -->
    <select-file
      v-if="selectFileInfo.visible"
      v-model="formInfo.data.image"
      :type="selectFileInfo.type"
      :visible.sync="selectFileInfo.visible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi, updateApi, deleteApi } from '@/api/bbsConfig/carousel'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import SelectFile from '@/components/SelectFile'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    SelectFile
  },
  data () {
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        eventList: [
          { key: '无效果', value: 0 },
          { key: '跳转路由（self）', value: 1 },
          { key: '跳转路由（blank）', value: 2 },
          { key: '跳转外部页面', value: 3 }
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
          click: '',
          status: ''
        },
        list: [
          { type: 'input', label: '标题', value: 'title' },
          { type: 'select', label: '点击触发', value: 'click', list: 'eventList' },
          { type: 'select', label: '状态', value: 'status', list: 'statusList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '标题', value: 'title' },
          { label: '图片', value: 'image', type: 'image', width: 100 },
          { label: '排序', value: 'sort', width: 80 },
          { label: '点击触发', value: 'click', type: 'select', list: 'eventList', minWidth: 120 },
          { label: '跳转地址', value: 'href', minWidth: 120 },
          { label: '状态', value: 'status', width: 90, type: 'slot' }
          // {label: '创建人', value: 'create_user_name'},
          // {label: '创建时间', value: 'create_time', minWidth: 180},
          // {label: '更新人', value: 'update_user_name'},
          // {label: '更新时间', value: 'update_time', minWidth: 180}
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '280',
          btList: [
            { label: '启用', type: 'success', icon: 'el-icon-albb-process', event: 'status', loading: 'statusLoading', show: false, slot: true },
            { label: '编辑', type: '', icon: 'el-icon-edit', event: 'update', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          title: '', // *标题
          image: '', // 图片
          click: '', // 点击触发
          href: '', // 跳转地址
          sort: '', // 排序
          desc: '', // 描述
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          { label: '标题', value: 'title', type: 'input', required: true },
          { label: '图片', value: 'image', type: 'slot', className: 'el-form-block', required: true },
          { label: '点击触发', value: 'click', type: 'select', list: 'eventList' },
          { label: '跳转地址', value: 'href', type: 'input' },
          { label: '排序', value: 'sort', type: 'input' },
          { label: '描述', value: 'desc', type: 'textarea', className: 'el-form-block' },
          { label: '状态', value: 'status', type: 'select', list: 'statusList', required: true }
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
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
      },
      // 选择文件组件相关参数
      selectFileInfo: {
        type: 2,
        visible: false,
        value: ''
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
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
      }
    }
  },
  mounted () {
    this.initDataPerms()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      const btList1 = this.filterInfo.list
      this.$initDataPerms('carousel', btList)
      this.$initDataPerms('carousel', btList1)
    },
    // 初始化验证
    initRules () {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    // 获取列表
    getList () {
      this.tableInfo.refresh = Math.random()
    },
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 按钮点击
    handleClick (event, data) {
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
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
          // 编辑
        case 'update':
          dialogInfo.type = event
          dialogInfo.visible = true
          // 显示信息
          for (const key in data) {
          // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = data[key]
            }
          }
          break
        case 'status':
          const params = {}
          // 设置参数
          for (const key in data) {
          // 存在则赋值
            if (key in formInfo.data) {
              params[key] = data[key]
            }
          }
          params.status = params.status - 1 >= 0 ? 0 : 1
          data.statusLoading = true
          this.$handleAPI('update', updateApi, params).then(res => {
            data.statusLoading = false
            if (res.success) {
              data.status = params.status
            }
          }).catch(() => {
            data.statusLoading = false
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
          // 弹窗点击保存
        case 'save':
          this.formInfo.ref.validate(valid => {
            if (valid) {
              let api; const params = this.formInfo.data
              const type = this.dialogInfo.type
              if (type === 'create') {
                api = createApi
              } else if (type === 'update') {
                api = updateApi
              } else {
                return
              }
              dialogInfo.btLoading = true
              this.$handleAPI(type, api, params).then(res => {
                if (res.success) {
                  dialogInfo.visible = false
                  tableInfo.refresh = Math.random()
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        case 'selectFile':
          this.selectFileInfo.visible = true
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
    },
    // 初始化表单
    resetForm () {
      this.formInfo.data = {
        id: '', // *唯一ID
        title: '', // *标题
        image: '', // 图片
        click: '', // 点击触发
        href: '', // 跳转地址
        sort: '', // 排序
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

<style lang="scss">
  .slot-image{
    margin: 20px 0;
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
