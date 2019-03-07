<template>
  <div class="">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item">
        <label class="filter-label">状态:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.status" placeholder="请选择状态" clearable>
          <el-option v-for="(item, index) in  listTypeInfo.statusList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入报警组名称" clearable></el-input>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
      </div>
    </div>
    <!-- 功能模块 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" v-waves @click="handleClickBt('add')">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="table" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="algp_name" label="报警组名称" align="center" min-width="160px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看报警组用户" placement="left">
            <a style="color: red; padding: 0 20px;" @click="handleClickBt('showGroup', scope.row)">{{scope.row.algp_name}}</a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="algp_status" label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <i :class="scope.row.algp_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.algp_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="440">
        <template slot-scope="scope">
          <el-button 
            size="small" 
            type="primary" 
            icon="el-icon-setting" 
            v-waves 
            @click="handleClickBt('group', scope.row)"
            :loading="scope.row.roleLoading">
            设置组员
          </el-button>
          <el-button 
            size="small" 
            :type="scope.row.algp_status === 1 ? 'danger' : 'success'"
            icon="el-icon-sort" 
            v-waves 
            @click="handleClickBt('status', scope.row)" 
            :loading="scope.row.statusLoading">
            {{scope.row.algp_status === 1 ? '停用' : '启用'}}
          </el-button>
          <el-button 
            size="small" 
            type="success" 
            icon="el-icon-edit" 
            v-waves 
            @click="handleClickBt('update', scope.row)" 
            :loading="scope.row.updateLoading">编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            icon="el-icon-delete" 
            v-waves 
            @click="handleClickBt('delete', scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div v-show="!listInfo.loading" class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listInfo.query.curPage"
        :page-sizes="listInfo.pageSizes"
        :page-size="listInfo.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="listInfo.total">
      </el-pagination>
    </div>
    <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show">
      <!-- 添加和编辑的时候显示的内容 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" v-if="dialogInfo.status !== 'group' && dialogInfo.status !== 'showGroup'">
        <el-form-item label="报警组名称" prop="algp_name">
          <el-input v-model.trim="form.algp_name" placeholder="请输入报警组名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="algp_status">
          <el-select v-model="form.algp_status" placeholder="请选择状态">
            <el-option v-for="(item, index) in  listTypeInfo.statusList" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 设置权限显示的内容 -->
      <Tree
        v-if="(dialogInfo.status === 'group' || dialogInfo.status === 'showGroup') && dialogInfo.show"
        :treeData="dialogInfo.status === 'group' ? treeInfo.initData : treeInfo.roleData"
        :expandAll="true"
        :checkBox="dialogInfo.status === 'group'"
        :defaultChecked="treeInfo.defaultChecked" 
        @cdHandleTreeCheck="cdHandleTreeCheck">
      </Tree>
      <div slot="footer" class="dialog-footer" v-if="dialogInfo.status !== 'showGroup'">
        <el-button @click="handleCancel('form')">取消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入接口
import { getUserByProjectApi, getAlarmGroupRowApi, getAlarmGroupListApi, addAlarmGroupApi,
         updateAlarmGroupApi, deleteAlarmGroupApi } from '@/api/project/S0604A'
