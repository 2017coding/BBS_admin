<template>
  <div class="page-children">
    <div class="left">
      <!-- 维度 -->
      <div class="filter-container">
        <div class="filter-item">
          <label class="filter-label">维度:</label>
          <el-select class="filter-item" v-model.number="listInfo.query.dimension" placeholder="请选择维度" filterable style="width: 160px;" @change="handleChangeDimension">
            <el-option v-for="(item, index) in  listTypeInfo.dimensionTypeList" :key="index" :label="item.key" :value="item.value" v-if="entpId === item.dagd_entp_id"></el-option>
          </el-select>
        </div>
      </div>
      <!-- 左侧数结构 -->
      <div class="tree">
        <Tree
          :rightClick="true"
          :loadMetr="false"
          :treeRefresh="treeRefresh"
          :dimension="listTypeInfo.dimensionTypeList.find(item => { item.id = item.dagd_id; item.name = item.key; return item.value === listInfo.query.dimension})"
          @cdHandleClickLeft="cdHandleClickLeft"
          @cdHandleClickRight="cdHandleClickRight"
          @cdHandleRightEvent="cdHandleRightEvent">
        </Tree>
      </div>
    </div>
    <!-- 右侧页面 -->
    <div class="content">
      <!-- 当前位置 -->
      <div class="" style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px">
        <div><span style="color: #97a8be">当前分组:</span> <span style="color: grb(100, 100, 100); cursor: default">{{listInfo.tablePath}}</span></div>
        <el-button class="filter-item" type="danger" icon="el-icon-delete" v-waves @click="handleClickBt('batchDel')">删除</el-button>
      </div>
      <!-- 显示表格 -->
      <el-table 
        ref="table"
        :max-height="listInfo.tableHeight || undefined"
        :data="listInfo.data" 
        border 
        style="width:100%"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        v-loading="listInfo.loading">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="metr_code" label="表计代码" align="center" min-width="120px">
        </el-table-column>
        <el-table-column prop="metr_name" label="表计名称" align="center" min-width="200px">
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
    </div>
     <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show">
      <!-- 添加分组 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" v-if="treeInfo.dialogType === 'addGroup' || treeInfo.dialogType === 'update'">
        <!-- <el-form-item prop="dagp_dagd_id" label="关联维度">
          <el-tag >{{$fn.getDataName({dataList: listTypeInfo.dimensionTypeList, value: 'value', label: 'key', data: form.dagp_dagd_id})}}</el-tag>
        </el-form-item> -->
        <el-form-item prop="dagp_pid" label="父级分组" v-if="treeInfo.rightData.type === 'group'">
          <el-input v-model.trim="form.dagp_pname" placeholder="请选择父级分组" @focus="dialogInfo.showGroup = true"></el-input>
          <!-- <el-input v-model.trim="form.dagp_pid" placeholder="请选择父级分组" @focus="dialogInfo.showGroup = true"></el-input> -->
        </el-form-item>
        <el-form-item prop="dagp_name" label="分组名称">
          <el-input v-model.trim="form.dagp_name" placeholder="请输入分组名称"></el-input>
        </el-form-item>
        <el-form-item prop="dagp_code" label="分组编码">
          <el-input v-model.trim="form.dagp_code" placeholder="请输入分组编码"></el-input>
        </el-form-item>
        <el-form-item prop="dagp_way" label="计量方式">
          <el-select class="filter-item" v-model.number="form.dagp_way" placeholder="请选择计量方式" filterable>
            <el-option v-for="item in  listTypeInfo.wayList" :key="item.value" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dagp_metr_id" label="总表" v-if="form.dagp_way === 1">
          <el-select class="filter-item" v-model.number="form.dagp_metr_id" placeholder="请选择总表" filterable>
            <el-option v-for="item in  listTypeInfo.metrList" :key="item.value" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dagp_sort" label="排序">
          <el-input v-model.number="form.dagp_sort" placeholder="请输入排序"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加表计 -->
      <div class="" v-else>
        <!-- 可添加的表计列表 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="120px"></el-form>
        <DialogPage 
          :selectedList.sync="dialogInfo.selectedList" 
          :dagp_id="listInfo.query.dagp_id"
          :entp_id="entpId"
          v-if="dialogInfo.show">
        </DialogPage>
      </div>
      <!-- 添加和编辑的时候显示的内容 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(treeInfo.dialogType)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择父分组的弹窗 -->
    <el-dialog title="选择父级分组" :visible.sync="dialogInfo.showGroup">
      <GroupTree
        :rightClick="true"
        :treeRefresh="treeRefresh"
        :dimension="listTypeInfo.dimensionTypeList.find(item => { item.id = item.dagd_id; item.name = item.key; return item.value === listInfo.query.dimension})"
        @cdHandleClickLeft="cdHandleSelectGroup">
      </GroupTree>
    </el-dialog>
  </div>
