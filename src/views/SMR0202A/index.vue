<template>
  <div class="app-container SMR0202A">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入租户名称" clearable></el-input>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves @click="exportExcel()">导出</el-button>
      </div>
    </div>
    <!-- 功能模块 -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" v-waves @click="handleClickBt('add')">新增租户</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="table" :data="listInfo.data" :max-height="listInfo.tableHeight || undefined" border style="width:100%" v-loading="listInfo.loading">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="temt_name" label="租户" align="center" min-width="140px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看租户信息" placement="left">
            <a style="color: red; padding: 0 20px;" @click="handleClickBt('showMasp', scope.row)">{{scope.row.temt_name}}</a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="temt_starttime" label="租赁开始时间" align="center" min-width="120px">
        <template slot-scope="scope">
          {{$fn.switchTime(scope.row.temt_starttime, 'YYYY-MM-DD hh')}}
        </template>
      </el-table-column>
      <el-table-column prop="temt_endtime" label="租赁结束时间" align="center" min-width="120px">
        <template slot-scope="scope">
          {{$fn.switchTime(scope.row.temt_endtime, 'YYYY-MM-DD hh')}}
        </template>
      </el-table-column>
      <el-table-column prop="temt_status" label="状态" align="center" width="80px">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo.statusList, value: 'value', label: 'key', data: scope.row.temt_status})}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="300">
        <template slot-scope="scope">
          <!-- 有审核权限的用户可见 -->
          <el-button
            v-if="scope.row.wkfw_id > 0"
            size="small" 
            type="primary" 
            icon="el-icon-view" 
            v-waves 
            @click="handleClickBt('audit', scope.row)" 
            :loading="scope.row.updateLoading">租户审核
          </el-button>
          <!-- 草稿下可见 -->
          <el-button
            v-if="scope.row.temt_status === 0"
            size="small" 
            type="success" 
            icon="el-icon-edit" 
            v-waves 
            @click="handleClickBt('update', scope.row)" 
            :loading="scope.row.updateLoading">编辑
          </el-button>
          <!-- 已审核状态下可见 -->
          <template v-if="scope.row.temt_status === 2">
            <el-button
              v-if="scope.row.temt_status === 2"
              size="small" 
              type="info" 
              icon="el-icon-plus"
              v-waves 
              @click="handleClickBt('changeMasp_add', scope.row)" 
              :loading="scope.row.updateLoading">增铺
            </el-button>
            <el-button
              v-if="scope.row.temt_status === 2"
              size="small" 
              type="info" 
              icon="el-icon-minus"
              v-waves 
              @click="handleClickBt('changeMasp_del', scope.row)"
              :loading="scope.row.updateLoading">减铺
            </el-button>
          </template>
          <!-- 草稿状态下可删除 -->
          <el-button
            v-if="scope.row.temt_status === 0"
            size="small" 
            type="danger" 
            icon="el-icon-delete"
            v-waves 
            @click="handleClickBt('delete', scope.row)">删除
          </el-button>
          <!-- 已审核状态下可退铺 -->
          <el-button
            v-if="scope.row.temt_status === 2"
            size="small" 
            type="danger" 
            icon="el-icon-undo"
            v-waves 
            @click="handleClickBt('backMasp', scope.row)"
            :loading="scope.row.updateLoading">退铺
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
    <!-- 添加铺位的弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.maspShow" :width="'60%'">
      <DialogPage 
        v-if="dialogInfo.maspShow" 
        :selectedList.sync="dialogInfo.selectedList"
        :selectRows.sync="dialogInfo.selectRows"
        :temt_id="form.temt_id || 0">
      </DialogPage>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClickBt('cancelSave')">取 消</el-button>
        <el-button type="primary" @click="handleClickBt('saveSelect')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show" :width="'70%'" :close-on-click-modal="dialogInfo.status === 'showMasp'">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <!-- 租户信息 -->
        <div class="tenant">
          <el-form-item label="租户名称" prop="temt_name">
            <el-tag v-if="dialogInfo.status === 'backMasp' || form.temt_status > 0">{{form.temt_name}}</el-tag>
            <el-input v-else v-model.trim="form.temt_name" placeholder="请输入租户名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="租户状态" prop="temt_status">
            <el-tag>{{$fn.getDataName({dataList: listTypeInfo.statusList, value: 'value', label: 'key', data: form.temt_status})}}</el-tag>
          </el-form-item> -->
          <el-form-item label="开始时间" prop="temt_starttime" v-if="dialogInfo.status !== 'backMasp' && dialogInfo.status !== 'changeMasp_del'">
            <el-date-picker
              v-if="dialogInfo.status === 'add' || form.temt_status === 0 || dialogInfo.status === 'changeMasp_add'"
              v-model="form.temt_starttime"
              :picker-options="datePickerOptions"
              type="datetime"
              :clearable="false"
              format="yyyy-MM-dd HH"
              :value-format="'yyyy-MM-dd HH:mm:ss'"
              placeholder="开始时间">
            </el-date-picker>
            <el-tag v-else>{{$fn.switchTime(form.temt_starttime, 'YYYY-MM-DD hh')}}</el-tag>
          </el-form-item>
          <el-form-item label="结束时间" prop="temt_endtime" v-if="dialogInfo.status === 'backMasp' || dialogInfo.status === 'changeMasp_del'" :key="'temt_endtime'">
            <el-date-picker
              v-if="form.temt_status !== 5"
              style="width: 180px"
              v-model="form.temt_endtime"
              :picker-options="datePickerOptions"
              type="datetime"
              :clearable="false"
              format="yyyy-MM-dd HH"
              :value-format="'yyyy-MM-dd HH:mm:ss'"
              placeholder="结束时间">
            </el-date-picker>
            <span v-else>{{$fn.switchTime(form.temt_endtime, 'YYYY-MM-DD hh')}}</span>
          </el-form-item>
        </div>
        <!-- 铺位列表 -->
        <div class="masp">
          <!-- 添加和换铺或者租户状态为草稿时显示 -->
          <el-button
            v-if="form.temt_status === 0 || dialogInfo.status === 'addMasp' || dialogInfo.status === 'changeMasp_add'"
            class="handle-bt"
            size="small"
            type="success" 
            @click="handleClickBt('addMasp')">
            添加铺位
          </el-button>
          <div class="">
            <el-table 
              ref="table"
              :data="getMaspByType()"
              :row-class-name="tableRowClassName"
              border 
              style="width:100%"
              max-height="400"
              v-loading="listInfo.loading">
              <el-table-column prop="masp_no" label="铺号" align="center" min-width="160px">
              </el-table-column>
              <el-table-column prop="tesp_starttime" label="开始时间" align="center" min-width="160px">
                <template slot-scope="scope">
                  <!-- <el-date-picker
                    v-if="scope.row.dataflag !== 0 && scope.row.dataflag !== 2 && scope.row.dataflag !== 3"
                    style="width: 160px"
                    v-model="scope.row.tesp_starttime"
                    @change="changeTespTime(scope.row)"
                    :picker-options="datePickerOptions"
                    type="datetime"
                    :clearable="false"
                    format="yyyy-MM-dd HH"
                    :value-format="'yyyy-MM-dd HH:mm:ss'"
                    placeholder="开始时间">
                  </el-date-picker> -->
                  <span>{{$fn.switchTime(scope.row.tesp_starttime, 'YYYY-MM-DD hh')}}</span>
                </template>
              </el-table-column>
              <el-table-column 
                prop="tesp_endtime" label="结束时间" align="center" min-width="160px" 
                v-if="dialogInfo.status === 'backMasp' || dialogInfo.status === 'changeMasp_del' || dialogInfo.status === 'showMasp'"
                :key="'tesp_endtime'">
                <template slot-scope="scope">
                  <span>{{$fn.switchTime(scope.row.tesp_endtime, 'YYYY-MM-DD hh')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="masp_desc" label="描述" align="center" min-width="180px">
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作" width="100" v-if="dialogInfo.status !== 'showMasp'" :key="'handleRow'">
                <template slot-scope="scope">
                  <!-- 首先数据状态不能为删除状态，当前不为审核操作，且在 1. 添加状态 2. 草稿状态 3. 租户为草稿状态 4. 减铺 5. 新增或者未审核的数据 -->
                  <el-button
                    v-if="scope.row.dataflag !== 3 &&
                          dialogInfo.status !== 'audit' &&
                         (scope.row.dataflag === 1 || dialogInfo.status === 'add' ||
                         form.temt_status === 0 || dialogInfo.status === 'changeMasp_del' ||
                         ((scope.row.dataflag === 0 && scope.row.tesp_status === 0)))"
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
        <!-- 表计列表 -->
        <div class="metr">
          <div class="">
            <el-table
              ref="table"
              :data="form.meter_list"
              :row-class-name="tableRowClassName"
              border 
              style="width:100%"
              max-height="400"
              v-loading="listInfo.loading">
              <el-table-column prop="masp_no" label="铺号" align="center" min-width="140px">
              </el-table-column>
              <el-table-column prop="metr_no" label="电表编号" align="center" min-width="160px">
              </el-table-column>
              <el-table-column prop="tetr_starttime" label="开始时间" align="center" min-width="140px">
                <template slot-scope="scope">
                  {{$fn.switchTime(scope.row.tetr_starttime, 'YYYY-MM-DD hh')}}
                </template>
              </el-table-column>
              <el-table-column prop="tetr_startreading" label="读数" align="center" min-width="110px">
                <template slot-scope="scope">
                  <el-input 
                    v-if="dialogInfo.status !== 'audit' && dialogInfo.status !== 'showMasp' && (scope.row.tetr_status === 0 || scope.row.dataflag === 1)" 
                    v-model.number="scope.row.tetr_startreading" placeholder="请输入读数"></el-input>
                  <span v-else>{{scope.row.tetr_startreading}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tetr_endtime" label="结束时间" align="center" min-width="140px" 
                v-if="dialogInfo.status === 'backMasp' || dialogInfo.status === 'changeMasp_del' || dialogInfo.status === 'showMasp' || dialogInfo.status === 'audit'"
                :key="'tetr_endtime'">
                <template slot-scope="scope">
                  {{$fn.switchTime(scope.row.tetr_endtime, 'YYYY-MM-DD hh')}}
                </template>
              </el-table-column>
              <el-table-column prop="tetr_endreading" label="读数" align="center" min-width="100px" 
                v-if="dialogInfo.status === 'backMasp' || dialogInfo.status === 'changeMasp_del' || dialogInfo.status === 'showMasp' || dialogInfo.status === 'audit'"
                :key="'tetr_endreading'">
              </el-table-column>
              <el-table-column prop="metr_rate" label="CT" align="center" min-width="60px">
              </el-table-column>
              <el-table-column prop="metr_elicloss" label="电损" align="center" min-width="80px">
              </el-table-column>
              <!-- <el-table-column prop="spmt_splitrate" label="分摊" align="center" min-width="80px">
              </el-table-column> -->
              <!-- <el-table-column prop="spmt_status" label="状态" align="center" width="80px">
                <template slot-scope="scope">
                  <i :class="scope.row.spmt_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.spmt_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogInfo.status !== 'showMasp'">
        <!-- 审核状态下可见 -->
        <template v-if="dialogInfo.status === 'audit'">
          <el-button type="danger" :loading="dialogInfo.btLoading" @click="handleClickBt('reject', form.temt_status)">拒绝</el-button>
          <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleClickBt('pass', form.temt_status)">通过</el-button>
        </template>
        <!-- 非审核状态下可见 -->
        <template v-else>
          <el-button @click="handleCancel('show')">取消</el-button>
          <!-- 添加和草稿状态下可见 -->
          <el-button
            v-if="form.temt_status === 0"
            type="primary" 
            :loading="dialogInfo.btLoading" 
            @click="handleConfirm(dialogInfo.status, 0)">暂存
          </el-button>
          <!-- 添加和草稿状态可见 -->
          <el-button
            v-if="form.temt_status === 0 || dialogInfo.status === 'add'"
            type="primary" 
            :loading="dialogInfo.btLoading" 
            @click="handleConfirm(dialogInfo.status, 1)">提交
          </el-button>
          <!-- 换退铺状态下可见  -->
          <el-button
            v-if="dialogInfo.status === 'changeMasp_add' || dialogInfo.status === 'changeMasp_del'"
            type="primary" 
            :loading="dialogInfo.btLoading" 
            @click="handleCommitChangeMasp(dialogInfo.status)">提交
          </el-button>
          <!-- 退铺状态下可见 -->
          <el-button
            v-if="dialogInfo.status === 'backMasp'"
            type="primary" 
            :loading="dialogInfo.btLoading" 
            @click="handleBackMasp()">提交
          </el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DialogPage from './components/DialogPage'
import { mapGetters } from 'vuex'
// 引入接口
import { GetAddShopAndMeterListApi, GetIncreaseShopAndMeterListApi, GetReduceShopAndMeterListApi, GetUnRentShopAndMeterListApi,
         getRowApi, getListApi, 
         addTemtApi, updateTemtApi, updateTemtStatusApi, temtUnRentApi, deleteTemtApi,
         IncreaseShopApi, ReduceShopApi, PassRentApi, RejectRentApi
       } from '@/api/project/SMR0202A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

// 定义初始时间
export default {
  name: 'SMR0202A',
  components: {
    DialogPage
  },
  data () {
    return {
      loadingList: false,
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
          user_id: '', // 所属角色
          // user_proj_id: '', // 所属项目
          status: '' // 状态
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 状态
        statusList: [
          {value:  0, key: '草稿'},
          {value:  1, key: '申请中'},
          {value:  2, key: '已审核'},
          {value:  3, key: '换铺中'},
          {value:  4, key: '退铺中'},
          {value:  5, key: '已退铺'}
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加租户',
          update: '编辑租户',
          showMasp: '租户信息',
          addMasp: '添加铺位',
          changeMasp_add: '租户换铺-添加',
          changeMasp_del: '租户换铺-减少',
          backMasp: '退铺',
          audit: '信息审核',
        },
        show: false,
        maspShow: false,
        status: '',
        btLoading: false,
        selectedList: [],  // 选择的数据
        selectRows: [] // 选择的详细数据
      },
      // 表单参数
      form: {
        temt_id: '', // *租户ID
        temt_proj_id: '', // * 项目ID
        temt_name: '', // * 租户名称
        temt_starttime: '', // * 开始时间
        temt_endtime: '', // 退铺时间
        user_id: '', // 用户ID
        temt_status: 0, // * 状态
        shop_list: [], // 店铺列表 
        meter_list: [] // 电表列表
      },
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      // 表单验证规则
      rules: {
        temt_name: [
          {
            required: true,
            message: "请输入租户名称",
            trigger: ['blur', 'change']
          }
        ],
        temt_starttime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: ['blur', 'change']
          }
        ],
        temt_endtime: [
          {
            required: true,
            message: "请选择退铺时间",
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'projectInfo'
    ]),
    // 初始化时间为今天的上一个小时
    INITTime () {
      let hour = new Date().getHours() - 1 >= 10 ? new Date().getHours() - 1 : '0' + (new Date().getHours() - 1 > 0 ? new Date().getHours() - 1 : 0)
      return `${this.$fn.switchTime(new Date(), 'YYYY-MM-DD')} ${hour}:00:00`
    }
  },
  mounted () {
    // 初始化参数
    this.listInfo.query.proj_id = this.projectInfo.proj_id
    this.listInfo.query.user_id = this.userInfo.user_id
    
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
    },
    'form.temt_starttime' (val) {
      if (!this.dialogInfo.show || this.loadingList) return
      this.getMeterMaspList()
    },
    'form.temt_endtime' (val) {
      if (!this.dialogInfo.show || this.loadingList) return
      this.getMeterMaspList()
    },
    'form.shop_list' (val) {
      if (!this.dialogInfo.show || this.loadingList) return
      this.getMeterMaspList()
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
    /**
     * 设置row的样式
     * tesp_status 店铺的状态(数据库)   0：未审核 1：已审核  2:退铺中 3:已退铺(默认为0)
     * dataflag 数据的标识(本地)  0：数据库返回数据 1：页面新添加数据  2: 数据库数据被修改过 3: 数据库数据被删除
     */
    tableRowClassName ({row, rowIndex}) {
      if (row.tesp_status === 3 || row.tesp_status === 2) {
        return 'delete-row'
      } else if (row.tesp_status === 0) {
        return 'add-row'
      } else if (row.dataflag === 0 || row.dataflag === 2) {
        return 'update-row'
      } else if (row.dataflag === 3 ) {
        return 'delete-row'
      }
    },
    // 店铺的时间改变
    changeTespTime (row, type) {
      const form = this.form
      form.meter_list = form.meter_list.map(item => {
        // 初始化开表时间
        if (item.masp_id === row.masp_id) {
          type === 'start' ? item.tetr_starttime = row.tesp_starttime : item.tetr_endtime = row.tesp_endtime
        }
        return item
      })
    },
    // 显示对应的店铺列表 (查看状态下显示所有店铺，其他状态下显示不为退铺状态的店铺)
    getMaspByType (data = this.form) {
      let type = this.dialogInfo.status,
          temt_status = data.temt_status
      switch (type) {
        case 'showMasp':
          return data.shop_list
        case 'audit':
          // 审核租户
          if (temt_status === 1) {
            return data.shop_list
          }
          // 审核的增铺信息
          // 审核的减铺信息
          if (temt_status === 3) {
            return data.shop_list.filter(item => {
              // 不为删除状态的数据
              return item.tesp_status !== 3
            })
          }
          // 审核的退铺
          if (temt_status === 4) {
            return data.shop_list.filter(item => {
              // 正常的数据
              return item.tesp_status === 1
            })
          }
          return
        case 'changeMasp_add':
        case 'update':
          return data.shop_list.filter(item => {
            // tesp_status为3表示已被删除
            return item.tesp_status !== 3 && item.dataflag !== 3
          })
        case 'changeMasp_del':
        case 'backMasp':
          return data.shop_list.filter(item => {
            // 正常的数据
            return item.tesp_status === 1
          })
        case 'add':
          return data.shop_list
        default:
          return []
      }
      // return data.shop_list.filter(item => {
      //   /**
      //    * 店铺状态为3，或者店铺状态为0且数据状态为0的数据不显示
      //    * tesp_status为3表示已被删除
      //    * item.dataflag === 0 && item.tesp_status === 0 表示增铺为被通过，数据为编辑状态，店铺状态依旧为新增状态
      //    */
      //   return item.tesp_status !== 3 && !(item.dataflag === 0 && item.tesp_status === 0)
      // })
    },
    // 店铺列表改变，重新得到相关的电表信息
    getMeterMaspList () {
      this.loadingList = true
      this.dialogInfo.btLoading = true
      const form = this.form,
            params = {
              proj_id: this.projectInfo.proj_id,
            }
      let api
      // 根据不同的状态，请求不同的接口，设置不同的数据
      switch (this.dialogInfo.status) {
        case 'changeMasp_add':
          // 得到新加的店铺ID
          params.masp_ids = this.getMaspByType().filter(item => item.dataflag === 1 || (item.dataflag === 0 && item.tesp_status === 0)).map(item => {
            // 设置店铺的开始时间
            item.tesp_starttime = form.temt_starttime
            return item.masp_id
          }).join(',') || -1
          params.temt_id = form.temt_id
          params.starttime = form.temt_starttime
          api = GetIncreaseShopAndMeterListApi
          break
        case 'changeMasp_del':
          // 得到删除的店铺ID
          params.masp_ids = this.getMaspByType().filter(item => item.dataflag === 3).map(item => {
            // 设置店铺的结束时间
            item.tesp_endtime = form.temt_endtime
            return item.masp_id
          }).join(',') || -1
          params.temt_id = form.temt_id
          params.endtime = form.temt_endtime
          api = GetReduceShopAndMeterListApi
          break
        case 'backMasp':
          this.getMaspByType().forEach(item => {
            // 设置店铺的结束时间
            item.tesp_endtime = form.temt_endtime
          })
          params.endtime = form.temt_endtime,
          params.temt_id = form.temt_id
          api = GetUnRentShopAndMeterListApi
          break
        case 'add':
        case 'update':
          params.masp_ids = this.getMaspByType().map(item => {
            // 设置店铺的开始时间
            item.tesp_starttime = form.temt_starttime
            return item.masp_id
          }).join(',') || -1
          params.starttime = form.temt_starttime
          api = GetAddShopAndMeterListApi
          break
        default:
          this.loadingList = false
          this.dialogInfo.btLoading = false
          return
      }
      api(params)
        .then(response => {
          this.loadingList = false
          this.dialogInfo.btLoading = false
          form.meter_list = response.content.data.ds1.filter(item => {
            // 找到当前筛选过得数据
            let item1 = this.getMaspByType().find(item1 => item1.masp_id === item.masp_id)
            // 得到数据状态
            item.dataflag = item1 ? item1.dataflag : ''
            item.tetr_startreading = item.tetr_startreading || 0
            // 返回符合条件的数据
            return this.getMaspByType().find(item1 => item1.masp_id === item.masp_id)
          })
        })
        .catch(() => {
          this.loadingList = false
          this.dialogInfo.btLoading = false
        })
    },
    // 按钮的点击
    handleClickBt (type, row) {
        let dialogInfo = this.dialogInfo
      switch (type) {
      // 点击添加按钮 
      case 'add':
        this.form.temt_starttime = this.INITTime
        dialogInfo.show = true
        dialogInfo.status = 'add'
        break
      // 点击编辑按钮 
      case 'update':
      // 点击增铺按钮 
      case 'changeMasp_add':
      // 点击减铺按钮
      case 'changeMasp_del':
      // 点击退铺按钮
      case 'backMasp':
      // 点击审核按钮
      case 'audit':
        row.updateLoading = true
      // 查看
      case 'showMasp':
        // 显示当前数据（接口获取成功显示接口返回数据，获取失败显示本地数据）
        getRowApi({temt_id: row.temt_id}).then(response => {
          row.updateLoading = false
          dialogInfo.show = true
          dialogInfo.status = type

          const data = response.content.data, obj = {...JSON.parse(JSON.stringify(row))}
          if (data) {
            obj.shop_list = data.ds1.map(item => {
              // item.dataflag = item.tesp_dataflag || 0 // 设置数据的状态
              item.dataflag = 0
              item.temt_endtime = this.INITTime
              return item
            })
            // 得到符合条件的表计列表
            obj.meter_list = data.ds2.filter(item => {
              // 找到当前筛选过得数据
              let item1 = this.getMaspByType(obj).find(item1 => item1.masp_id === item.masp_id)
              // 得到数据状态
              item.dataflag = item1 ? item1.dataflag : ''
              item.tetr_startreading = item.tetr_startreading || 0
              // 返回符合条件的数据
              return this.getMaspByType(obj).find(item1 => item1.masp_id === item.masp_id)
            })
            this.form = obj
          }
          this.form.temt_endtime = this.INITTime
          // 添加铺位的时候，时间为当前时间
          if (type === 'changeMasp_add') {
            this.form.temt_starttime = this.INITTime
          }
          
        })
        .catch(() => {
          this.form = JSON.parse(JSON.stringify(row))
          this.form.temt_endtime = this.INITTime
          this.form.temt_starttime = this.INITTime
          row.updateLoading = false
        })
        break
      case 'delete':
        this.handleDelete(row)
        break
      // 审批时通过
      case 'pass':
        // // 如果状态为1或者3，通过为2, 状态为4，通过为5
        // if (row === 1 || row === 3) {
        //   this.handleConfirm('update', 2)
        // } else if (row === 4) {
        //   this.handleConfirm('update', 5)
        // }
        // break
      // 审批时拒绝
      case 'reject':
        this.handleAudit(type)
        // // 如果状态为1或者3，通过为2, 状态为4，通过为5
        // if (row === 1) {
        //   this.handleConfirm('update', 0)
        // } else if (row === 4 || row === 3) {
        //   this.handleConfirm('update', 2)
        // }
        break
      // 添加铺位按钮点击
      case 'addMasp':
        dialogInfo.maspShow = true
        break
      // 添加铺位弹窗确认的点击
      case 'saveSelect':
        // 设置确定选择的数据
        let arr = [
          ...this.form.shop_list.filter(item => item.dataflag === 0 || (item.dataflag && item.dataflag !==1)),
          ...dialogInfo.selectRows.filter(item => {
            item.tesp_status = 0 // 初始化状态
            item.tesp_starttime = this.INITTime // 初始化开始时间
            item.tesp_endtime = this.INITTime // 初始化开始时间
            item.dataflag = 1 // 设置数据的状态
            return dialogInfo.selectedList.indexOf(item.masp_id) !== -1
          })
        ]
        // 改变数据引用的地址
        this.form.shop_list = JSON.parse(JSON.stringify(arr))
        dialogInfo.maspShow = false
        break
      // 添加铺位弹窗取消的点击
      case 'cancelSave':
        // 取消选择，则选择的数据为上一次选择的数据
        dialogInfo.selectedList = this.form.shop_list.map(item => {
          return item.masp_id
        })
        dialogInfo.maspShow = false
        break
      // 对选择的铺位进行删除时的处理
      case 'deleteSelect':
        // 如果是已经在数据库的数据，将数据标记为3（删除状态）,不是的话则删除
        if (row.dataflag === 2 || row.dataflag === 0) {
          row.dataflag = 3 // 设置数据的状态
          this.getMeterMaspList()
        } else {
          this.form.shop_list.splice(this.form.shop_list.indexOf(row), 1)
        }
        dialogInfo.selectedList.splice(dialogInfo.selectedList.indexOf(row), 1)
        break
      }
    },
    // 审批事件的处理
    handleAudit (type) {
      let api = type === 'pass' ? PassRentApi : RejectRentApi,
          form = this.form,
          params = {
            temt_id: form.temt_id,
            temt_status: form.temt_status,
            user_id: this.projectInfo.proj_id,
            shop_list: [],
            meter_list: []
          }
          form.shop_list.forEach(item => {
            let obj = {
              tesp_masp_id: item.masp_id,
              tesp_status: item.tesp_status,
              // dataflag: item.dataflag
            }
            params.shop_list.push(obj)
          })
          form.meter_list.forEach(item => {
            let obj = {
              tetr_masp_id: item.masp_id,
              tetr_metr_id: item.metr_id,
              tetr_status: item.tetr_status
            }
            params.meter_list.push(obj)
          })
      api(params)
        .then(response => {
          if (response.success) {
            this.getList()
            this.dialogInfo.show = false
          }
          this.$message({
            showClose: true,
            message: response.message,
            type: response.success ? 'success' : 'error',
            duration: 3500
          })
        })
        .catch(error => {
        })
    },
    /**
     * 过滤条件
     * 添加或者增铺的时候，开始读数不能为空
     * 退铺或者减铺的时候，结束读数不能为空
     * 结束时间不能小于开始时间
     * 电表必须选择
     * 铺位必须选择
     */
    filterConditions (obj) {
      return true
      let result = true, message
      switch (this.dialogInfo.status) {
        case 'add':
        case 'changeMasp_add':
          message = '电表开始读数不能为空, 请重新选择时间'
          result = this.form.meter_list.every(item => {
            return item.tetr_startreading || item.tetr_startreading === 0
          })
          break
        case 'backMasp':
        case 'changeMasp_del':
          // 先做时间对比
          message = '结束时间必须大于开始时间'
          result = +new Date(this.$fn.switchTime(this.form.temt_endtime, 'YYYY-MM-DD hh:mm:ss')) > +new Date(this.$fn.switchTime(this.form.temt_starttime, 'YYYY-MM-DD hh:mm:ss'))
          // 在做读数对比
          if (result) {
            result = this.form.meter_list.every(item => {
              if (this.dialogInfo.status === 'changeMasp_del') {
                // 被删除的数据需要结束读数
                return item.dataflag === 3 ? item.tetr_endreading : true
              }
              if (this.dialogInfo.status === 'backMasp') {
                // 退铺时所有需要读数
                return item.tetr_endreading
              }
            })
            if (!result) {
              message = '电表结束读数不能为空, 请重新选择时间'
            }
          }
          break
      }
      if (obj && obj.meter_list.length === 0) {
        result = false
        message = '请选择电表'
      }
      if ((obj && obj.shop_list.length === 0) || obj.shop_list.every(item => item.dataflag === 3)) {
        result = false
        message = '租户至少有一个有效铺位'
      }
      if (!result) {
        this.$message({
          showClose: true,
          message,
          type: 'error',
          duration: 3500
        })
      }
      return result
    },
    // 换铺事件的处理(提交)
    handleCommitChangeMasp (type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let api,
              form = this.form,
              dialogInfo = this.dialogInfo,
              arr = [],
              arr1 = [],
              obj = {
                temt_id: form.temt_id,
                // temt_starttime: form.temt_starttime,
                user_id: this.userInfo.user_id,
                temt_status: form.temt_status,
                shop_list: arr,
                meter_list: arr1
              }
          // 对参数处理
          form.shop_list.forEach(item => {
            arr.push({
              tesp_masp_id: item.masp_id,
              dataflag: item.dataflag || 0
            })
          })
          if (type === 'changeMasp_add') {
            api = IncreaseShopApi
            obj.temt_starttime = form.temt_starttime
            form.meter_list.forEach(item => {
              arr1.push({
                tetr_masp_id: item.masp_id,
                tetr_metr_id: item.metr_id,
                tetr_startreading: item.tetr_startreading
              })
            })
          } else {
            api = ReduceShopApi
            obj.temt_endtime = form.temt_endtime
            form.meter_list.forEach(item => {
              arr1.push({
                tetr_masp_id: item.masp_id,
                tetr_metr_id: item.metr_id,
                tetr_endreading: item.tetr_endreading || 0
              })
            })
          }

          // 过滤器
          if (!this.filterConditions(obj)) {
            return
          }
          // return
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
    // 确认的事件处理
    handleConfirm (type, status) {
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          let api,
            form = this.form,
            dialogInfo = this.dialogInfo,
            arr = [],
            arr1 = [],
            obj = {
              temt_id: form.temt_id,
              temt_proj_id: form.masp_proj_id || this.projectInfo.proj_id,
              temt_name: form.temt_name,
              temt_starttime: form.temt_starttime,
              temt_status: status || status === 0 ? status : form.temt_status,
              user_id: this.userInfo.user_id,
              shop_list: arr,
              meter_list: arr1
            }
            form.shop_list.forEach(item => {
              arr.push({
                tesp_masp_id: item.masp_id,
                tesp_starttime: item.tesp_starttime,
                tesp_status: item.tesp_status,
                dataflag: item.dataflag || 0
              })
            })
            form.meter_list.forEach(item => {
              arr1.push({
                tetr_masp_id: item.masp_id,
                tetr_metr_id: item.metr_id,
                tetr_starttime: item.tetr_starttime,
                tetr_startreading: item.tetr_startreading,
                tetr_status: item.tetr_status
              })
            })
          if (type === 'add') {
            api = addTemtApi
          } else if (type === 'update') {
            api = updateTemtApi
          } else {
            return
          }
          // 过滤器
          if (!this.filterConditions(obj)) {
            return
          }
          // return
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
    // 退铺
    handleBackMasp () {
      let form = this.form,
          params = {
            temt_id: form.temt_id,
            temt_endtime: form.temt_endtime,
            user_id: this.projectInfo.proj_id,
            temt_status: form.temt_status,
            shop_list: [],
            meter_list: []
          }
          form.shop_list.forEach(item => {
            let obj = {
              tesp_masp_id: item.masp_id,
              dataflag: item.dataflag
              // tesp_status: item.tesp_status,
            }
            params.shop_list.push(obj)
          })
          form.meter_list.forEach(item => {
            let obj = {
              tetr_masp_id: item.masp_id,
              tetr_metr_id: item.metr_id,
              tetr_endreading: item.tetr_endreading,
              // tetr_status: item.tetr_status
            }
            params.meter_list.push(obj)
          })
      // 过滤器
      if (!this.filterConditions(params)) {
        return
      }
      temtUnRentApi(params)
        .then(response => {
          if (response.success) {
            this.getList()
            this.dialogInfo.show = false
          }
          this.$message({
            showClose: true,
            message: response.message,
            type: response.success ? 'success' : 'error',
            duration: 3500
          })
        })
        .catch(error => {
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
          deleteTemtApi({temt_id: row.temt_id}).then(response => {
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
    // 导出
    exportExcel () {
      let query = this.listInfo.query,
          url = `${this.$fn.getHost()}/api/SMR0202A/ExportExcel?proj_id=${query.proj_id}`,
          params = {
            keyword: query.keyword
          }
      for (let key in params) {
        if (params[key]) {
          url += '&' + key + '=' + params[key]
        }
      }
      this.$fn.openWindow(url)
    },
    // 表单初始化
    resetForm () {
      this.form = {
        temt_id: '', // *租户ID
        temt_proj_id: '', // * 项目ID
        temt_name: '', // * 租户名称
        temt_starttime: this.INITTime, // * 开始时间
        temt_endtime: '', // 退铺时间
        user_id: '', // 用户ID
        temt_status: 0, // * 状态
        shop_list: [], // 店铺列表 
        meter_list: [] // 电表列表
      }
    }
  }
}
</script>

<style lang="scss">
.SMR0202A{
  .el-input-number{
    width: 140px;
  }
  .el-table{
    .add-row {
      background: #67c23a!important;
    }
    .update-row {
      background: oldlace!important;
    }
    .delete-row{
      background: #f56c6c!important;
    }
    .hover-row>td{
      background: rgba(100, 100, 100, .2)!important;
    }
  }
  .tenant{
    padding-top: 20px;
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
  .tenant, .masp, .metr{
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px;
    margin-bottom: 20px;
  }
}
</style>
