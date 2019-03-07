<template>
  <div class="app-container">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item filter-item_left">
        <label class="filter-label">状态:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.stct_status" placeholder="请选择状态" clearable>
          <el-option v-for="(item, index) in  listTypeInfo.statusList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入快捷名称" clearable></el-input>
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
    <el-table ref="table" :data="listInfo.data" :max-height="listInfo.tableHeight || undefined" border style="width:100%" v-loading="listInfo.loading">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stct_name" label="快捷名称" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="stct_icon" label="快捷图标" align="center" width="80px">
        <template slot-scope="scope">
          <i :class="scope.row.stct_icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="stct_type" label="快捷类型" align="center" min-width="160px">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo.stctTypeList, value: 'value', label: 'key', data: scope.row.stct_type})}}
        </template>
      </el-table-column>
      <el-table-column prop="stct_status" label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <i :class="scope.row.stct_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.stct_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" :type="scope.row.stct_status === 1 ? 'danger' : 'success'" icon="el-icon-sort" v-waves @click="handleClickBt('status', scope.row)" :loading="scope.row.statusLoading">
            {{scope.row.stct_status === 1 ? '停用' : '启用'}}
          </el-button>
          <el-button size="small" type="success" icon="el-icon-edit" v-waves @click="handleClickBt('update', scope.row)" :loading="scope.row.updateLoading">编辑
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" v-waves @click="handleClickBt('delete', scope.row)">删除
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
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="快捷名称" prop="stct_name">
          <el-input v-model.trim="form.stct_name" placeholder="请输入快捷名称"></el-input>
        </el-form-item>
        <el-form-item label="绑定模块" prop="stct_mod_id" class="el-form-block">
          <el-input :value="form.stct_mod_id ? $fn.getDataName({dataList: routerList, value: 'mod_id', label: 'mod_name', data: form.stct_mod_id}) : '请选择模块'" disabled>
          </el-input>
          <el-button type="success" size="small" @click="handleClickBt('selectMod')">选择模块</el-button>
        </el-form-item>
        <el-form-item label="快捷图标" prop="stct_icon">
          <el-select v-model="form.stct_icon" placeholder="请选择快捷图标" filterable clearable>
            <template slot="prefix">
              <i :class="'header-icon ' + form.stct_icon" style="vertical-align: middle; font-size: 20px; color: black" v-if="form.stct_icon"></i>
            </template>
            <el-option v-for="(item, index) in  iconList" :key="index" :label="item.class" :value="item.class">
              <slot>
                <i :class="item.class" style="display: inline-block; vertical-align: middle; width: 30px; font-size: 20px"></i>{{item.class}}
              </slot>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快捷类型" prop="stct_type">
          <el-select v-model="form.stct_type" placeholder="请选择快捷类型">
            <el-option v-for="item in  listTypeInfo.stctTypeList" :key="item.value" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="stct_status">
          <el-select v-model="form.stct_status" placeholder="请选择状态">
            <el-option v-for="item in  listTypeInfo.statusList" :key="item.value" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择功能模块的弹窗-->
    <el-dialog title="选择功能模块" :visible.sync="dialogInfo.modShow">
      <Tree
        :treeData="treeData"
        :rightClick="true"
        :expandAll="false"
        :draggable="false"
        @cdHandleClickLeft="cdHandleClickLeft">
      </Tree>
    </el-dialog>
  </div>
</template>