</template>

<script>
import Tree from '@/components/reportTree/index'
import DialogPage from './dialogPage'
import GroupTree from './groupTree'
// 引入接口
import { getRowApi, getListApi, addGroupApi, updateGroupApi, deleteGroupApi,
         getGroupMeterApi, updateGroupMeterApi, deleteGroupMeterApi } from '@/api/project/S0804A'
import { mapGetters } from 'vuex'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'childrenPage',
  props: {
    entpId: {
      type: Number
    }
  },
  components: {
    Tree,
    DialogPage,
    GroupTree
  },
  data () {
    // 检测编码
    const checkCode = (rule, value, callback) => {
      let check = this.$validate({label: '编码', value, rules: ['noChinese', 'max'], conditions: [12]})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检查数字
    const checkNum = (rule, value, callback) => {
      let check = this.$validate({label: '排序', value, rules: ['notnull', 'number']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      // 列表相关
      listInfo: {
        pageInit: true,
        tableHeight: 0,
        data: [],
        // 表计
        meter: [],
        total: 0,
        loading: false,
        pageSizes: this.$config.PAGESIZES,
        // 查询条件
        query: {
          curPage: 1,
          pageSize: this.$config.PAGESIZE,
          dimension: '',
          dagp_id: '',
          dagp_pid: '',
          dagp_pname: ''
        },
        tablePath: '维度' // 表格显示的位置
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 维度列表
        dimensionTypeList: [],
        // 计量方式
        wayList: [
          {value:  1, key: '总表计量'},
          {value:  2, key: '子表计量'}
        ],
        // 总表列表
        metrList: [
        ]
      },
      // 表单数据
      form: {
        dagp_id: '', // 分组ID *
        dagp_proj_id: '', // 项目ID
        dagp_dagd_id: '', // 分组维度ID *
        dagp_pid: '', // 分组父ID *
        dagp_pname: '', // 父分组名称
        dagp_code: '', // 编码 
        dagp_name: '', // 分组名称 *
        dagp_way: '', // 计量方式 *
        dagp_metr_id: '', // 总表ID
        dagp_sort: '' // 分组排序 *
      },
      // 验证规则
      rules: {
        dagp_dagd_id: [
          {
            required: true,
            message: "请选择分组维度",
            trigger: ['blur', 'change']
          }
        ],
        dagp_pid: [
          {
            required: true,
            message: "请选择父分组",
            trigger: ['blur', 'change']
          }
        ],
        dagp_name: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: ['blur', 'change']
          }
        ],
        dagp_code: [
          {
            validator: checkCode,
            trigger: ['blur', 'change']
          }
        ],
        dagp_way: [
          {
            required: true,
            message: "请选择计量方式",
            trigger: ['blur', 'change']
          }
        ],
        dagp_metr_id: [
          {
            required: true,
            message: "请选择总表",
            trigger: ['blur', 'change']
          }
        ],
        dagp_sort: [
          {
            required: true,
            validator: checkNum,
            trigger: ['blur', 'change']
          }
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加',
          update: '编辑'
        },
        show: false,
        showGroup: false,
        status: '',
        btLoading: false,
        selectedList: []
      },
      // 树组件相关数据
      treeInfo: {
        dialogType: 'add', // 当前右键点击的类型
        eventType: '',
        rightData: {}, // 右键点击数据
        data: ''
      },
      treeRefresh: 0,
      // 选择的表计
      selectedMetrs: []
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
    ])
  },
  mounted () {
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
    entpId () {
      this.initlistTypeInfo()
    },
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
        // 清除选择的数据
        this.dialogInfo.selectedList = []
      } else {
        // 参数绑定
        this.form.dagp_dagd_id = this.listInfo.query.dimension
        this.form.dagp_pid = this.listInfo.query.dagp_pid
        this.form.dagp_pname = this.listInfo.query.dagp_pname
      }
    },
    'dialogInfo.showGroup' () {
      // 参数绑定
      this.form.dagp_pid = this.listInfo.query.dagp_pid
      this.form.dagp_pname = this.listInfo.query.dagp_pname
    },
    'dialogInfo.selectedList' (val) {
      // console.log(val)
    }
  },
  methods: {
    /**
     * 通过当前数据类型和事件类型，得到当前的接口
     * @param {String} type 数据类型
     * @param {String} eventType 事件类型
     * @return {Function} API 接口函数
     */
    handleApi (eventType, data) {
      let api
      switch (eventType) {
      case 'addGroup':
        api = addGroupApi
        break
      case 'update':
        api = updateGroupApi
        break
      case 'delete':
        api = deleteGroupApi
        break
      case 'addMeter':
        api = updateGroupMeterApi
        break
      case 'refresh':
        api = getMeterListApi
        break
      }

      // 请求对应的接口
      return new Promise((resolve, reject) => {
        api(data).then(response => {
          if (response.success) {
            resolve(response)
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
            reject()
          }
        })
        .catch(() => {
          reject()
        })
      })
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data) {
      // 页数初始化
      this.listInfo.initCurPage = true

      this.listInfo.tablePath = data.pathName
      // 如果点击的是分组
      if (data.dagp_id) {
        this.listInfo.query.dagp_id = data.dagp_id || 0
        // 获取表格数据
        this.getList()
      } else {
        this.listInfo.data = []
        this.listInfo.total = 0
      }
    },
    // 树状组件右键的点击事件
    cdHandleClickRight (data, node) {
    },
    // 数状组件右键事件点击的处理
    cdHandleRightEvent (type, data) {
      this.treeInfo.rightData = data
      this.treeInfo.dialogType = type
      this.handleClickBt(type, data)
      // 添加编辑分组时，对参数处理
      if (type === 'addGroup') {
        this.listInfo.query.dagp_id = ''
        this.listInfo.query.dagp_pid = data.dagp_id || 0
        this.listInfo.query.dagp_pname = data.dagp_name
      } else {
        this.listInfo.query.dagp_id = data.dagp_id || 0
        this.listInfo.query.dagp_pid = data.dagp_pid || 0
        this.listInfo.query.dagp_pname = data.dagp_pname
      }
    },
    // 选择父分组
    cdHandleSelectGroup (data) {
      this.listInfo.query.dagp_pid = data.type === 'dimension' ? 0 : data.dagp_id || 0
      this.listInfo.query.dagp_pname = data.type === 'dimension' ? data.dagd_name : data.dagp_name
      this.dialogInfo.showGroup = false
    },
    // 得到不同类型的列表
    initlistTypeInfo () {
      // 得到维度类型的数据
      this.$api.getDagdByEntpApi({dagd_entp_id: this.entpId, all: 1, proj_id: this.projectInfo.proj_id}).then(response => {
        if (response.success) {
          this.listTypeInfo.dimensionTypeList = response.content.data

          let key = 0
          this.listTypeInfo.dimensionTypeList.forEach(item => {
            item.key = item.dagd_name
            item.value = item.dagd_id
            item.pathName = item.dagd_code ? item.dagd_name + ' [' + item.dagd_code + ']' : item.dagd_name
            item.dagp_pname = item.dagd_name
            // 初始化选中第一个
            if (key === 0 && this.entpId === item.dagd_entp_id) {
              this.listInfo.query.dimension = item.dagd_id
              this.treeRefresh = Math.random()
              key++
            }
          })
        }
      })
      .catch(() => {
        console.log('获取维度类型失败')
      }),
      // 得到总表列表
      this.$api.getMetrApi({projID : this.projectInfo.proj_id}).then(response => {
        if (response.success) {
          this.listTypeInfo.metrList = response.content.data

          let key = 0
          this.listTypeInfo.metrList.forEach(item => {
            item.key = item.metr_name
            item.value = item.metr_id
          })
        }
      })
      .catch(() => {
        console.log('获取总表失败')
      })
    },
    // 切换维度
    handleChangeDimension () {
      this.treeRefresh = Math.random()
    },
    // 数据处理
    dealParam () {
      // 对数据做处理
      let query = this.listInfo.query

      // 如果点击了树状，则此时请求第一页
      query.curPage = this.listInfo.initCurPage ? 1 : query.curPage
      // 参数重置
      this.listInfo.initCurPage = false
    },
    // 得到数据
    getList () {
      // 存在分组信息往下进行
      if (!this.listInfo.query.dagp_id) {
        return
      }
      this.dealParam()
      this.listInfo.loading = true
      getListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            this.listInfo.data = response.content.data
            this.listInfo.total = response.content.total
            // this.listInfo.query.curPage = response.content.curPage
            // this.listInfo.query.pageSize = response.content.pageSize
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
    // 得到选中的表计
    handleSelectionChange (rows) {
      this.selectedMetrs = rows
    },
    // 按钮的点击
    handleClickBt (type, row) {
      switch (type) {
      case 'addGroup':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'add'
        break
      case 'addMeter':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'add'
        break
      case 'update':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'update'
        // 显示当前数据
        this.form = JSON.parse(JSON.stringify(row))
        break
      case 'delete':
        this.handleDelete(row)
        break
      case 'batchDel':
        this.handleBatchDel()
      }
    },
    // 确认的事件处理
    handleConfirm (type) {
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          // 设置参数
          let param 
          if (type === 'addMeter') {
            param = []
            this.dialogInfo.selectedList.forEach(id => {
              param.push({
                dagr_dagp_id: this.listInfo.query.dagp_id,
                dagr_metr_id: id
              })
            })
            // 表计选择为空时，不进行添加操作
            if (param.length === 0) {
              this.$message({
                showClose: true,
                message: '请选择要添加的表计',
                type: 'error',
                duration: 3500
              })
              return
            }
          } else {
            param = this.form
            param.dagp_pid = this.listInfo.query.dagp_pid
          }
          param.dagp_proj_id = this.projectInfo.proj_id
          // return
          this.dialogInfo.btLoading = true
          this.handleApi(type, param)
            .then(response => {
              if (response.success) {
                if (type === 'addMeter') {
                  // 刷新数据
                  this.getList()
                } else {
                  // 刷新树
                  this.treeRefresh = Math.random()
                }
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
          this.handleApi('delete', row).then(response => {
            if (response.success) {
              // 刷新树
              this.treeRefresh = Math.random()
              TYPE = 'success'
            } else {
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
    // 批量删除
    handleBatchDel () {
      if (this.selectedMetrs.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择要操作的数据',
          type: 'error',
          duration: 3500
        })
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = []
          this.selectedMetrs.forEach(item => {
            param.push({
              dagr_dagp_id: this.listInfo.query.dagp_id,
              dagr_metr_id: item.metr_id
            })
          })
          deleteGroupMeterApi(param).then(response => {
            if (response.success) {
              // 刷新数据
              this.getList()
              TYPE = 'success'
            } else {
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
        dagp_id: '', // 分组ID *
        dagp_proj_id: '', // 项目ID
        dagp_dagd_id: '', // 分组维度ID *
        dagp_pid: '', // 分组父ID *
        dagp_pname: '', // 父分组名称
        dagp_code: '', // 编码 
        dagp_name: '', // 分组名称 *
        dagp_way: '', // 计量方式 *
        dagp_metr_id: '', // 总表ID
        dagp_sort: '' // 分组排序 *
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-children{
    position: relative;
    height: 100%;
    .left{
      position: absolute;
      height: 100%;
    }
    .tree{
      position: absolute;
      left: 0;
      top: 50px;
      bottom: 0;
    }
    .content{
      margin-left: 260px;
    }
  }
</style>
