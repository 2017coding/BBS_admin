<template>
  <div class="">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入报警策略名称" clearable></el-input>
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
    <el-table ref="table" :max-height="listInfo.tableHeight || undefined" :data="listInfo.data" border style="width:100%;" v-loading="listInfo.loading">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alsg_name" label="报警策略名称" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="alsg_alarmlevel" label="报警级别" align="center" width="160px">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo.alarmLevelList, value: 'value', label: 'key', data: scope.row.alsg_alarmlevel})}}
        </template>
      </el-table-column>
      <el-table-column prop="alsg_status" label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <i :class="scope.row.alsg_status === 1 ? 'el-icon-check' : 'el-icon-close'" :style="{color: scope.row.alsg_status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="alsg_pointtype" label="测点组类型" align="center" min-width="160px">
      </el-table-column> -->
      <el-table-column fixed="right" align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button 
            size="small" 
            :type="scope.row.alsg_status === 1 ? 'danger' : 'success'"
            icon="el-icon-sort" 
            v-waves 
            @click="handleClickBt('status', scope.row)"
            :loading="scope.row.statusLoading">
            {{scope.row.alsg_status === 1 ? '停用' : '启用'}}
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
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" v-if="dialogInfo.status !== 'role' && dialogInfo.status !== 'showRole'">
        <!-- 动态参数 -->
        <el-form-item 
          v-for="(item, index) in fieldList" 
          :key="index" 
          :prop="item.value" 
          :label="item.key" 
          v-if="isShow(item)">
          <!-- 普通输入框 -->
          <el-input
            v-if="item.type === 'input'"
            :type="item.type"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            v-model="form[item.value]">
          </el-input>
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.value]"
            :disabled="item.disabled"
            :clearable="!item.required"
            :filterable="!item.required"
            :placeholder="getPlaceholder(item)">
            <el-option v-for="(item ,index) in  listTypeInfo[item.list]" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
          <!-- 按钮 -->
          <template v-if="item.type === 'button'">
            <el-button type="success" @click="handleClickBt('setData', 'addPoit')" icon="el-icon-plus" circle></el-button>
            <el-button type="danger" @click="handleClickBt('useWhichData', 'delPoit')" icon="el-icon-minus" circle v-if="dialogInfo.status !== 'add'"></el-button>
          </template>
        </el-form-item>
        <!-- 能耗类型需要参数 -->
        <template v-if="alsgAlarmtype === 5">
          <el-form-item label="年定额" prop="alse_yearval">
            <el-input placeholder="请输入年定额" v-model="form.alse_yearval"> </el-input>
          </el-form-item>
          <el-form-item label="月定额" prop="alse_monthval" class="el-form-block">
            <el-input placeholder="请输入月定额" v-model="form.alse_monthval"></el-input>
            <el-button @click="handleClickBt('setMonth')">
              {{monthShow ? '收起详细设置' : '展开详细设置'}}
              <i :class="'el-icon--right ' + (monthShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down')"></i>
            </el-button>
          </el-form-item>
          <!-- 详细的月设置 -->
          <el-collapse-transition>
            <div class="month-box" v-if="monthShow">
              <div class="month-item" v-for="(item, index) in 12">
                <span class="name">{{item}}月:</span>
                <el-input 
                  size="mini" 
                  :placeholder="item + '月定额'"
                  v-model="form['alse_monval' + item]"
                  style="width: 100px">
                </el-input>
              </div>
            </div>
          </el-collapse-transition>
        </template>
        <!-- 公共参数 -->
        <el-form-item label="报警组" prop="alsg_algp_id">
          <el-select v-model="form.alsg_algp_id" placeholder="请选择报警组" clearable>
            <el-option v-for="(item ,index) in  listTypeInfo.algpList" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="alsg_status">
          <el-select v-model="form.alsg_status" placeholder="请选择状态">
            <el-option v-for="(item ,index) in  listTypeInfo.status1List" :key="index" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警通道" prop="alsg_alertwayArr" class="el-form-block">
          <el-checkbox-group v-model="form.alsg_alertwayArr">
            <el-checkbox v-for="(item, index) in listTypeInfo.alertWayList" :key="index" :label="item.value">{{item.key}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogInfo.status !== 'showRole'">
        <el-button @click="handleCancel('form')">取 消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择数据 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.pageStatus] + alsgAlarmtypeName + '组'" 
      :visible.sync="dialogInfo.showPoit" :close-on-click-modal="false">
      <DialogPage 
        :selectedList.sync="dialogInfo[dialogInfo.pageStatus === 'addPoit' ? 'selectedList' : 'unselectedList']"
        :poitType="form.alsg_pointtype"
        :dataType="getDataType(alsgAlarmtype)"
        :alsgAlarmtype="getAlsgAlarmtype()"
        :pageStatus="dialogInfo.pageStatus"
        :alsgId="form.alsg_id || 0"
        v-if="dialogInfo.showPoit">
      </DialogPage>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClickBt('cancelSave')">取 消</el-button>
        <el-button type="primary" @click="handleClickBt('saveSelect')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入接口