<script>
import { iconList } from './js/icon.js'
import { mapGetters } from 'vuex'
// 引入接口
import { getRowApi, getListApi, addStctApi, updateStctApi, updateStctStatusApi, deleteStctApi } from '@/api/project/SMR0501A'
 import Tree from '@/components/tree/index'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'P0404A',
  components: {
    Tree
  },
  data () {
    return {
      iconList,
      // 列表相关
      listInfo: {
        ableHeight: 0,
        data: [],
        total: 0,
        loading: false,
        pageSizes: this.$config.PAGESIZES,
        // 查询条件
        query: {
          curPage: 1,
          pageSize: this.$config.PAGESIZE,
          proj_id: '', // 项目ID
          keyword: '', // 关键字
          stct_status: '' // 状态
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 快捷类型列表
        stctTypeList: [
          {value:  1, key: '功能导航'},
          {value:  2, key: '报表导航'}
        ],
        // 状态
        statusList: [
          {value:  0, key: '停用'},
          {value:  1, key: '启用'}
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加',
          update: '编辑',
          selectMod: '选择功能模块'
        },
        show: false,
        modShow: false,
        status: '',
        btLoading: false
      },
      // 表单参数
      form: {
        stct_id: '', // ID
        stct_proj_id: '', // 项目ID
        stct_type: '', // 快捷类型
        stct_name: '', // 快捷名称
        stct_icon: '', // 快捷图标
        stct_mod_id: '', // 绑定模块
        stct_status: 1 // 状态
      },
      // 表单验证规则
      rules: {
        stct_name: [
          {
            required: true,
            message: "请输入快捷名称",
            trigger: ['blur', 'change']
          }
        ],
        stct_mod_id: [
          {
            required: true,
            message: "请选择快捷图标",
            trigger: ['blur', 'change']
          }
        ],
        stct_icon: [
          {
            required: true,
            message: "请选择绑定模块",
            trigger: ['blur', 'change']
          }
        ],
        stct_type: [
          {
            required: true,
            message: "请选择快捷类型",
            trigger: ['blur', 'change']
          }
        ],
        stct_status: [
          {
            required: true,
            message: "请选择状态",
            trigger: ['blur', 'change']
          }
        ]
      },
      treeData: [],
      // 选择文件初始化标志
      selecModIndex: 0,
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo',
      'routerList',
      'userInfo'
    ])
  },
  mounted () {
    // 初始化参数
    this.listInfo.query.proj_id = this.projectInfo.proj_id

    this.initlistTypeInfo()
    this.getList()

    // 得到表格的高度
    this.listInfo.tableHeight = this.$fn.getTableHeight()

    // 监听页面大小改变
    window.addEventListener('resize', () => {
      // 得到表格的高度
      this.listInfo.tableHeight = this.$fn.getTableHeight()
    })
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
      }
    },
    'dialogInfo.modShow' () {
      this.selecModIndex = 0
    }
  },
  methods: {
    // 初始化查询相关数据
    initlistTypeInfo () {
    },
    // 得到数据
    getList () {
      this.listInfo.loading = true
      getListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            // 对数据做处理
            response.content.data.forEach(item => {
              let obj = {updateLoading: false, statusLoading: false}
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
    // 树状左键的点击
    cdHandleClickLeft (data) {
      // 初始化
      this.selecModIndex++
      // 初始化完成后的第一次点击
      if (this.selecModIndex === 2) {
        this.form.stct_mod_id = data.mod_id
        this.dialogInfo.modShow = false
      }
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
        getRowApi({stct_id: row.stct_id}).then(response => {
          row.updateLoading = false
          this.dialogInfo.show = true
          this.dialogInfo.status = type
          if (response.content.data && Array.isArray(response.content.data)) {
            // 将当前行数据换成服务端数据
            for(let key in row) {
              if (response.content.data[0][key]) {
                row[key] = response.content.data[0][key]
              }
            }
          }
          this.form = JSON.parse(JSON.stringify(row))
        })
        .catch(() => {
          this.form = JSON.parse(JSON.stringify(row))
          row.updateLoading = false
        })
        break
      case 'delete':
        this.handleDelete(row)
        break
      case 'status':
        this.handleSwitchStatus(row)
        break
      case 'selectMod':
        this.dialogInfo.modShow = true
        this.treeData = this.$fn.getTreeArr({
          pKey: 'mod_pid',
          key: 'mod_id',
          rootPValue: 0,
          data: this.routerList.filter(item => {
            item.name = item.mod_name
            return this.projectInfo.menuList.indexOf(item.mod_id) !== -1
          })
        })
        break
      }
    },
    // 切换状态
    handleSwitchStatus (row) {
      let data = JSON.parse(JSON.stringify(row))
      data.stct_status = data.stct_status === 0 ? 1 : 0
      row.statusLoading = true
      updateStctStatusApi(data).then(response => {
        row.statusLoading = false
        if (response.success) {
          // 切换成功之后更换当前行的状态
          row.stct_status = data.stct_status
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
      this.$refs.form.validate(valid => {
        if (valid) {
          let api
          // 初始化参数
          this.form.stct_proj_id = this.projectInfo.proj_id
          if (type === 'add') {
            api = addStctApi
          } else if (type === 'update') {
            api = updateStctApi
          } else {
            return
          }
          this.dialogInfo.btLoading = true
          api(this.form)
            .then(response => {
              if (response.success) {
                this.dialogInfo.show = false
                this.getList()
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
          deleteStctApi({stct_id: row.stct_id}).then(response => {
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
        stct_id: '', // ID
        stct_proj_id: '', // 项目ID
        stct_type: '', // 快捷类型
        stct_name: '', // 快捷名称
        stct_icon: '', // 快捷图标
        stct_mod_id: '', // 绑定模块
        stct_status: 1 // 状态
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
