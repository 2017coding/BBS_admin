<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filterList="filterInfo.list"
      :listTypeInfo="listTypeInfo"
      @handleClickBt="handleClickBt"
      @handleEvent="handleEvent">
    </page-filter>
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
        <!-- 自定义插槽的使用 -->
        <template v-slot:icon>
          <div class="slot-icon">
            <img :src="formInfo.data.icon" style="height: 30px;">
            <el-button
              type="primary"
              icon="el-icon-picture"
              size="mini"
              v-waves
              @click="handleClickBt('selectFile')">
              {{formInfo.data.icon ? '更换图标' : '选择图标'}}
            </el-button>
          </div>
        </template>
        <template v-slot:wikipedia>
          <div class="slot-wikipedia">
            {{formInfo.data.wikipedia}}
            <mavon-editor
              :value.sync="formInfo.data.wikipedia"
              placeholder="请编写标签百科...">
            </mavon-editor>
          </div>
        </template>
      </page-form>
    </page-dialog>
    <!-- 选择文件组件 -->
    <select-file
      v-model="formInfo.data.icon"
      v-if="selectFileInfo.visible"
      :type="selectFileInfo.type"
      :visible.sync="selectFileInfo.visible">
    </select-file>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllApi } from '@/api/bbsConfig/tagTypeMan'
import { getListApi, createApi, updateApi, deleteApi } from '@/api/bbsConfig/tagMan'
import Validate from '@/common/mixin/validate'
import HandleApi from '@/common/mixin/handleApi'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import MavonEditor from '@/components/MavonEditor'
import SelectFile from '@/components/SelectFile'

export default {
  mixins: [Validate, HandleApi],
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    MavonEditor,
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
        tagTypeList: [],
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
        ]
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          name: '',
          type_id: ''
        },
        list: [
          {type: 'select', label: '标签类型', value: 'type_id', list: 'tagTypeList'},
          {type: 'input', label: '标签名称', value: 'name', list: 'tagTypeList'},
          {type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true},
          {type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false}
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          {label: '类型名称', value: 'type_name', minWidth: 90},
          {label: '标签名称', value: 'name', minWidth: 90},
          {label: '描述', value: 'desc', minWidth: 160},
          {label: '状态', value: 'status', width: 90, list: 'statusList'}
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
            {key: '', label: '启用', type: 'success', icon: 'el-icon-process', event: 'status', loading: 'statusLoading', show: false},
            {label: '编辑', type: '', icon: 'el-icon-edit', event: 'update', show: false},
            {label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false}
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          type_id: '', // *类型ID
          name: '', // *标签名称
          icon: '', // 图标
          sort: '', // 排序
          wikipedia: '', // *标签百科
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          {label: '标签类型', value: 'type_id', type: 'select', list: 'tagTypeList', filterable: true, required: true},
          {label: '标签名称', value: 'name', type: 'input', required: true},
          {label: '标签图标', value: 'icon', type: 'slot', className: 'el-form-block'},
          {label: '排序', value: 'sort', type: 'input'},
          {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true},
          {label: '标签百科', value: 'wikipedia', type: 'slot', className: 'el-form-block'}
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        width: '80%',
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
    this.initParams()
    this.initList()
    this.initDataPerms()
    // mixin中的方法, 初始化字段验证规则
    this._initRules(this.formInfo)
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      // this.filterInfo.list[4].show = this.dataPerms.includes('userMan:create')
      // btList[0].show = this.dataPerms.includes('userMan:status')
      // btList[1].show = this.dataPerms.includes('userMan:update')
      // btList[2].show = this.dataPerms.includes('userMan:delete')
      this.filterInfo.list[2].show = true
      btList[0].show = true
      btList[1].show = true
      btList[2].show = true
    },
    initParams () {
      // this.filterInfo.query.create_user = this.userInfo.id
    },
    initList () {
      const listTypeInfo = this.listTypeInfo
      getAllApi().then(res => {
        if (res.success) {
          listTypeInfo.tagTypeList = res.content.map(item => {
            return {
              key: item.name,
              value: item.id
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        }
      })
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
    handleClickBt (event, data) {
      const tableInfo = this.tableInfo,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo
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
        for (let key in data) {
          // 存在则赋值
          if (key in formInfo.data) {
            formInfo.data[key] = data[key]
          }
        }
        break
      case 'status':
        const params = {}
        // 设置参数
        for (let key in data) {
          // 存在则赋值
          if (key in formInfo.data) {
            params[key] = data[key]
          }
        }
        params.status = params.status - 1 >= 0 ? 0 : 1
        data.statusLoading = true
        this._handleAPI('update', updateApi, params).then(res => {
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
        this._handleAPI(event, deleteApi, data.id).then(res => {
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
            let api, params = this.formInfo.data,
              type = this.dialogInfo.type
            if (type === 'create') {
              api = createApi
            } else if (type === 'update') {
              api = updateApi
            } else {
              return
            }
            dialogInfo.btLoading = true
            this._handleAPI(type, api, params).then(res => {
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
          let obj = this.listTypeInfo.tagTypeList.find(item1 => item1.value === item.type_id)
          item.type_name = obj ? obj.key : item.type_id
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
        type_id: '', // *类型ID
        name: '', // *标签名称
        icon: '', // 图标
        sort: '', // 排序
        wikipedia: '', // *标签百科
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
.slot-avatar{
  height: 40px;
  display: flex;
  align-items: center;
  img{
    padding-right: 10px;
  }
}
.slot-wikipedia{
}
</style>