import { getAlarmGroupApi, getStrategyRowApi, getStrategyListApi, addStrategyApi,
         updateStrategyApi, deleteStrategyApi } from '@/api/project/S0604A'
import Tree from '@/components/tree/index'
import DialogPage from './dialogPage'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  props: {
    alsgAlarmtype: {
      typs: Number
    },
    alsgAlarmtypeName: {
      type: String
    }
  },
  components: {
    Tree,
    DialogPage
  },
  data () {
    return {
      monthShow: false,
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
          alsg_alarmtype: '', // 报警类型
          status: '', // 状态
          keyword: '' // 关键字
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 测点类型列表
        poinTypeList: [
          {value:  'AI', key: 'AI'},
          {value:  'DI', key: 'DI'},
          // {value:  'AO', key: 'AO'},
          // {value:  'DO', key: 'DO'},
          {value:  'CalAI', key: 'CalAI'},
          {value:  'CalDI', key: 'CalDI'}
        ],
        // 测点列表
        poinList: [],
        // 报警组列表
        algpList: [],
        // 报警级别列表
        alarmLevelList: [
          {value:  1, key: '预警'},
          {value:  2, key: '故障'}
        ],
        // 能耗类型列表
        entpList: [],
        // 状态
        statusList: [
          {value:  0, key: '否'},
          {value:  1, key: '是'}
        ],
        status1List: [
          {value:  0, key: '停用'},
          {value:  1, key: '启用'}
        ],
        // 报警通道列表
        alertWayList: [
          {value:  '1', key: '短信'},
          {value:  '2', key: '邮件'},
          {value:  '3', key: '推送'}
        ]
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          role: '设置权限',
          showRole: '查看权限',
          add: '添加',
          update: '编辑',
          addPoit: '添加',
          delPoit: '删除'
        },
        show: false,
        status: '',
        btLoading: false,
        // 组件弹窗参数
        showPoit: false,
        pageStatus: '',
        selectedList: [], // 选择的数据
        unselectedList: [], // 取消选择的数据
        selectedAIList: [], // 选择的AI类数据
        selectedDIList: [], // 选择的DI类数据
        confirmSelects: [], // 确认选择的数据
        confirmUnSelects: [] // 确认取消选择的数据
      },
      // 表单参数
      form: {
        alsg_id: '', // 报警策略ID *
        alsg_proj_id: '', // 项目ID *
        alsg_name: '', // 报警策略名称 *
        alsg_alarmtype: '', // 报警类型 *
        alsg_alarmlevel: 1, // 报警等级 *
        /***** 测点相关字段 *****/
        alsg_pointtype: '', // 测点组类型 *
        alsg_points: '', // 测点组 *
        alsg_upper: '', // 上限阀值
        alsg_upper2: '', // 上上限阀值
        alsg_lower: '', // 下限阀值
        alsg_lower2: '', // 下下限阀值
        alsg_dtoc: '', // 开启
        alsg_ctod: '', // 关闭
        /***** 其他类型 ****/
        alsg_entp_id: '', // 能耗类型
        alsg_meters: '', // 设备组
        alsg_gatherers: '', // 采集器组
        alsg_drivers: '', // 驱动组
        /***** 能耗类型相关数据 ****/
        alse_yearval: '', // 年定额
        alse_monthval: '', // 月定额
        alse_monval1: '', // 1月定额
        alse_monval2: '', // 2月定额
        alse_monval3: '', // 3月定额
        alse_monval4: '', // 4月定额
        alse_monval5: '', // 5月定额
        alse_monval6: '', // 6月定额
        alse_monval7: '', // 7月定额
        alse_monval8: '', // 8月定额
        alse_monval9: '', // 9月定额
        alse_monval10: '', // 10月定额
        alse_monval11: '', // 11月定额
        alse_monval12: '', // 12月定额
        /***** 公共字段 ****/
        alsg_algp_id: '', // 报警组
        alsg_alertway: '', // 报警通道
        alsg_alertwayArr: [],
        alsg_status: 1, // 状态 *
      },
      // 表单验证规则
      rules: {
        alsg_name: [
          {
            required: true,
            message: "请输入报警策略名称",
            trigger: ['blur', 'change']
          },
          {
            max: 24,
            message: "长度最多为24个字符",
            trigger: ['blur', 'change']
          }
        ],
        alsg_alarmlevel: [
          {
            required: true,
            message: "请选择报警级别",
            trigger: ['blur', 'change']
          },
        ],
        alsg_status: [
          {
            required: true,
            message: "请选择报警策略状态",
            trigger: ['blur', 'change']
          }
        ]
      },
      fieldList: [
        {value: 'alsg_name', key: '策略名称', type: 'input'},
        {value: 'alsg_alarmlevel', key: '报警等级', type: 'select', list: 'alarmLevelList', required: true},
        /***** 测点相关字段 *****/
        {value: 'alsg_pointtype', key: '测点组类型', type: 'select', list: 'poinTypeList', alarmtype: -1},
        {value: 'alsg_points', key: '测点组', type: 'button', alarmtype: -1},
        {value: 'alsg_upper', key: '上限阀值', type: 'input', alarmtype: -1, pointtype: 1},
        {value: 'alsg_lower', key: '下限阀值', type: 'input', alarmtype: -1, pointtype: 1},
        {value: 'alsg_upper2', key: '上上限阀值', type: 'input', alarmtype: -1, pointtype: 1},
        {value: 'alsg_lower2', key: '下下限阀值', type: 'input', alarmtype: -1, pointtype: 1},
        {value: 'alsg_dtoc', key: '开启(从分到合)', type: 'select', list: 'statusList', alarmtype: -1, pointtype: 2},
        {value: 'alsg_ctod', key: '关闭(从合到分)', type: 'select', list: 'statusList', alarmtype: -1, pointtype: 2},
        /***** 其他类型 *****/
        {value: 'alsg_entp_id', key: '能耗类型', type: 'select', list: 'entpList', alarmtype: 2},
        {value: 'alsg_entp_id', key: '能耗类型', type: 'select', list: 'entpList', alarmtype: 5},
        {value: 'alsg_meters', key: '设备组', type: 'button', alarmtype: 2},
        {value: 'alsg_meters', key: '设备组', type: 'button', alarmtype: 5},
        {value: 'alsg_gatherers', key: '采集器组', type: 'button', alarmtype: 3},
        {value: 'alsg_drivers', key: '驱动组', type: 'button', alarmtype: 4},
        /***** 公共参数 *****/
        // {value: 'alsg_algp_id', key: '报警组', type: 'select', list: 'algpList'},
      ]
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
    this.listInfo.query.alsg_alarmtype = this.alsgAlarmtype

    this.initData()
    this.initlistTypeInfo()
    this.getList()

    // 得到表格的高度
    this.listInfo.tableHeight = this.$fn.getTableHeight() - 80

    // 监听页面大小改变
    window.addEventListener('resize', () => {
      // 得到表格的高度
      this.listInfo.tableHeight = this.$fn.getTableHeight() - 80
    })
  },
  watch: {
    'dialogInfo.show' () {
      const dialogInfo = this.dialogInfo
      // 弹窗隐藏时，将弹窗数据初始化
      if (!dialogInfo.show) {
        // 表单验证初始哈
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        // 表单内容初始化
        this.resetForm()
        // 按钮loading消失
        dialogInfo.btLoading = false

        // 清除选择的数据
        dialogInfo.selectedList = [] // 选择的数据
        dialogInfo.unselectedList = [] // 取消选择的数据
        dialogInfo.selectedAIList = [] // 选择的AI类数据
        dialogInfo.selectedDIList = [] // 选择的DI类数据
        dialogInfo.confirmSelects = [] // 确认选择的数据
        dialogInfo.confirmUnSelects = [] // 确认取消选择的数据

        // 设置月隐藏
        this.monthShow = false
      } else {
        // 添加的时候设置默认值
        if (dialogInfo.status === 'add') {
          let form = this.form
          // 添加设备和能耗设置默认值
          if (this.alsgAlarmtype === 2 || this.alsgAlarmtype === 5) {
            form.alsg_entp_id = this.listTypeInfo.entpList[0] ? this.listTypeInfo.entpList[0].value : ''
          }
          // 添加测点类型设置默认值
          if (this.alsgAlarmtype === -1) {
            form.alsg_pointtype = 'AI'
            form.alsg_dtoc = 0
            form.alsg_ctod = 0
          }
          form.alsg_status = 1
        }
      }
    },
    'dialogInfo.selectedList' (val) {
      // 如果为测点类型，设置对应类型的测点数据
      if (this.alsgAlarmtype === -1) {
        this.dialogInfo['selected' + this.getPoitType() + 'List'] = val
      }
    },
    'form.alsg_pointtype' () {
      // 如果为测点类型，设置对应类型的测点数据
      if (this.alsgAlarmtype === -1) {
        this.dialogInfo.selectedList = this.dialogInfo['selected' + this.getPoitType() + 'List']
      }
    },
    // 能耗报警时, 当设置月的时候，将显示为0的数据设置为空
    monthShow (val) {
      if (val) {
        for (let i = 0; i < 12; i++) {
          if (this.form['alse_monval' + (i + 1)] === 0) {
            this.form['alse_monval' + (i + 1)] = ''
          }
        }
      }
    }
  },
  methods: {
    initData () {
    },
    // 初始化查询相关数据
    initlistTypeInfo () {
      // 得到所有的报警组列表
      getAlarmGroupApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.algpList = response.content.data
        this.listTypeInfo.algpList.forEach(item => {
          item.value = item.algp_id
          item.key = item.algp_name
        })
      })
      .catch(() => {
        console.log('获取报警组列表失败')
      })
      // 在需要能耗类型的报警类型下得到所有的能耗类型列表
      if (this.alsgAlarmtype === 2 || this.alsgAlarmtype === 5) {
        this.$api.getEntpApi({proj_id: this.projectInfo.proj_id}).then(response => {
          this.listTypeInfo.entpList = response.content.data
          this.listTypeInfo.entpList.forEach(item => {
            item.value = item.entp_id
            item.key = item.entp_name
          })
        })
        .catch(() => {
          console.log('获取能耗类型失败')
        })
      }
    },
    // 判断元素是否显示
    isShow (row) {
      let result1 = true, result2 = true
      // 报警类型的判断
      result1 = !row.alarmtype || row.alarmtype === this.alsgAlarmtype
      // 测点类型的判断
      if (row.pointtype) {
        result2 = false
        if (row.pointtype === 1) {
          result2 = this.form.alsg_pointtype === 'AI' || this.form.alsg_pointtype === 'CalAI'
        } else if (row.pointtype === 2) {
          result2 = this.form.alsg_pointtype === 'DI' || this.form.alsg_pointtype === 'CalDI'
        }
      }
      return result1 && result2
    },
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.key
      } else if (row.type === 'select' || row.type === 'date') {
        placeholder = '请选择' + row.key
      } else {
        placeholder = row.key
      }
      return placeholder
    },
    // 得到传入组件的数据类型
    getDataType (alarmtype) {
      if (alarmtype === -1) {
        return 4
      } else if (alarmtype === 2 || alarmtype === 5) {
        return 1
      } else if (alarmtype === 3) {
        return 2  
      } else if (alarmtype === 4) {
        return 3
      }
    },
    // 得到传入组件的报警类型
    getAlsgAlarmtype () {
      let param = this.form, alsgAlarmtype
      if (this.alsgAlarmtype === -1) {
        if (param.alsg_pointtype === 'AI' || param.alsg_pointtype === 'CalAI') {
          alsgAlarmtype = 0
        } else if (param.alsg_pointtype === 'DI' || param.alsg_pointtype === 'CalDI') {
          alsgAlarmtype = 1
        }
      } else {
        alsgAlarmtype = this.alsgAlarmtype
      }
      return alsgAlarmtype
    },
    // 得到数据
    getList () {
      this.listInfo.loading = true
      getStrategyListApi(this.listInfo.query)
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
      const dialogInfo = this.dialogInfo
      switch (type) {
      case 'add':
        dialogInfo.show = true
        dialogInfo.status = 'add'
        break
      case 'update':
        this.handleShowRow(row)
        break
      case 'delete':
        this.handleDelete(row)
        break
      case 'status':
        this.handleSwitchStatus(row)
        break
      case 'setData':
        let next = true, message = ''
        if (this.alsgAlarmtype === -1 && !this.form.alsg_pointtype) {
          message = '请先选择测点类型'
          next = false
        } else if ((this.alsgAlarmtype === 2 || this.alsgAlarmtype === 5) && !this.form.alsg_entp_id) {
          message = '请先选择能耗类型'
          next = false
        }
        if (!next) {
          this.$message({
            showClose: true,
            message: message,
            type: 'warning',
            duration: 3500
          })
          return
        }
      case 'useWhichData':
        dialogInfo.showPoit = true
        dialogInfo.pageStatus = row
        break
      case 'saveSelect':
        let data = this.form,
            selected = dialogInfo.selectedList,
            unselected = dialogInfo.unselectedList,
            val = []

        selected.forEach(id => {
          if (unselected.indexOf(id) === -1) {
            val.push(id)
          }
        })

        // 选择不能超过五十个
        // if (val.length > 50) {
        //   this.$message({
        //     showClose: true,
        //     message: '驱动组添加的数量不能大于五十条！！！',
        //     type: 'warning',
        //     duration: 3000
        //   })
        //   return
        // }
        switch (this.alsgAlarmtype) {
          case -1:
            data.alsg_points = val.join(',')
            break
          case 2:
          case 5:
            data.alsg_meters = val.join(',')
            break
          case 3:
            data.alsg_gatherers = val.join(',')
            break
          case 4:
            data.alsg_drivers = val.join(',')
            break
        }
        // 设置确定选择的数据
        dialogInfo.confirmUnSelects = JSON.parse(JSON.stringify(dialogInfo.unselectedList))
        dialogInfo.confirmSelects = JSON.parse(JSON.stringify(dialogInfo.selectedList))
        dialogInfo.showPoit = false
        break
      case 'cancelSave':
        // 取消选择，则选择的数据为上一次选择的数据
        dialogInfo.unselectedList = JSON.parse(JSON.stringify(dialogInfo.confirmUnSelects))
        dialogInfo.selectedList = JSON.parse(JSON.stringify(dialogInfo.confirmSelects))
        dialogInfo.showPoit = false
        break
      case 'setMonth':
        this.monthShow = !this.monthShow
        break
      }
    },
    // 当为测点类型的时候，判断选择的数据
    getPoitType (alsgPointtype = this.form.alsg_pointtype) {
      let type
      if (alsgPointtype === 'AI' || alsgPointtype === 'CalAI') {
        type = 'AI'
      } else if (alsgPointtype === 'DI' || alsgPointtype === 'CalDI') {
        type = 'DI'
      }
      return type
    },
    // 显示当前数据（接口获取成功显示接口返回数据，获取失败显示本地数据）
    handleShowRow (row) {
      row.updateLoading = true
      getStrategyRowApi({alsg_id: row.alsg_id}).then(response => {
        row.updateLoading = false
        this.dialogInfo.show = true
        this.dialogInfo.status = 'update'
        if (response.content.data && Array.isArray(response.content.data)) {
          let update = response.content.data[0], arr = [], key
          // 得到报警通道
          update.alsg_alertwayArr = update.alsg_alertway.split(',')
          // 得到选中的数据
          switch (this.alsgAlarmtype) {
            case -1:
              key = 'alsg_points'
              break
            case 2:
            case 5:
              key = 'alsg_meters'
              break
            case 3:
              key = 'alsg_gatherers'
              break
            case 4:
              key = 'alsg_drivers'
              break
          }
          update[key].split(',').forEach(item => {
            item = +item
            if (item) {
              arr.push(item)
            }
          })
          // 设置已经选择的数据
          this.dialogInfo.selectedList = arr
          this.dialogInfo.confirmSelects = arr
          // 如果为测点类型，设置对应类型的测点数据
          if (this.alsgAlarmtype === -1) {
            this.dialogInfo['selected' + this.getPoitType(update.alsg_pointtype) + 'List'] = arr
          }

          this.form = update
          // 将当前行数据换成服务端数据
          for(let key in row) {
            if (response.content.data[0][key]) {
              row[key] = response.content.data[0][key]
            }
          }
        } else {
          let update = JSON.parse(JSON.stringify(row))
          update.alsg_alertwayArr = update.alsg_alertway.split(',')
          this.form = update
        }
      })
      .catch(() => {
        let update = JSON.parse(JSON.stringify(row))
        update.alsg_alertwayArr = update.alsg_alertway.split(',')
        this.form = update
        row.updateLoading = false
      })
    },
    // 切换状态
    handleSwitchStatus (row) {
      let data = JSON.parse(JSON.stringify(row))
      data.alsg_status = data.alsg_status === 0 ? 1 : 0
      row.statusLoading = true
      updateStrategyApi(data).then(response => {
        row.statusLoading = false
        if (response.success) {
          // 切换成功之后更换当前行的状态
          row.alsg_status = data.alsg_status
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
          let api
          // 初始化参数
          let param = this.form
          param.alsg_proj_id = this.projectInfo.proj_id
          param.alsg_alertway = param.alsg_alertwayArr.join(',')
          // 设置参数的报警类型
          if (this.alsgAlarmtype === -1) {
            if (param.alsg_pointtype === 'AI' || param.alsg_pointtype === 'CalAI') {
              param.alsg_alarmtype = 0
            } else if (param.alsg_pointtype === 'DI' || param.alsg_pointtype === 'CalDI') {
              param.alsg_alarmtype = 1
            }
          } else {
            param.alsg_alarmtype = this.alsgAlarmtype
          }
          // 为AI或者CalAI时清除DI或者CalDI,反过来同理
          if (param.alsg_pointtype === 'AI' || param.alsg_pointtype === 'CalAI') {
            param.alsg_dtoc = ''
            param.alsg_ctod = ''
          } else if (param.alsg_pointtype === 'DI' || param.alsg_pointtype === 'CalDI') {
            param.alsg_upper = ''
            param.alsg_lower = ''
            param.alsg_upper2 = ''
            param.alsg_lower2 = ''
          }
          if (type === 'add') {
            api = addStrategyApi
          } else if (type === 'update') {
            api = updateStrategyApi
          } else {
            return
          }
          this.dialogInfo.btLoading = true
          api(param)
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
          deleteStrategyApi(row).then(response => {
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
        alsg_id: '', // 报警策略ID *
        alsg_proj_id: '', // 项目ID *
        alsg_name: '', // 报警策略名称 *
        alsg_alarmtype: '', // 报警类型 *
        alsg_alarmlevel: 1, // 报警等级 *
        /***** 测点相关字段 *****/
        alsg_pointtype: '', // 测点组类型 *
        alsg_points: '', // 测点组 *
        alsg_upper: '', // 上限阀值
        alsg_upper2: '', // 上上限阀值
        alsg_lower: '', // 下限阀值
        alsg_lower2: '', // 下下限阀值
        alsg_dtoc: '', // 开启
        alsg_ctod: '', // 关闭
        /***** 其他类型 ****/
        alsg_entp_id: '', // 能耗类型
        alsg_meters: '', // 设备组
        alsg_gatherers: '', // 采集器组
        alsg_drivers: '', // 驱动组
        /***** 能耗类型相关数据 ****/
        alse_yearval: '', // 年定额
        alse_monthval: '', // 月定额
        alse_monval1: '', // 1月定额
        alse_monval2: '', // 2月定额
        alse_monval3: '', // 3月定额
        alse_monval4: '', // 4月定额
        alse_monval5: '', // 5月定额
        alse_monval6: '', // 6月定额
        alse_monval7: '', // 7月定额
        alse_monval8: '', // 8月定额
        alse_monval9: '', // 9月定额
        alse_monval10: '', // 10月定额
        alse_monval11: '', // 11月定额
        alse_monval12: '', // 12月定额
        /***** 公共字段 ****/
        alsg_algp_id: '', // 报警组
        alsg_alertway: '', // 报警通道
        alsg_alertwayArr: [],
        alsg_status: 1, // 状态 *
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .month-box{
    display: flex;
    flex-wrap: wrap;
    margin: 0 50px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid rgb(222, 222, 222);
    border-radius: 10px;
    .month-item{
      display: flex; 
      align-items: center;
      width: 25%;
      margin: 5px 0;
      .name{
        padding-right: 5px;
        width: 48px;
        text-align: right;
      }
    }
  }
</style>
