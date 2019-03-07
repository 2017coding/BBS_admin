<template>
  <div class="app-container SMR0201A">
    <!-- 租户页面 -->
    <transition name="left">
      <div v-if="showPage === 'tenant'">
        <!-- 查询模块 -->
        <div class="filter-container">
          <div class="filter-item filter-item_left">
            <label class="filter-label">关键字:</label>
            <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入铺号" clearable></el-input>
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
          <el-table-column prop="masp_no" label="铺号" align="center" min-width="100px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看铺位信息" placement="left">
                <a style="color: red; padding: 0 20px;" @click="handleClickBt('showMasp', scope.row)">{{scope.row.masp_no}}</a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="masp_floor" label="所在楼层" align="center" min-width="100px">
          </el-table-column>
          <el-table-column prop="masp_desc" label="描述" align="center" min-width="160px">
          </el-table-column>
          <!-- <el-table-column prop="masp_status" label="状态" align="center" width="80px">
            <template slot-scope="scope">
              <i :class="scope.row.masp_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.masp_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="small" :type="scope.row.masp_status === 1 ? 'danger' : 'success'" icon="el-icon-sort" v-waves @click="handleClickBt('status', scope.row)" :loading="scope.row.statusLoading">
                {{scope.row.masp_status === 1 ? '停用' : '启用'}}
              </el-button>
              <el-button size="small" type="success" icon="el-icon-edit" v-waves @click="handleClickBt('update', scope.row)" :loading="scope.row.updateLoading">编辑
              </el-button>
              <!-- <el-button size="small" type="danger" icon="el-icon-delete" v-waves @click="handleClickBt('delete', scope.row)">删除
              </el-button> -->
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
        <!-- 添加电表弹窗 -->
        <el-dialog title="添加电表" :visible.sync="dialogInfo.metrShow" :width="'60%'">
          <DialogPage 
            v-if="dialogInfo.metrShow" 
            :selectedList.sync="dialogInfo.selectedList"
            :selectRows.sync="dialogInfo.selectRows"
            :masp_id="form.masp_id || 0">
          </DialogPage>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClickBt('cancelSave')">取 消</el-button>
            <el-button type="primary" @click="handleClickBt('saveSelect')">保 存</el-button>
          </div>
        </el-dialog>
        <!-- 操作弹窗 -->
        <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show" :width="'70%'" :close-on-click-modal="dialogInfo.status === 'showMasp'">
          <el-form :model="form" :rules="rules" ref="form" label-width="90px">
            <!-- 租户信息 -->
            <div class="tenant">
              <el-form-item label="铺号" prop="masp_no">
                <el-input v-model.trim="form.masp_no" placeholder="请输入铺号" class="masp-input"></el-input>
              </el-form-item>
              <el-form-item label="所在楼层" prop="masp_floor">
                <el-select class="filter-item el-input" v-model="form.masp_floor" placeholder="请选择所在楼层">
                  <el-option v-for="(item, index) in  listTypeInfo.floorList" :key="index" :label="item.key" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述" prop="masp_desc">
                <el-input v-model.trim="form.masp_desc" placeholder="请输入描述" class="desc-input"></el-input>
              </el-form-item>
            </div>
            <!-- 表计列表 -->
            <div class="metr">
              <el-button
                v-if="dialogInfo.status !== 'showMasp'"
                class="handle-bt"
                size="small"
                type="success" 
                @click="handleClickBt('addMetr')">
                添加电表
              </el-button>
              <div class="">
                <el-table 
                  ref="table"
                  :max-height="listInfo.tableHeight || undefined"
                  :data="form.meter_list.filter(item => item.dataflag !== 3)"
                  :row-class-name="tableRowClassName"
                  border 
                  style="width:100%"
                  max-height="400"
                  v-loading="listInfo.loading">
                  <el-table-column prop="metr_no" label="电表编号" align="center" min-width="140px">
                  </el-table-column>
                  <el-table-column prop="metr_name" label="电表名称" align="center" min-width="160px">
                  </el-table-column>
                  <!-- <el-table-column prop="spmt_splitrate" label="分摊" align="center" min-width="160px">
                    <template slot-scope="scope">
                      <el-input-number 
                        v-model="scope.row.spmt_splitrate"
                        :precision="2" 
                        :step="0.01" 
                        :min="0.01" 
                        :max="1" 
                        @change="dataChange(scope.row)">
                      </el-input-number>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="metr_rate" label="CT" align="center" min-width="60px">
                  </el-table-column>
                  <el-table-column prop="metr_elicloss" label="电损" align="center" min-width="80px">
                  </el-table-column>
                  <el-table-column prop="spmt_status" label="状态" align="center" width="80px">
                    <template slot-scope="scope">
                      <i :class="scope.row.spmt_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.spmt_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" align="center" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button
                        v-if="dialogInfo.status === 'update' && (scope.row.dataflag === 2 || scope.row.dataflag === 0) && scope.row.spmt_status === 1"
                        size="small"
                        :type="scope.row.spmt_status === 1 ? 'danger' : 'success'"
                        icon="el-icon-sort"
                        v-waves
                        @click="handleClickBt('statusSelect', scope.row)">
                        {{scope.row.spmt_status === 1 ? '停表' : '启用'}}
                      </el-button>
                      <el-button
                        v-if="scope.row.dataflag === 1"
                        size="small" 
                        type="danger" 
                        icon="el-icon-delete" 
                        v-waves 
                        @click="handleClickBt('deleteSelect', scope.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="dialogInfo.status !== 'showMasp'">
            <el-button @click="handleCancel('show')">取消</el-button>
            <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import DialogPage from './components/DialogPage'
