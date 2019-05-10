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
        v-if="dialogInfo.type !== 'userTransfer'"
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <!-- 自定义插槽-选择头像 -->
        <template v-slot:form-avatar>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="formInfo.data.avatar"
              style="height: 30px;"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('selectFile')"
            >
              {{ formInfo.data.avatar ? '更换头像' : '选择头像' }}
            </el-button>
          </div>
        </template>
      </page-form>
      <!-- 用户转移 -->
      <div
        v-else
        class=""
      >
        是否将
        <span style="color: red">{{ userTransferInfo.userName }}</span>
        创建的用户转移给
        <el-select
          v-model="userTransferInfo.toUser"
          class="filter-item"
          placeholder="请选择一个用户"
          filterable
          clearable
        >
          <el-option
            v-for="item in listTypeInfo.userList.filter(item => !userTransferInfo.createUserList.includes(item.value) && item.value !== userTransferInfo.user)"
            :key="item.id"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
      </div>
    </page-dialog>
    <!-- 选择文件组件 -->
    <select-file
      v-if="selectFileInfo.visible"
      v-model="formInfo.data.avatar"
      :type="selectFileInfo.type"
      :visible.sync="selectFileInfo.visible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllApi, getListApi, getCreateUserApi, userTransferApi, createApi, updateApi, deleteApi } from '@/api/sysMan/userMan'
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
    // 检测用户账号
    const checkAccount = (rule, value, callback) => {
      const check = this.$validate({ label: '账号', value, rules: ['notnull', 'noChinese', 'max'], conditions: [12] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 验证密码
    const checkPwd = (rule, value, callback) => {
      const check = this.$validate({ label: '密码', value, rules: ['notnull', 'length'], conditions: [6, 15] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测号码
    const checkPhone = (rule, value, callback) => {
      const check = this.$validate({ label: '手机号码', value, rules: ['phone'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测非中文
    const checkWechat = (rule, value, callback) => {
      const check = this.$validate({ label: '微信', value, rules: ['noChinese', 'max'], conditions: [12] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkQQ = (rule, value, callback) => {
      const check = this.$validate({ label: 'QQ', value, rules: ['noChinese', 'max'], conditions: [12] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测邮箱
    const checkEmail = (rule, value, callback) => {
      const check = this.$validate({ label: '邮箱', value, rules: ['email', 'max'], conditions: [24] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        sexList: [
          { key: '女', value: 1 },
          { key: '男', value: 0 }
        ],
        accountTypeList: [
          { key: '手机用户', value: 0 },
          { key: '论坛用户', value: 1 },
          { key: '平台用户', value: 2 }
        ],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ],
        userList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          create_user: '',
          account: '',
          name: ''
        },
        list: [
          { type: 'input', label: '账户', value: 'account' },
          { type: 'input', label: '用户名', value: 'name' },
          { type: 'select', label: '创建人', value: 'create_user', list: 'userList' },
          // {type: 'date', label: '创建时间', value: 'create_time'},
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
          { label: '账号', value: 'account' },
          { label: '用户名', value: 'name' },
          { label: '所属角色', value: 'role_name', minWidth: 120 },
          { label: '性别', value: 'sex', width: 80, list: 'sexList' },
          { label: '账号类型', value: 'type', width: 100, list: 'accountTypeList' },
          { label: '状态', value: 'status', width: 90, type: 'slot', list: 'statusList' },
          { label: '创建人', value: 'create_user_name' },
          { label: '创建时间', value: 'create_time', minWidth: 180 },
          { label: '更新人', value: 'update_user_name' },
          { label: '更新时间', value: 'update_time', minWidth: 180 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '280',
          btList: [
            { label: '启用', type: 'success', icon: 'el-icon-albb-process', event: 'status', loading: 'statusLoading', show: false, slot: true },
            { label: '编辑', type: '', icon: 'el-icon-edit', event: 'update', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          account: '', // *用户账号
          password: '', // *用户密码
          name: '', // *用户昵称
          type: 2, // *用户类型: 0: 手机注册 1: 论坛注册 2: 管理平台添加
          sex: 0, // *性别: 0:男 1:女
          avatar: '', // 头像
          phone: '', // 手机号码
          wechat: '', // 微信
          qq: '', // qq
          email: '', // 邮箱
          desc: '', // 描述
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          { label: '账号', value: 'account', type: 'input', required: true, validator: checkAccount },
          { label: '密码', value: 'password', type: 'password', required: true, validator: checkPwd },
          { label: '昵称', value: 'name', type: 'input', required: true },
          { label: '性别', value: 'sex', type: 'select', list: 'sexList', required: true },
          { label: '头像', value: 'avatar', type: 'slot', className: 'el-form-block' },
          { label: '手机号码', value: 'phone', type: 'input', validator: checkPhone },
          { label: '微信', value: 'wechat', type: 'input', validator: checkWechat },
          { label: 'QQ', value: 'qq', type: 'input', validator: checkQQ },
          { label: '邮箱', value: 'email', type: 'input', validator: checkEmail },
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
          update: '编辑',
          userTransfer: '用户转移'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
      },
      // 用户转移相关信息
      userTransferInfo: {
        user: '',
        toUser: '',
        createUserList: [],
        userName: ''
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
        // 重置转移相关信息
        this.userTransferInfo = {
          user: '',
          toUser: '',
          createUserList: [],
          userName: ''
        }
      }
    },
    'dialogInfo.type' (val) {
      const formInfo = this.formInfo
      switch (val) {
        case 'create':
          for (const item of formInfo.fieldList) {
            if (item.value === 'account') {
              item.type = 'input'
            }
          }
          break
        case 'update':
          for (const item of formInfo.fieldList) {
            if (item.value === 'account') {
              item.type = 'tag'
            }
          }
          break
      }
    }
  },
  mounted () {
    this.initList()
    this.initDataPerms()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPerms () {
      const btList = this.tableInfo.handle.btList
      const btList1 = this.filterInfo.list
      this.$initDataPerms('userMan', btList)
      this.$initDataPerms('userMan', btList1)
    },
    // 初始化验证
    initRules () {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initList () {
      const listTypeInfo = this.listTypeInfo
      getAllApi().then(res => {
        if (res.success) {
          listTypeInfo.userList = res.content.map(item => {
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
    handleClick (event, data) {
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      const userTransferInfo = this.userTransferInfo
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
          data.statusLoading = true
          // 设置参数
          for (const key in data) {
          // 存在则赋值
            if (key in formInfo.data) {
              params[key] = data[key]
            }
          }
          params.status = params.status - 1 >= 0 ? 0 : 1
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
          data.deleteLoading = true
          // 先判断当前用户下是否有子用户，有则需要先进行权限转移后才可删除当前用户
          getCreateUserApi(data.id).then(res => {
            data.deleteLoading = false
            if (res.success) {
              this.$handleAPI(event, deleteApi, data.id).then(res => {
                if (res.success) {
                  tableInfo.refresh = Math.random()
                  // 刷新用户列表
                  this.initList()
                }
              })
            } else {
              this.$confirm('该用户有创建用户，是否将创建用户转移后删除?', '提示', {
                confirmButtonText: '下一步',
                cancelButtonText: '取消',
                type: 'info'
              }).then(() => {
                dialogInfo.type = 'userTransfer'
                dialogInfo.visible = true
                // 设置当前选中数据
                userTransferInfo.user = data.id
                userTransferInfo.userName = data.name
                userTransferInfo.createUserList = res.result
              }).catch(() => {
              })
            }
          }).catch(() => {
            data.deleteLoading = false
          })
          break
          // 弹窗点击关闭
        case 'close':
          dialogInfo.visible = false
          break
          // 弹窗点击保存
        case 'save':
        // 用户转移
          if (dialogInfo.type === 'userTransfer') {
            if (!userTransferInfo.toUser) {
              this.$message({
                showClose: true,
                message: '接收用户不能为空',
                type: 'error',
                duration: 2000
              })
              return
            }
            dialogInfo.btLoading = true
            userTransferApi({ user: userTransferInfo.user, toUser: userTransferInfo.toUser }).then(res => {
              if (res.success) {
                this.$handleAPI('delete', deleteApi, userTransferInfo.user).then(res => {
                  if (res.success) {
                    tableInfo.refresh = Math.random()
                    // 刷新用户列表
                    this.initList()
                  }
                })
                dialogInfo.visible = false
              }
              this.$message({
                showClose: true,
                message: res.message,
                type: res.success ? 'success' : 'error',
                duration: 2000
              })
            }).catch(() => {
              dialogInfo.visible = false
            })
            return
          }
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
            this.$set(item, 'deleteLoading', false)
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
        account: '', // *用户账号
        password: '', // *用户密码
        name: '', // *用户昵称
        type: 2, // *用户类型: 0: 手机注册 1: 论坛注册 2: 管理平台添加
        sex: 0, // *性别: 0:男 1:女
        avatar: '', // 头像
        phone: '', // 手机号码
        wechat: '', // 微信
        qq: '', // qq
        email: '', // 邮箱
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
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
