<template>
  <div>
    <!-- 查询模块 -->
    <div class="filter-container flex">
      <div class="filter-item filter-item_left">
        <label class="filter-label">显示类型:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.DateTypeName" @change="typeChang" style="width: 70px" clearable placeholder="请选择显示类型">
          <el-option
            v-for="item in date_type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="filter-item filter-item_left">
        <label class="filter-label">时间:</label>
        <el-date-picker
          class="filter-item filter-date"
          v-model="listInfo.query.starttime"
          :type="listInfo.query.DateTypeName"
          :value-format="valueFormat[listInfo.query.DateTypeName]"
          :picker-options="pickerOptions"
          :clearable="false"
          placeholder="选择时间"
        >
        </el-date-picker>
      </div>

      <div class="filter-item filter-item_left">
        <label class="filter-label">维度:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.dagd_id"
                   placeholder="请选择维度" filterable>
          <el-option v-for="item in  listTypeInfo.dagd_id_list" :key="item.dagd_id" :label="item.dagd_name"
                     :value="item.dagd_id"></el-option>
        </el-select>

      </div>

      <div class="filter-item filter-item_left">
        <label class="filter-label">排序方式:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.sorttype"
                   placeholder="请选择排名次序" filterable>
          <el-option v-for="item in  listTypeInfo.user_proj_list" :key="item.value" :label="item.key"
                     :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <label class="filter-label">数量:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.topnumber"
                  placeholder="请输入数量"></el-input>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves ref="search"
                   @click="getList()">查询
        </el-button>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves @click="Extprot"
        >导出
        </el-button>
      </div>
    </div>
    <!--图表-->
    <div class="flex" v-loading="loading">
      <bar :echartoptions="echartsbaroptions" v-if="tabInfo && tabInfo.activeName === tabInfo.tabName"
           @DveiceId="DveiceId"></bar>
    </div>
    <div class="flex" v-loading="loading">
      <!-- 表格 -->
      <el-table ref="table" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center" min-width="160px">
        </el-table-column>
        <el-table-column prop="r0p" label="能耗量" show-overflow-tooltip align="center" min-width="160px">
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
    </div >

    <!--弹出框-->
    <el-dialog title="设备能耗排名" :visible.sync="dialogInfo.show2">
      <div class="filter-container flex">
        <div class="filter-item filter-item_left">
          <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves
          @click="Extprot2"
          >导出
          </el-button>
        </div>
      </div>
      <div class="flex">
        <!--<bar :echartoptions="echartsbaroptions" v-if="tabInfo && tabInfo.activeName === tabInfo.tabName" @DveiceId="DveiceId"></bar>-->
        <bar2 :echartoptionsS="echartsbaroptionsS"></bar2>

      </div>

      <div class="flex">

        <!-- 表格 -->
        <el-table ref="table" :data="listInfo.data2" border style="width:100%" v-loading="listInfo.loading">
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center" min-width="160px">
          </el-table-column>
          <el-table-column prop="r0p" label="能耗量" show-overflow-tooltip align="center" min-width="160px">
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div v-show="!listInfo.loading" class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="listInfo.query.curPage2"
            :page-sizes="listInfo.pageSizes2"
            :page-size="listInfo.query.pageSize2" layout="total, sizes, prev, pager, next, jumper"
            :total="listInfo.total2">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 引入接口
  import {
    GetChartDataApi,
    GetDataListApi,
    GetMeterDataApi,
    GetMetraListApi,
    ExportToExcelApi
  } from '@/api/project/S0305A'

  import bar from '@/views/S0305A/components/bar'
  import bar2 from '@/views/S0305A/components/barDialog'
  import {mapGetters} from 'vuex'

  // 定义提示弹窗初始参数
  let MESSAGE, TYPE

  export default {
    components: {
      bar,
      bar2
    },
    props: {
      entpId: {
        type: Number
      },
      entpCode: {
        type: String
      },
      // 选项卡相关信息，用来处于echarts的显示问题
      tabInfo: {
        type: Object,
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    data () {
      return {
        loading:false,
        // DveiceId
        DveiceId_id: null,
        // 显示类型
        date_type: [
          {label: '年', value: 'year'},
          {label: '月', value: 'month'},
          {label: '日', value: 'date'}
        ],
        dataTYPE: {
          date: 1,
          month: 2,
          year: 3
        },
        // 输出日期类型
        valueFormat: {
          date: 'yyyy-MM-dd',
          month: 'yyyy-MM',
          year: 'yyyy'
        },
        // 当前时间日期选择器特有的选项
        pickerOptions: {
          // 禁用日期通过 disabledDate 设置,这里禁用未来时间
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        },
        echartsbaroptions: {},
        echartsbaroptionsS: {},
        // 列表相关
        listInfo: {
          data: [],
          data2: [],
          total: 0,
          total2: 0,
          loading: false,
          pageSizes: this.$config.PAGESIZES,
          pageSizes2: [10, 25, 50, 100],
          // 查询条件
          query: {
            curPage: 1,
            curPage2: 1,
            pageSize: 10,
            pageSize2: 10,
            entp_code: this.entpCode,
            proj_id: null,
            dateType: 0,// 显示类型
            DateTypeName: 'date',// 显示类型
            starttime: '',// 时间
            dagd_id: null,  // 维度ID
            topnumber: 10,// 数量
            sorttype: 2 // 排序
          }
        },
        // 页面相关的列表类型
        listTypeInfo: {
          // 维度列表
          dagd_id_list: [],
          // 排名次序
          user_proj_list: [
            {value: 1, key: '从低到高'},
            {value: 2, key: '从高到低'}
          ]
        },
        // 弹窗相关
        dialogInfo: {
          header: {
            add: '添加',
            update: '编辑'
          },
          show: false,
          show2: false,
          status: '',
          btLoading: false
        },
        // 表单参数
        form: {
          bubi_code: '', // 数据库名称 *
          user_pwd: '', // 用户密码 *
          log_title: '', // 记录ID *
          bubi_name: '', // 用户
          bubi_totalArea: '', // 所属项目
          bubi_airArea: '', // 办公电话
          bubi_heatArea: '', // 手机号码
          enir_id: '', // 电子邮件
          log_desc: '', // 创建人 *
          log_addtime: '' // 创建时间 *
        },
        // 表单验证规则
        rules: {
          bubi_code: [
            {
              required: true,
              message: "请输入数据库名称",
              trigger: ['blur', 'change']
            },
            {
              max: 15,
              message: "长度最多为15个字符",
              trigger: ['blur', 'change']
            }
          ],
          user_pwd: [
            {
              required: true,
              message: "请输入用户密码",
              trigger: ['blur', 'change']
            },
            {
              max: 15,
              message: "长度最多为24个字符",
              trigger: ['blur', 'change']
            }
          ],
          log_title: [
            {
              required: true,
              message: "请输入记录ID",
              trigger: ['blur', 'change']
            }
          ],
          bubi_name: [
            {
              required: true,
              message: "请输入用户",
              trigger: ['blur', 'change']
            }
          ],
          bubi_totalArea: [
            {
              required: true,
              message: "请选择所属项目",
              trigger: ['blur', 'change']
            }
          ],
          enir_id: [
            {
              required: true,
              message: "请选择数据库状态",
              trigger: ['blur', 'change']
            }
          ]
        }
      }
    },
    mounted () {
    this.listInfo.query.starttime=this.$fn.switchTime(new Date() - 3600 * 24 * 1000,'YYYY-MM-DD')
      this.$api.getDagdByEntpApi({dagd_entp_id: this.entpId, proj_id: this.projectInfo.proj_id}).then(res => {
        if (res.success) {
        this.loading=true
          this.getList()
          if (res.content.data.length) {
            this.listInfo.query.dagd_id = res.content.data[0].dagd_id
          }
          this.listTypeInfo.dagd_id_list = res.content.data
          this.listInfo.query.proj_id = this.projectInfo.proj_id
        }
      })
      .catch(() => {
        this.loading = false
      })
      //this.$refs.search.click()

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
        }
      }
    },
    methods: {
      // 导出表格
      /*  exportExcel () {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['序号','建筑编号', '建筑名称', '建筑面积', '空调面积', '采暖面积','能耗量']
            const filterVal = ['user_id','bubi_code', 'bubi_name', 'bubi_totalArea', 'bubi_airArea', 'bubi_heatArea','enir_id']
            const list = this.listInfo.data
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename||'用能排行',
              autoWidth: this.autoWidth
            })
          })
          /!*let wb = XLSX.utils.table_to_book(document.getElementById('#out-table'),{sheet:'告警查询'})
          let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '告警查询.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout*!/
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        },*/
      typeChang(val){
      if (val==='date'){
      this.listInfo.query.starttime=this.$fn.switchTime(new Date(),'YYYY-MM-DD')
      } else if(val==='month'){
        this.listInfo.query.starttime=this.$fn.switchTime(new Date(),'YYYY-MM')
      }else {
        this.listInfo.query.starttime=this.$fn.switchTime(new Date(),'YYYY')
      }
      },
      // 第一个导出表格
      Extprot () {
        let a = document.createElement('a')
        a.href=this.$config.uPurlHost+'/api/S0305A/ExportToExcel?'+'dagd_id='+this.listInfo.query.dagd_id+'&DateTypeName='+this.listInfo.query.DateTypeName+'&pageSize='+this.listInfo.query.pageSize+'&curPage='+this.listInfo.query.curPage+'&starttime='+this.listInfo.query.starttime+'&entp_code='+this.entpCode+'&proj_id='+this.projectInfo.proj_id+'&sorttype='+this.listInfo.query.sorttype
        a.download = ''
        a.click()
        // console.log(data)
       /* ExportToExcelApi(data).then(res => {
          // let excelBlob = new Blob([res], {type: 'application/vnd.ms-excel'})
          // console.log(excelBlob)
          // let a = document.createElement('a')
         // a.href=URL.createObjectURL(excelBlob)
         // a.download = ''
         // a.click()

        })*/
      },
      // 弹出框导出表格
      Extprot2(){
        let a = document.createElement('a')
        a.href=this.$config.uPurlHost+'/api/S0305A/ExportMeterData?'+'dagd_id='+this.listInfo.query.dagd_id+'&DateTypeName='+this.listInfo.query.DateTypeName+'&pageSize='+this.listInfo.query.pageSize+'&curPage='+this.listInfo.query.curPage+'&starttime='+this.listInfo.query.starttime+'&entp_code='+this.entpCode+'&proj_id='+this.projectInfo.proj_id+'&sorttype='+this.listInfo.query.sorttype+'&data.dataid='+this.DveiceId_id
        a.download = ''
        a.click()
      },
      // 设备分组id
      DveiceId (id) {
        this.DveiceId_id = id
        this.barDialog()
      },
      //barDialog
      barDialog () {
        this.dialogInfo.show2 = true
        let data = {
          starttime: this.listInfo.query.starttime,
          topnumber: this.listInfo.query.topnumber,
          data: {
            dataid: this.DveiceId_id
          },
          curPage: this.listInfo.query.curPage2,
          pageSize: this.listInfo.query.pageSize2,
          sorttype: this.listInfo.query.sorttype,
          proj_id: this.projectInfo.proj_id,
          entp_code: this.listInfo.query.entp_code,
          DateTypeName: this.listInfo.query.DateTypeName
        }
        GetMeterDataApi(data).then(res => {
          if (res.success) {
            this.echartsbaroptionsS = res.content.data.echartsbaroptions
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
          }
        })
        // 表格数据
        GetMetraListApi(data).then(res => {
          if (res.success) {
            this.listInfo.data2 = res.content.data
            this.listInfo.total2 = res.content.total
            this.listInfo.query.curPage2 = res.content.curPage
            this.listInfo.query.pageSize2 = res.content.pageSize
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      },
      // 得到数据
      getList () {
        this.listInfo.loading = true
        //this.listInfo.query.dateType = this.dataTYPE[this.listInfo.query.dateType]
        GetChartDataApi(this.listInfo.query)
          .then(response => {
            this.listInfo.loading = false
            if (response.success) {
              this.loading=false
              this.echartsbaroptions = response.content.data.echartsbaroptions
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

        // 表格数据
        GetDataListApi(this.listInfo.query).then(res => {
          if (res.success) {
            this.listInfo.data = res.content.data
            this.listInfo.total = res.content.total
            this.listInfo.query.curPage = res.content.curPage
            this.listInfo.query.pageSize = res.content.pageSize
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      },
      // 页面切换
      handleCurrentChange (val) {
        this.listInfo.query.curPage = val // 当前页
        this.getList()
      },
      // 页面切换
      handleCurrentChange2 (val) {
        this.listInfo.query.curPage2 = val // 当前页
        this.barDialog()
      },
      // 页数改变
      handleSizeChange (val) {
        this.listInfo.query.pageSize = val  // 一页几个
        this.getList()
      },
      // 页数改变
      handleSizeChange2 (val) {
        this.listInfo.query.pageSize2 = val  // 一页几个
        this.barDialog()
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
            // 显示当前数据
            this.form = JSON.parse(JSON.stringify(row))
            break
          case 'delete':
            this.handleDelete(row)
            break
          /*case 'status':
            this.handleSwitchStatus(row)*/
        }
      },
      // 确认的事件处理
      handConfirm (type) {
        this.$refs.form.validate(valid => {
          if (valid) {
            let api
            if (type === 'add') {
              api = addProjectApi
            } else if (type === 'update') {
              api = updateProjectApi
            } else {
              return
            }
            api(this.form)
              .then(response => {
                this.dialogInfo.show = false
                if (response.success) {
                } else {
                }
              })
              .catch(() => {
                this.dialogInfo.show = false
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
            deleteProjectApi(row).then(response => {
              if (response.success) {
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
          bubi_code: '', // 用户姓名 *
          user_pwd: '', // 用户密码 *
          log_title: '', // 所属角色 *
          bubi_name: '', // 所属能源服务商
          bubi_totalArea: '', // 所属项目
          bubi_airArea: '', // 办公电话
          bubi_heatArea: '', // 手机号码
          enir_id: '', // 电子邮件
          log_desc: '', // 创建人 *
          log_addtime: '' // 创建时间 *
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .flex {
    padding: 10px 0;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 0 10px rgb(200, 200, 200);

  }
</style>
