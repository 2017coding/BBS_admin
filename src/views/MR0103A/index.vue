<template>
  <div class="app-container">
    <!-- 租户页面 -->
    <transition name="left">
      <div v-if="showPage === 'tenant'">
        <!-- 查询模块 -->
        <div class="filter-container">
          <div class="filter-item filter-item_left">
            <label class="filter-label">关键字:</label>
            <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入租户名称/编码" clearable></el-input>
          </div>
          <div class="filter-item filter-item_left">
            <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
          </div>
        </div>
        <!-- 功能模块 -->
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" v-waves @click="handleClickBt('add')">添加租户</el-button>
        </div>
        <!-- 表格 -->
        <el-table ref="table" :data="listInfo.data" :max-height="listInfo.tableHeight || undefined" border style="width:100%" v-loading="listInfo.loading">
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tenant_name" label="租户名称" align="center" min-width="160px">
          </el-table-column>
          <el-table-column prop="tenant_code" label="铺号" align="center" min-width="100px">
          </el-table-column>
          <el-table-column prop="tenant_startTime" label="租赁开始时间" align="center" min-width="160px">
          </el-table-column>
          <el-table-column prop="tenant_endTime" label="租赁结束时间" align="center" min-width="160px">
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="340">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-flashlight" v-waves @click="handleClickBt('relation', scope.row)">租户电表
              </el-button>
              <el-button size="small" type="success" icon="el-icon-edit" v-waves @click="handleClickBt('update', scope.row)" :loading="scope.row.updateLoading">编辑
              </el-button>
              <el-button size="small" type="danger" icon="el-icon-undo" v-waves @click="handleClickBt('return', scope.row)">退铺
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
        <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show" :width="'90%'">
          <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <template v-if="dialogInfo.status !== 'return'">
              <!-- 租户信息 -->
              <div class="tenant">
                <el-form-item label="租户名称" prop="tenant_name">
                  <el-input v-model.trim="form.tenant_name" placeholder="请输入租户名称"></el-input>
                </el-form-item>
                <el-form-item label="租户编码" prop="tenant_code">
                  <el-input v-model.trim="form.tenant_code" placeholder="请输入租户编码"></el-input>
                </el-form-item>
                <el-form-item label="租赁开始时间" prop="tenant_startTime">
                  <el-date-picker
                    v-model="form.tenant_startTime"
                    type="datetime"
                    :clearable="false"
                    format="yyyy-MM-dd HH"
                    placeholder="租赁开始时间">
                  </el-date-picker>
                </el-form-item>
              </div>
              <!-- 表计列表 -->
              <div class="metr">
                <el-button
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
                    :data="listInfo.data" 
                    border 
                    style="width:100%"
                    v-loading="listInfo.loading">
                    <el-table-column align="center" label="序号" width="80">
                      <template slot-scope="scope">
                        <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="metr_code" label="电表编号" align="center" min-width="160px">
                    </el-table-column>
                    <el-table-column prop="metr_name" label="电表名称" align="center" min-width="160px">
                    </el-table-column>
                    <el-table-column prop="ct_rate" label="CT变比" align="center" min-width="80px">
                    </el-table-column>
                    <!-- <el-table-column prop="rate" label="分摊比例" align="center" min-width="80px">
                    </el-table-column> -->
                    <el-table-column prop="ss" label="电损系数" align="center" min-width="80px">
                    </el-table-column>
                    <el-table-column prop="start_time" label="开始时间" align="center" min-width="160px">
                    </el-table-column>
                    <el-table-column prop="start_value" label="开始读数" align="center" min-width="120px">
                    </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button size="small" type="success" icon="el-icon-edit" v-waves @click="handleClickBt('update', scope.row)" :loading="scope.row.updateLoading">编辑
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-sort" v-waves @click="handleClickBt('delete', scope.row)">停用
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </template>
            <template v-else>
              <el-form-item label="租赁结束时间" prop="tenant_endTime">
                <el-date-picker
                  v-model="form.tenant_endTime"
                  type="datetime"
                  :clearable="false"
                  format="yyyy-MM-dd HH"
                  placeholder="租赁结束时间">
                </el-date-picker>
              </el-form-item>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel('form')">取消</el-button>
            <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </transition>
    <!-- 表计页面 -->
    <transition name="left">
      <template v-if="showPage === 'meter'">
        <Meter :showPage.sync="showPage" :tenantInfo="tenantInfo"></Meter>
      </template>
    </transition>
  </div>
