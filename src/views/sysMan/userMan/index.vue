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
        v-if="dialogInfo.type !== 'userTransfer'"
        :refObj.sync="formInfo.ref"
        :data="formInfo.data"
        :fieldList="formInfo.fieldList"
        :rules="formInfo.rules"
        :labelWidth="formInfo.labelWidth"
        :listTypeInfo="listTypeInfo">
      </page-form>
      <!-- 用户转移 -->
      <div class="" v-else>
        是否将
        <span style="color: red">{{userTransferInfo.userName}}</span>
        创建的用户转移给
        <el-select class="filter-item" v-model="userTransferInfo.toUser" placeholder="请选择一个用户" filterable clearable>
          <el-option v-for="item in listTypeInfo.userList.filter(item => !userTransferInfo.createUserList.includes(item.value) && item.value !== userTransferInfo.user)"
            :key="item.id"
            :label="item.key"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllApi, getListApi, getCreateUserApi, userTransferApi, createApi, updateApi, deleteApi } from '@/api/sysMan/userMan'
import Validate from '@/common/mixin/validate'
import HandleApi from '@/common/mixin/handleApi'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'

export default {
  mixins: [Validate, HandleApi],
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm
  },
  data () {
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        sexList: [
          {key: '女', value: 1},
          {key: '男', value: 0}
        ],
        accountTypeList: [
          {key: '手机用户', value: 0},
          {key: '论坛用户', value: 1},
          {key: '平台用户', value: 2}
        ],
        statusList: [
          {key: '启用', value: 1},
          {key: '停用', value: 0}
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
          {type: 'input', label: '账户', value: 'account'},
          {type: 'input', label: '用户名', value: 'name'},
          {type: 'select', label: '创建人', value: 'create_user', list: 'userList'},
          // {type: 'date', label: '创建时间', value: 'create_time'},
          {type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true},
          {type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false}
        ]
      },
      // 表格相关
      tableInfo: {
        refresh: 1,
        initCurpage: false,
        data: [],
        fieldList: [
          {label: '账号', value: 'account'},
          {label: '用户名', value: 'name'},
          {label: '所属角色', value: 'role_name', minWidth: 120},
          {label: '性别', value: 'sex', width: 80, list: 'sexList'},
          {label: '账号类型', value: 'type', width: 100, list: 'accountTypeList'},
          {label: '状态', value: 'status', width: 90, list: 'statusList'},
          {label: '创建人', value: 'create_user_name'},
          {label: '创建时间', value: 'create_time', minWidth: 180},
          {label: '更新人', value: 'update_user_name'},
          {label: '更新时间', value: 'update_time', minWidth: 180}
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
          {label: '账号', value: 'account', type: 'input', required: true},
          {label: '密码', value: 'password', type: 'password', required: true},
          {label: '昵称', value: 'name', type: 'input', required: true},
          {label: '性别', value: 'sex', type: 'select', list: 'sexList', required: true},
          {label: '头像', value: 'avatar', type: 'input'},
          {label: '手机号码', value: 'phone', type: 'input'},
          {label: '微信', value: 'wechat', type: 'input'},
          {label: 'QQ', value: 'qq', type: 'input'},
          {label: '邮箱', value: 'email', type: 'input'},
          {label: '描述', value: 'desc', type: 'textarea', className: 'el-form-block'},
          {label: '状态', value: 'status', type: 'select', list: 'statusList', required: true}
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
          {label: '关闭', type: '', icon: '', event: 'close', show: true},
          {label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true}
        ]
      },
      // 用户转移相关信息
      userTransferInfo: {
        user: '',
        toUser: '',
        createUserList: [],
        userName: ''
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
      } else {
        if (this.dialogInfo.type === 'create') {
          formInfo.fieldList[0].type = 'input'
        } else if (this.dialogInfo.type === 'update') {
          formInfo.fieldList[0].type = 'tag'
        }
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
      this.filterInfo.list[4].show = this.dataPerms.includes('userMan:create')
      btList[0].show = this.dataPerms.includes('userMan:status')
      btList[1].show = this.dataPerms.includes('userMan:update')
      btList[2].show = this.dataPerms.includes('userMan:delete')
    },
    initParams () {
      // this.filterInfo.query.create_user = this.userInfo.id
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
    handleClickBt (event, data) {
      const tableInfo = this.tableInfo,
        dialogInfo = this.dialogInfo,
        formInfo = this.formInfo,
        userTransferInfo = this.userTransferInfo
      switch (event) {
      // 搜索
      case 'search':
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
        // 先判断当前用户下是否有子用户，有则需要先进行权限转移后才可删除当前用户
        getCreateUserApi(data.id).then(res => {
          if (res.success) {
            this._handleAPI(event, deleteApi, data.id).then(res => {
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
          userTransferApi({user: userTransferInfo.user, toUser: userTransferInfo.toUser}).then(res => {
            if (res.success) {
              this._handleAPI('delete', deleteApi, userTransferInfo.user).then(res => {
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
      }
    },
    // 触发事件
    handleEvent (event, data) {
      switch (event) {
      // 对表格获取到的数据做处理
      case 'list':
        if (!data) return
        data.forEach(item => {
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

<style scoped>

</style>
