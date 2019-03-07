<template>
  <div class="page-children">
    <div class="left">
      <!-- 维度 -->
      <div class="filter-container">
        <div class="filter-item">
          <label class="filter-label">维度:</label>
          <el-select class="filter-item" v-model="listInfo.query.dimension" placeholder="请选择维度" filterable style="width: 160px;" @change="handleChangeDimension">
            <el-option v-for="(item, index) in  listTypeInfo.dimensionTypeList" :key="index" :label="item.key" :value="item.value" v-if="entpId === item.dagd_entp_id"></el-option>
          </el-select>
        </div>
      </div>
      <!-- 左侧数结构 -->
      <div class="tree">
        <Tree 
          :checkBox="true"
          :treeRefresh="treeRefresh"
          :dimension="listTypeInfo.dimensionTypeList.find(item => { item.id = item.dagd_id; item.name = item.key; return item.value === listInfo.query.dimension})"
          @cdHandleTreeCheck="cdHandleTreeCheck"
          @cdHandleClickLeft="cdHandleClickLeft">
        </Tree>
      </div>
    </div>
    <!-- 右侧页面 -->
    <div class="content">
      <!-- 条件 -->
      <div class="filter-container">
        <div class="filter-item">
          <div class="filter-item">
            <label class="filter-label">显示类型:</label>
            <el-select class="filter-item filter-input" v-model="listInfo.query.date_type" placeholder="请选择时间类型" filterable style="width: 70px">
              <el-option v-for="(item, index) in  listTypeInfo.dateTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="filter-item filter-item_left">
            <label class="filter-label">时间:</label>
            <el-date-picker
              class="filter-item filter-date"
              v-model="listInfo.query.starttime"
              :type="getDateType(listInfo.query.date_type)"
              :picker-options="datePickerOptions"
              :clearable="false"
              placeholder="选择时间">
            </el-date-picker>
          </div>
          <div class="filter-item filter-item_left">
            <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList('search')">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves @click="exportExcel()">导出</el-button>
          </div>
        </div>
      </div>
      <!-- 显示表格 -->
      <el-table ref="table" :max-height="listInfo.tableHeight || undefined" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
        <el-table-column align="center" label="序号" width="65" fixed>
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
        </el-table-column>
        <el-table-column 
          v-for="(item, index) in fieldList[listInfo.date_type]" 
          :key="index" 
          :prop="item.value" 
          :label="item.key"
          :fixed="item.fixed"
          align="center" 
          :min-width="item.width || '100px'">
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
  </div>
</template>