</template>

<script>
import Meter from './components/meter'
import { mapGetters } from 'vuex'
// 引入接口
import { getRoleApi, getRowApi, getListApi, addUserApi, updateUserApi, updateUserStatusApi, deleteUserApi } from '@/api/project/S0902A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'P0404A',
  components: {
    Meter
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
        // 角色列表
        roleList: [
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
          add: '添加租户',
          update: '编辑租户',
          return: '退铺'
        },
        show: false,
        status: '',
        btLoading: false
      },
      // 表单参数
      form: {
        tenant_id: '', // * 租户ID
        tenant_name: '', // * 租户名称
        tenant_code: '', // * 租户编码
        tenantMetrList: [],
        tenant_startTime: '', // * 租赁开始时间
        tenant_endTime: '' // * 租赁结束时间
      },
      // 表单验证规则
      rules: {
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
      }
    }
  },
  methods: {
    // 初始化查询相关数据
    initlistTypeInfo () {
    },
    // 得到数据
    getList () {
      this.listInfo.data = [
        {
          tenant_id: 1, // * 租户ID
          tenant_name: '租户1', // * 租户名称
          tenant_code: '10211', // * 租户编码
          tenant_startTime: '2018-02-02 08:30:00', // * 租赁开始时间
          tenant_endTime: '-' // * 租赁结束时间
        },
        {
          tenant_id: 2, // * 租户ID
          tenant_name: '租户2', // * 租户名称
          tenant_code: '09877', // * 租户编码
          tenant_startTime: '2015-10-09 01:12:33', // * 租赁开始时间
          tenant_endTime: '2018-01-22 20:04:17' // * 租赁结束时间
        },
        {
          tenant_id: 3, // * 租户ID
          tenant_name: '租户3', // * 租户名称
          tenant_code: '07433', // * 租户编码
          tenant_startTime: '2013-12-12 10:46:01', // * 租赁开始时间
          tenant_endTime: '2014-05-11 19:31:09' // * 租赁结束时间
        }
      ]
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
        this.dialogInfo.show = true
        this.dialogInfo.status = 'update'

        for (let key in row) {
          this.form[key] = row[key]
        }
        break
      case 'return':
        this.dialogInfo.show = true
        this.dialogInfo.status = 'return'
        break
      case 'status':
        this.handleSwitchStatus(row)
        break
      case 'relation':
        this.showPage = 'meter'
        this.tenantInfo = row
        break
      case 'addMetr':
        break
      }
    },
    // 切换状态
    handleSwitchStatus (row) {
    },
    // 确认的事件处理
    handleConfirm (type) {
    },
    // 删除的事件处理
    handleDelete (row) {
    },
    // 取消按钮的点击
    handleCancel () {
      this.dialogInfo.show = false
    },
    // 表单初始化
    resetForm () {
      this.form = {
        metr_id: '', // 表计ID *
        metr_code: '', // 表计code *
        metr_name: '', // 表计名称 *
        rate: '', // 分摊比例 *
        start_time: '', // 开始时间 *
        start_value: '', // 开始读数 *
        end_time: '', // 结束时间 *
        end_value: '' // 结束读数 *
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tenant{
    padding-top: 20px;
    .el-form-item{
      width: 33%;
      .el-form-item__content{
        .el-input, .el-select, .el-textarea{
          width: 160px;
        }
      }
    }
  }
  .metr{
    .el-form-item{
      width: 24%;
      .el-form-item__label{
        width: 80px;
      }
      .el-form-item__content{
        .el-input, .el-select, .el-textarea{
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
</style>