import Tree from '@/components/tree/index'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'P0403A',
  components: {
    Tree
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        data: [],
        total: 0,
        loading: false,
        pageSizes: this.$config.PAGESIZES,
        // 查询条件
        query: {
          curPage: 1,
          pageSize: this.$config.PAGESIZE,
          proj_id: '', // 项目ID
          status: '', // 状态
          keyword: '' // 关键字
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 状态
        statusList: [
          {value:  0, key: '停用'},
          {value:  1, key: '启用'}
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          group: '设置组成员',
          showGroup: '查看组成员',
          add: '添加',
          update: '编辑'
        },
        show: false,
        status: '',
        btLoading: false
      },
      // 表单参数
      form: {
        algp_id: '', // 报警组ID *
        algp_proj_id: '', // 项目ID *
        algp_name: '', // 报警组名称 *
        algp_persons: '', // 人员 *
        algp_status: 1 // 状态 *
      },
      // 表单验证规则
      rules: {
      },
      // 菜单数据
      treeInfo: {
        roleId: 0,
        baseData: [], // 基础数据
        initData: [], // 数状数据
        roleData: [], // 已有权限的数状数据
        defaultChecked: [], // 默认选中
        checkedMods: [] // 选中
      }
    }
  },
  computed: {
    ...mapGetters([
      'routerTree',
      'userInfo',
      'theme',
      'routerList',
      'projectInfo'
    ])
  },
  mounted () {
    // 初始化参数
    this.listInfo.query.proj_id = this.projectInfo.proj_id
    
    this.initData()
    this.initlistTypeInfo()
    this.getList()
  },
  watch: {
    'dialogInfo.show' () {
      // 弹窗隐藏时，将弹窗数据初始化
      if (!this.dialogInfo.show) {
        // 表单验证初始哈
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        // 表单内容初始化
        this.resetForm()
        // 按钮loading消失
        this.dialogInfo.btLoading = false

        // 初始化菜单数据
        this.treeInfo.roleId = 0
        this.treeInfo.roleData = []
        this.treeInfo.defaultChecked = []
        this.treeInfo.checkedMods = []
      }
    }
  },
  methods: {
    initData () {
      // 得到基础的模块数据
      getUserByProjectApi({proj_id: this.projectInfo.proj_id}).then(response => {
        let arr = response.content.data, arr1 = []
        this.treeInfo.baseData = arr
        arr.forEach(item => {
          // 将不存在的角色类型添加到数组中
          {
            let key = 0
            for (let item1 of arr1) {
              if (item1.id !== ('role' + item.role_id)) {
                key++
              }
            }
            if (key === arr1.length) {
              arr1.push({id: 'role' + item.role_id, roleId: item.role_id, roleName: item.role_name, name: item.role_name, pid: 0})
            }
          }
          // 将所有用户添加到数组中
          arr1.push({id: item.user_id, userId: item.user_id, userName: item.user_name, name: item.user_name, pid: 'role' + item.role_id})
        })
        this.treeInfo.initData = this.$fn.getTreeArr({key: 'id', pKey: 'pid', rootPValue: 0, data: JSON.parse(JSON.stringify(arr1))})
      })
      .catch(() => {
        console.log('获取角色类型列表失败')
      })
      
    },
    // 初始化查询相关数据
    initlistTypeInfo () {
      // 得到所有的角色类型列表
      // getUserByProjectApi({proj_id: this.projectInfo.proj_id}).then(response => {
      //   this.listTypeInfo.userList = response.content.data
      // })
      // .catch(() => {
      //   console.log('获取角色类型列表失败')
      // })
    },
    // 树的选择
    cdHandleTreeCheck (val, arr) {
      if (!arr) return
      // 得到勾选的用户数据
      let userIdList = arr.map(item => {
        return item.userId
      }).filter(item => item)
      this.treeInfo.checkedMods = userIdList
    },
    // 得到数据
    getList () {
      this.listInfo.loading = true
      getAlarmGroupListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            // 对数据做处理
            response.content.data.forEach(item => {
              let obj = {updateLoading: false, statusLoading: false, roleLoading: false}
              item = Object.assign(item, obj)
            })

            this.listInfo.data = response.content.data
            this.listInfo.total = response.content.total
            this.listInfo.query.curPage = response.content.curPage
            this.listInfo.query.pageSize = response.content.pageSize
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
        .catch(() => {
          this.listInfo.loading = false
        })
    },
    // 页面切换
    handleCurrentChange (val) {
      this.listInfo.query.curPage = val // 当前页
      this.getList()
    },
    // 页数改变
    handleSizeChange (val) {
      this.listInfo.query.pageSize = val  // 一页几个
      this.getList()
    },
    // 按钮的点击
    handleClickBt (type, row) {
      switch (type) {
      case 'add':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'add'
        break
      case 'update':
        // 显示当前数据（接口获取成功显示接口返回数据，获取失败显示本地数据）
        row.updateLoading = true
        getAlarmGroupRowApi({algp_id: row.algp_id}).then(response => {
          row.updateLoading = false
          this.dialogInfo.show = true
          this.dialogInfo.status = 'update'
          if (response.content.data && Array.isArray(response.content.data)) {
            this.form = response.content.data[0]
            // 将当前行数据换成服务端数据
            for(let key in row) {
              if (response.content.data[0][key]) {
                row[key] = response.content.data[0][key]
              }
            }
          } else {
            this.form = row
          }
        })
        .catch(() => {
          this.form = row
          row.updateLoading = false
        })
        break
      case 'delete':
        this.handleDelete(row)
        break
      case 'status':
        this.handleSwitchStatus(row)
        break
      case 'group':
        this.treeInfo.roleId = row.role_id
        // 得到当前角色对应模块 
        row.roleLoading = true
        getAlarmGroupRowApi({algp_id: row.algp_id}).then(response => {
          row.roleLoading = false
          this.dialogInfo.show = true
          this.dialogInfo.status = 'group'
          if (response.content.data && Array.isArray(response.content.data)) {
            this.form = response.content.data[0]
            // 将当前行数据换成服务端数据
            for(let key in row) {
              if (response.content.data[0][key]) {
                row[key] = response.content.data[0][key]
              }
            }
          } else {
            this.form = row
          }

          // 得到选中的数据
          this.treeInfo.defaultChecked = this.form.algp_persons.split(',')
        })
        .catch(() => {
          this.form = row
          // 得到选中的数据
          this.treeInfo.defaultChecked = this.form.algp_persons.split(',')
          row.updateLoading = false
        })
        break
      case 'showGroup':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'showGroup'

        // 得到当前报警组成员
        let data, arr1 = []
        getAlarmGroupRowApi({algp_id: row.algp_id}).then(response => { 
          if (response.content.data && Array.isArray(response.content.data)) {
            data = response.content.data[0]
          } else {
            data = row
          }

          this.treeInfo.baseData.forEach(item => {
            let users = data.algp_persons.split(',')
            for (let item1 of users) {
              if (item.user_id === item1) {
                // 将不存在的角色类型添加到数组中
                {
                  let key = 0
                  for (let item3 of arr1) {
                    if (item3.id !== ('role' + item.role_id)) {
                      key++
                    }
                  }
                  if (key === arr1.length) {
                    arr1.push({id: 'role' + item.role_id, roleId: item.role_id, roleName: item.role_name, name: item.role_name, pid: 0})
                  }
                }
                // 将所有用户添加到数组中
                arr1.push({id: item.user_id, userId: item.user_id, userName: item.user_name, name: item.user_name, pid: 'role' + item.role_id})
              }
            }
          })
          this.treeInfo.roleData = this.$fn.getTreeArr({key: 'id', pKey: 'pid', rootPValue: 0, data: JSON.parse(JSON.stringify(arr1))})
        })
        .catch(() => {
          data = row

          this.treeInfo.baseData.forEach(item => {
            let users = data.algp_persons.split(',')
            for (let item1 of users) {
              if (item.user_id === item1) {
                // 将不存在的角色类型添加到数组中
                {
                  let key = 0
                  for (let item3 of arr1) {
                    if (item3.id !== ('role' + item.role_id)) {
                      key++
                    }
                  }
                  if (key === arr1.length) {
                    arr1.push({id: 'role' + item.role_id, roleId: item.role_id, roleName: item.role_name, name: item.role_name, pid: 0})
                  }
                }
                // 将所有用户添加到数组中
                arr1.push({id: item.user_id, userId: item.user_id, userName: item.user_name, name: item.user_name, pid: 'role' + item.role_id})
              }
            }
          })
          this.treeInfo.roleData = this.$fn.getTreeArr({key: 'id', pKey: 'pid', rootPValue: 0, data: JSON.parse(JSON.stringify(arr1))})
        })
        break
      }
    },
    // 切换状态
    handleSwitchStatus (row) {
      let data = JSON.parse(JSON.stringify(row))
      data.algp_status = data.algp_status === 0 ? 1 : 0
      row.statusLoading = true
      updateAlarmGroupApi(data).then(response => {
        row.statusLoading = false
        if (response.success) {
          // 切换成功之后更换当前行的状态
          row.algp_status = data.algp_status
          TYPE = 'success'
        } else {
          TYPE = 'error'
        }
        MESSAGE = response.message
        this.$message({
          showClose: true,
          message: response.message,
          type: TYPE,
          duration: 3500
        })
      })
      .catch(() => {
        row.statusLoading = false
      })
    },
    // 确认的事件处理
    handleConfirm (type) {
      // 权限分配的处理
      if (type === 'group') {
        this.dialogInfo.show = false
        // 得到选中的人
        this.form.algp_persons = this.treeInfo.checkedMods.join(',')
        this.dialogInfo.btLoading = true
        updateAlarmGroupApi(this.form)
          .then(response => {
            if (response.success) {
              this.dialogInfo.show = false
              TYPE = 'success'
            } else {
              this.dialogInfo.btLoading = false
              TYPE = 'error'
            }
            MESSAGE = response.message
            this.$message({
              showClose: true,
              message: response.message,
              type: TYPE,
              duration: 3500
            })
          })
          .catch(() => {
            this.dialogInfo.btLoading = false
            // this.dialogInfo.show = false
          })
        return
      }
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          let api
          // 初始化参数
          this.form.algp_proj_id = this.projectInfo.proj_id
          if (type === 'add') {
            api = addAlarmGroupApi
          } else if (type === 'update') {
            api = updateAlarmGroupApi
          } else {
            return
          }
          this.dialogInfo.btLoading = true
          api(this.form)
            .then(response => {
              if (response.success) {
                this.getList()
                this.dialogInfo.show = false
                TYPE = 'success'
              } else {
                this.dialogInfo.btLoading = false
                TYPE = 'error'
              }
              this.$message({
                showClose: true,
                message: response.message,
                type: TYPE,
                duration: 3500
              })
            })
            .catch(() => {
              this.dialogInfo.btLoading = false
            })
        }
      })
    },
    // 删除的事件处理
    handleDelete (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAlarmGroupApi(row).then(response => {
            if (response.success) {
              this.getList()
              MESSAGE = '删除成功'
              TYPE = 'success'
            } else {
              MESSAGE = '未知错误'
              TYPE = 'error'
            }
            this.$message({
              showClose: true,
              message: response.message,
              type: TYPE,
              duration: 3500
            })
          })
        })
    },
    // 取消按钮的点击
    handleCancel () {
      this.dialogInfo.show = false
    },
    // 表单初始化
    resetForm () {
      this.form = {
        algp_id: '', // 报警组ID *
        algp_proj_id: '', // 项目ID *
        algp_name: '', // 报警组名称 *
        algp_persons: '', // 人员 *
        algp_status: 1 // 状态 *
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