<script>
import Tree from '@/components/reportTree/index'
// 引入接口
import { getListApi, exportToExcelApi } from '@/api/project/S0501A'
import { getListApi as getDimensionType } from '@/api/project/S0803A'
import { mapGetters } from 'vuex'
export default {
  name: 'childrenPage',
  props: {
    entpId: {
      type: Number
    },
    entpCode: {
      type: String
    }
  },
  components: {
    Tree
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        pageInit: true,
        initCurPage: false,
        tableHeight: 0,
        data: [],
        date_type: 'day',
        // 表计
        meter: [],
        total: 0,
        loading: false,
        pageSizes: this.$config.PAGESIZES,
        // 查询条件
        query: {
          curPage: 1,
          pageSize: this.$config.PAGESIZE,
          proj_id: '',
          dimension: '',
          dagd_id: '',
          entp_code: '',
          nodelist: [],
          date_type: 'day',
          datetype: 1,
          starttime: new Date()
        }
      },
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        dimensionTypeList: [],
        // 日期类型
        dateTypeList: [
          {key: '年', value: 'year'},
          {key: '月', value: 'month'},
          {key: '日', value: 'day'}
        ]
      },
      // 自定义对应的表单字段，用来动态匹配显示数据
      fieldList: {
        // 日
        day: [],
        // 月
        month: [],
        // 年
        year: []
      },
      // 弹窗相关
      dialogInfo: {
        header: {
          add: '添加',
          update: '编辑'
        },
        show: false,
        status: '',
        btLoading: false
      },
      // 树组件相关数据
      treeInfo: {
        dialogType: 'add', // 当前右键点击的类型
        eventType: '',
        clickData: {},
        checkedData: []
      },
      treeRefresh: 0
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo',
      'isFullScreen'
    ])
  },
  mounted () {
    this.initField()
    this.initlistTypeInfo()

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
      }
    }
  },
  methods: {
    // 初始化生成字段
    initField (type, val) {
      let yearList = [],
          monthList = [],
          dayList = [],
          date = new Date(),
          year  = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate(),
          hour = date.getHours(),
          yearVal = +this.$fn.switchTime(val, 'YYYY'),
          monthVal = +this.$fn.switchTime(val, 'MM'),
          dayVal = +this.$fn.switchTime(val, 'DD')
      // 初始化月
      monthList.push(
        {value: 'metr_name', key: '电表名称', fixed: true, width: '200px'},
        {value: 'metr_rate', key: '变比', width: '80px'},
        {value: 'total', key: '合计'}
      )
      if (type === 'month') {
        // 月
        for (let i = 0, len = getMonthType(monthVal); i < len; i++) {
          if (yearVal === year && monthVal === month) {
            if (day > i) {
              monthList.push({value: 'd' + (i + 1), key: i + 1 + '日'})
            }
          } else {
            monthList.push({value: 'd' + (i + 1), key: i + 1 + '日'})
          }
        }
      } else {
        // 初始化年和日
        yearList.push(
          {value: 'metr_name', key: '电表名称', fixed: true, width: '200px'},
          {value: 'metr_rate', key: '变比', width: '80px'},
          {value: 'total', key: '合计'}
        )
        dayList.push(
          {value: 'metr_name', key: '电表名称', fixed: true, width: '200px'},
          {value: 'metr_rate', key: '变比', width: '80px'},
          {value: 'total', key: '合计'}
        )
        // 年 (如果是当前年，则表格显示到当前月)
        for (let i = 0, len = 12; i < len; i++) {
          if (yearVal === year) {
            if (month > i) {
              yearList.push({value: 'm' + (i + 1), key: i + 1 + '月'})
            }
          } else {
            yearList.push({value: 'm' + (i + 1), key: i + 1 + '月'})
          }
        }
        // 月 (如果是当前月，则表格显示到当前月)
        for (let i = 0, len = getMonthType(monthVal); i < len; i++) {
          if (yearVal === year && monthVal === month) {
            if (day > i) {
              monthList.push({value: 'd' + (i + 1), key: i + 1 + '日'})
            }
          } else {
            monthList.push({value: 'd' + (i + 1), key: i + 1 + '日'})
          }
        }
        // 日
        for (let i = 0, len = 24; i < len; i++) {
          if (yearVal === year && monthVal === month && dayVal === day) {
            if (hour > i) {
              dayList.push({value: 'h' + i, key: i < 10 ? '0' + i + ': 00' : i + ':00'})
            }
          } else {
            dayList.push({value: 'h' + i, key: i < 10 ? '0' + i + ': 00' : i + ':00'})
          }
        }
      }
      // 得到月的天数
      function getMonthType(monthVal) {
        let arr = [1, 3, 5, 7, 8, 10, 12], days = 30
        for (let i = 0, len = arr.length; i < len; i++) {
          if (+monthVal === arr[i]) {
            days = 31
          }
        }

        return days
      }

      this.fieldList.year = yearList
      this.fieldList.month = monthList
      this.fieldList.day = dayList
    },
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
        api = getMeterListApi
        break
      case 'update':
        api = getMeterListApi
        break
      case 'delete':
        api = getMeterListApi
        break
      case 'addMeter':
        api = getMeterListApi
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
            reject()
          }
        })
        .catch(() => {
          reject()
        })
      })
    },
    // 树状组件勾选事件处理
    cdHandleTreeCheck (data) {
      // 点击不同数据的时候, 页数初始化
      if (JSON.stringify(this.treeInfo.checkedData) !== JSON.stringify(data)) {
        this.listInfo.initCurPage = true
      }
      this.treeInfo.checkedData = data
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data) {
      // 点击不同数据的时候, 页数初始化
      if (JSON.stringify(this.treeInfo.clickData) !== JSON.stringify(data)) {
        this.listInfo.initCurPage = true
      }
      // 得到当前点击的数据
      this.treeInfo.clickData = data
      // 初始化，获取到所有数据后请求列表
      this.$watch('treeInfo.checkedData', () => {
        if (this.listInfo.pageInit) {
          this.getList('search')
          this.listInfo.pageInit = false
        }
      })
    },
    // 得到不同类型的列表
    initlistTypeInfo () {
      // 得到维度类型的数据
      this.$api.getDagdByEntpApi({dagd_entp_id: this.entpId, proj_id: this.projectInfo.proj_id}).then(response => {
        if (response.success) {
          this.listTypeInfo.dimensionTypeList = response.content.data

          let key = 0
          this.listTypeInfo.dimensionTypeList.forEach(item => {
            item.key = item.dagd_name
            item.value = item.dagd_id
            item.pathName = item.dagd_name
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
      })
    },
    // 切换维度
    handleChangeDimension () {
      this.treeRefresh = Math.random()
    },
     // 得到时间类型
    getDateType (type) {
      switch (type) {
        case 'year':
          return type
        case 'month':
          return type
        case 'day':
          return 'date'
        }
    },
    // 过滤条件
    filterSearch () {
      // 时间不能为空
      if (!this.listInfo.query.starttime) {
        this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'warning',
          duration: 3500
        })
        return false
      }
      return true
    },
    // 数据处理
    dealParam (type) {
      // 对数据做处理
      let query = this.listInfo.query, arr = []
      query.entp_code = this.entpCode
      query.proj_id = this.projectInfo.proj_id
      query.dagd_id = query.dimension

      switch (query.date_type) {
      case 'year':
        query.datetype = 3
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY') + '-01-01'
        break
      case 'month':
        query.datetype = 2
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY-MM')
        break
      case 'day':
        query.datetype = 1
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY-MM-DD')
        break
      }
  
      // 当前表格显示的数据类型
      this.listInfo.date_type = query.date_type
      
      // 表格重载
      this.initField(query.date_type, query.starttime)

      // 如果为查询数据, 则使用点击的ID, 分页时用上一次查询时的ID
      if (type === 'search' || type === 'excel') {
        // 对数据做处理
        this.treeInfo.checkedData.forEach(item => {
          if (item.type === 'dimension') {
            // arr.push({type: 1, dataid: item.dagd_id})
          } else if (item.type === 'group') {
            arr.push({dtype: 2, dataid: item.dagp_id})
          } else if (item.type === 'metr') {
            arr.push({dtype: 3, dataid: item.metr_id})
          }
        })
        query.nodelist = arr
        // 如果点击了树状，则此时请求第一页
        query.curPage = this.listInfo.initCurPage ? 1 : query.curPage
        // 参数重置
        this.listInfo.initCurPage = false
      }
    },
    // 得到数据
    getList (type) {
      // 过滤器
      if (!this.filterSearch()) {
        return
      }
      this.dealParam(type)
      this.listInfo.loading = true
      let obj = JSON.parse(JSON.stringify(this.listInfo.query))
      delete obj.date_type
      delete obj.dimension
      getListApi(obj)
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
    // 导出excel
    exportExcel () {
      // 过滤器
      if (!this.filterSearch()) {
        return
      }
      this.dealParam('excel')
      exportToExcelApi(this.listInfo.query).then(response => {
        if (response) {
            this.$fn.openWindow(`${this.$fn.getHost()}/api/S0501A/ExportExcel?fileName=${response}`)
          }
      })
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