import { mapGetters } from 'vuex'
// 引入接口
import { getMeterListApi, getRowApi, getListApi, addMaspApi, updateMaspApi, updateMaspStatusApi, deleteMaspApi } from '@/api/project/SMR0201A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'SMR0201A',
  components: {
    DialogPage
  },
  data () {
    return {
      showPage: 'tenant',
      tenantInfo: {},
      // 列表相关
      listInfo: {
        tableHeight: 0,
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
          role_id: '', // 所属角色
          // user_proj_id: '', // 所属项目
          status: '' // 状态
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 楼层列表
        floorList: [
          {value:  'F7', key: 'F7'},
          {value:  'F6', key: 'F6'},
          {value:  'F5', key: 'F5'},
          {value:  'F4', key: 'F4'},
          {value:  'F3', key: 'F3'},
          {value:  'F2', key: 'F2'},
          {value:  'F1', key: 'F1'},
          {value:  'B2', key: 'B2'},
          {value:  'B1', key: 'B1'}
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
          add: '添加铺位',
          update: '编辑铺位',
          showMasp: '铺位信息'
        },
        show: false,
        metrShow: false,
        status: '',
        btLoading: false,
        selectedList: [],  // 选择的数据
        selectRows: [] // 选择的详细数据
      },
      // 表单参数
      form: {
        masp_id: '', // *铺位ID
        masp_proj_id: '', // * 项目ID
        masp_no: '', // * 铺号
        masp_floor: 'F7', // * 所在楼层
        masp_desc: '', // * 描述
        meter_list: [], // 表计列表
        user_id: '', // 用户ID
        masp_status: 1 // * 状态
      },
      // 表单验证规则
      rules: {
        masp_no: [
          {
            required: true,
            message: "请输入铺号",
            trigger: ['blur', 'change']
          }
        ],
        masp_floor: [
          {
            required: true,
            message: "请选择楼层",
            trigger: ['blur', 'change']
          }
        ],
        // masp_desc: [
        //   {
        //     required: true,
        //     message: "请输入描述",
        //     trigger: ['blur', 'change']
        //   }
        // ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'projectInfo'
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

        // 清除选择的数据
        this.dialogInfo.selectedList = []
        this.dialogInfo.selectRows = []
      }
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
    // 设置row的样式
    tableRowClassName ({row, rowIndex}) {
      if (row.dataflag === 0 || row.dataflag === 2) {
        return 'update-row'
      }
    },
    // input数据修改
    dataChange (row) {
      // 如果是编辑类型的数据，将数据状态改为2
      if (row.dataflag === 0) {
        row.dataflag = 2 // 设置数据的状态
      }
    },
    // 按钮的点击
    handleClickBt (type, row) {
      let dialogInfo = this.dialogInfo
      switch (type) {
      case 'add':
        dialogInfo.show = true
        dialogInfo.status = 'add'
        break
      case 'update':
        // 显示当前数据（接口获取成功显示接口返回数据，获取失败显示本地数据）
        row.updateLoading = true
      case 'showMasp':
        getRowApi({masp_id: row.masp_id}).then(response => {
          row.updateLoading = false
          dialogInfo.show = true
          dialogInfo.status = type

          const data = response.content.data, obj = {}
          if (data) {
            if (data.ds[0]) {
              obj.masp_no = data.ds[0].masp_no
              obj.masp_desc = data.ds[0].masp_desc
            }
            obj.meter_list = data.ds1.map(item => {
              item.dataflag = 0 // 设置数据的状态
              return item
            })
            this.form = {...JSON.parse(JSON.stringify(row)), ...obj}
          }
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
      case 'addMetr':
        dialogInfo.metrShow = true
        break
      case 'saveSelect':
        // 设置确定选择的数据
        let arr = [
          ...this.form.meter_list.filter(item => item.dataflag === 0 || (item.dataflag && item.dataflag !==1)),
          ...dialogInfo.selectRows.filter(item => {
            // item.spmt_splitrate = 1 // 初始化分摊比例
            item.spmt_status = 1 // 初始化状态
            item.dataflag = 1 // 设置数据的状态
            return dialogInfo.selectedList.indexOf(item.metr_id) !== -1
          })
        ]
        // 改变数据引用的地址
        this.form.meter_list = JSON.parse(JSON.stringify(arr))
        dialogInfo.metrShow = false
        break
      case 'cancelSave':
        // 取消选择，则选择的数据为上一次选择的数据
        dialogInfo.selectedList = this.form.meter_list.map(item => {
          return item.metr_id
        })
        dialogInfo.metrShow = false
        break
      case 'deleteSelect':
        // 如果是已经在数据库的数据，将数据标记为3（删除状态）,不是的话则删除
        if (row.dataflag === 2 || row.dataflag === 0) {
          row.dataflag = 3 // 设置数据的状态
        } else {
          this.form.meter_list.splice(this.form.meter_list.indexOf(row), 1)
        }
        dialogInfo.selectedList.splice(dialogInfo.selectedList.indexOf(row), 1)
        break
      case 'statusSelect':
        // 如果是编辑类型的数据，将数据状态改为2
        if (row.dataflag === 0) {
          this.$confirm('电表停表后无法重新启用, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            row.dataflag = 2 // 设置数据的状态
            row.spmt_status = row.spmt_status === 0 ? 1 : 0
          })
          return
        }
        row.spmt_status = row.spmt_status === 0 ? 1 : 0
        break
      }
    },
    // 切换状态
    handleSwitchStatus (row) {
      let data = JSON.parse(JSON.stringify(row))
      data.masp_status = data.masp_status === 0 ? 1 : 0
      row.statusLoading = true
      updateMaspStatusApi({masp_id: data.masp_id, masp_status: data.masp_status}).then(response => {
        row.statusLoading = false
        if (response.success) {
          // 切换成功之后更换当前行的状态
          row.masp_status = data.masp_status
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
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          let api,
            form = this.form,
            dialogInfo = this.dialogInfo,
            arr = [],
            obj = {
              masp_id: form.masp_id,
              masp_proj_id: form.masp_proj_id || this.projectInfo.proj_id,
              masp_no: form.masp_no,
              masp_floor: form.masp_floor,
              masp_desc: form.masp_desc,
              // masp_status: form.masp_status,
              user_id: this.userInfo.user_id,
              meter_list: arr
            }
            form.meter_list.forEach(item => {
              arr.push({
                spmt_metr_id: item.metr_id,
                spmt_splitrate: item.spmt_splitrate,
                spmt_status: item.spmt_status,
                dataflag: item.dataflag || 0
              })
            })
          if (type === 'add') {
            api = addMaspApi
          } else if (type === 'update') {
            api = updateMaspApi
          } else {
            return
          }
          dialogInfo.btLoading = true
          api(obj)
            .then(response => {
              if (response.success) {
                this.getList()
                dialogInfo.show = false
                TYPE = 'success'
              } else {
                dialogInfo.btLoading = false
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
              dialogInfo.btLoading = false
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
          deleteMaspApi({masp_id: row.masp_id}).then(response => {
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
    handleCancel (key) {
      this.dialogInfo[key] = false
    },
    // 表单初始化
    resetForm () {
      this.form = {
        masp_id: '', // *铺位ID
        masp_proj_id: '', // * 项目ID
        masp_no: '', // * 铺号
        masp_floor: 'F7', // * 所在楼层
        masp_desc: '', // * 描述
        meter_list: [], // 表计列表
        user_id: '', // 用户ID
        masp_status: 1 // * 状态
      }
    }
  }
}
</script>

<style lang="scss">
.SMR0201A{
  .el-input-number{
    width: 140px;
  }
  .el-table .update-row {
    background: oldlace!important;
  }
  .tenant{
    padding-top: 20px;
  }
  .tenant{
    .el-form-item{
      display: inline-block;
      width: auto;
      // flex: 1;
      .el-form-item__label{
        width: 80px;
      }
      .el-form-item__content{
        .el-input{
          width: 80px;
        }
        .masp-input{
          width: 240px;
        }
        .desc-input{
          width: 160px;
        }
      }
    }
  }
  .tenant, .metr{
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px;
    margin-bottom: 20px;
  }
}
</style>
