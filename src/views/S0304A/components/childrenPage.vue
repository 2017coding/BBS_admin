<template>
  <div class="page-children">
    <div class="left">
      <div class="filter-container">
        <div class="filter-item">
          <label class="filter-label">维度:</label>
          <el-select class="filter-item filter-input" v-model="listInfo.query.dimension" placeholder="请选择维度" filterable @change="handleChangeDimension">
            <el-option v-for="(item, index) in  listTypeInfo.dimensionTypeList" :key="index" :label="item.key" :value="item.value" v-if="entpId === item.dagd_entp_id"></el-option>
          </el-select>
        </div>
      </div>
      <!-- 左侧数结构 -->
      <div class="tree">
        <Tree 
          :checkBox="true"
          :checkStrictly="true"
          :treeRefresh="treeRefresh"
          :dimension="listTypeInfo.dimensionTypeList.find(item => { item.id = item.dagd_id; item.name = item.key; return item.value === listInfo.query.dimension})"
          @cdHandleClickLeft="cdHandleClickLeft"
          @cdHandleTreeCheck="cdHandleTreeCheck">
        </Tree>
      </div>
    </div>
    <!-- 右侧页面 -->
    <div class="right">
      <!-- 条件 -->
      <div class="filter-container">
        <div class="filter-item">
          <el-checkbox v-model="listInfo.query.mom1">同比</el-checkbox>
          <el-checkbox v-model="listInfo.query.yoy1">环比</el-checkbox>
          <div class="filter-item filter-item_left">
            <label class="filter-label">显示类型:</label>
            <el-select class="filter-item" v-model="listInfo.query.date_type" placeholder="请选择时间类型" filterable style="width: 70px">
              <el-option v-for="(item, index) in  listTypeInfo.dateTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="filter-item filter-item_left">
            <label class="filter-label">开始时间:</label>
            <el-date-picker
              class="filter-item filter-date"
              v-model="listInfo.query.starttime1"
              :type="getDateType(listInfo.query.date_type)"
              :picker-options="datePickerOptions"
              :clearable="false"
              :format="listInfo.query.date_type === 'hour' ? 'yyyy-MM-dd HH' : ''"
              placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <div class="filter-item filter-item_left">
            <label class="filter-label">结束时间:</label>
            <el-date-picker
              class="filter-item filter-date"
              v-model="listInfo.query.endtime1"
              :type="getDateType(listInfo.query.date_type)"
              :picker-options="datePickerOptions"
              :clearable="false"
              :format="listInfo.query.date_type === 'hour' ? 'yyyy-MM-dd HH' : ''"
              placeholder="选择结束时间">
            </el-date-picker>
          </div>
          <div class="filter-item filter-item_left">
            <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <!-- 显示图表 -->
        <Chart 
          :chartData="chartData || {nameList: [], timeList: [], dataList: []}"
          :yUnit="getUnit()"
          v-if="tabInfo && tabInfo.activeName === tabInfo.tabName">
        </Chart>
        <!-- 显示表格 -->
        <el-table ref="table" :max-height="listInfo.tableHeight || undefined" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
          <!-- <el-table-column align="center" label="序号" width="80" fixed>
            <template slot-scope="scope">
              <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="名称" fixed v-if="listInfo.data.length === 0">
          </el-table-column>
          <el-table-column 
            v-for="(item, index) in fieldList"
            :key="index"
            :prop="item.value" 
            :label="item.key"
            :fixed="item.fixed"
            align="center"
            :min-width="item.width || '100px'">
            <el-table-column 
              v-if="item.children" 
              v-for="(childItem, childIndex) in item.children" 
              :key="childIndex"
              :prop="childItem.value" 
              :label="childItem.key"
              align="center" 
              min-width="85px">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/reportTree/index'
import Chart from '@/components/chart/index'

// 引入接口
import { getMeterListApi } from '@/api/project/S0801A'
import { getListApi } from '@/api/project/S0304A'
import { mapGetters } from 'vuex'
export default {
  name: 'childrenPage',
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
  components: {
    Tree,
    Chart
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        pageInit: true,
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
          proj_id: '',
          dimension: '',
          dagd_id: '',
          entp_code: '',
          date_type: 'hour',
          dateType: 4,
          // 开始时间和结束时间
          starttime1: this.$fn.switchTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00',
          endtime1: new Date(),
          starttime: '',
          endtime: '',
          data: [],
          // 同比
          mom: 0,
          mom1: false,
          // 环比
          yoy: 0,
          yoy1: false,
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
        // 计量方式列表
        dagpWayList: [
          {value:  1, key: '子表计量'},
          {value:  2, key: '总表计量'}
        ],
        // 总表列表
        dagpMetrList: [
          {value:  1, key: '华力特大厦'},
          {value:  2, key: '机场'}
        ],
        // 维度类型
        dimensionTypeList: [],
        // 日期类型
        dateTypeList: [
          {key: '年', value: 'year'},
          {key: '月', value: 'month'},
          {key: '日', value: 'day'},
          {key: '时', value: 'hour'}
        ]
      },
      // 表单数据
      form: {
        dagp_id: '', // 分组ID *
        dagp_dagd_id: '', // 分组维度ID *
        dagp_pid: '', // 分组父ID *
        dagp_bubi_id: '', // 建筑ID *
        dagp_name: '', // 分组名称 *
        dagp_way: '', // 计量方式 *
        dagp_metr_id: '', // 总表ID
        dagt_sort: '' // 分组排序 *
      },
      // 字段列表
      fieldList: [],
      // 树组件相关数据
      treeInfo: {
        dialogType: 'add', // 当前右键点击的类型
        eventType: '',
        data: '',
        checkedData: []
      },
      treeRefresh: 0,
      // echarts的数据
      chartData: null,
      chartxUnit: '',
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
    ])
  },
  mounted () {
    this.initlistTypeInfo()
    // 表格的高度 = 视口高度 - 头部导航的高度137 - echarts400 - padding30 - 分页组件的高度100 - 分页组件到表格的margin-top20
    this.listInfo.tableHeight = document.body.clientHeight - 137
    // 监听页面大小改变
    window.addEventListener('resize', () => {
      // 表格的高度 = 视口高度 - 头部导航的高度137 - echarts400 - padding30 - 分页组件的高度100 - 分页组件到表格的margin-top20
      this.listInfo.tableHeight = document.body.clientHeight - 137
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
    },
    'listInfo.query.date_type' (val) {
      /**
       * 切换为年的时候， 初始时间为过去五年到现在
       * 切换月的时候为今年一月到现在
       * 切换日的时候为这个月一号到现在
       * 切换小时的时候为今天零点到现在
       */
      let year = this.$fn.switchTime(new Date(), 'YYYY'),
          month = this.$fn.switchTime(new Date(), 'MM'),
          day = this.$fn.switchTime(new Date(), 'DD'),
          query = this.listInfo.query
      switch (val) {
        case 'hour':
          query.starttime1 = year + '-' + month + '-' + day + ' 00:00:00'
          break
        case 'day':
          query.starttime1 = year + '-' + month + '-' + '01'
          break
        case 'month':
          query.starttime1 = year + '-' + '01' + '-01'
          break
        case 'year':
          query.starttime1 = year - 5 + '-01-01'
          break
      }
      
    }
  },
  methods: {
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
    // 树状组件勾选事件处理
    cdHandleTreeCheck (data) {
      this.treeInfo.checkedData = data
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data) {
      // 初始化，获取到所有数据后请求列表
      this.$watch('treeInfo.checkedData', () => {
        if (this.listInfo.pageInit) {
          this.getList()
          this.listInfo.pageInit = false
        }
      })
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
        case 'hour':
          return 'datetime'
        }
    },
    // 过滤条件
    filterSearch () {
      let query = this.listInfo.query
      // 时间不能为空
      if (!query.starttime1 || !query.endtime1) {
        this.$message({
          showClose: true,
          message: '开始时间或结束时间不能为空',
          type: 'warning',
          duration: 3500
        })
        return false
      }
      // 开始时间不能大于结束时间
      if (+new Date(query.starttime1) > +new Date(query.endtime1)) {
        this.$message({
          showClose: true,
          message: '开始时间不能大于结束时间',
          type: 'warning',
          duration: 3500
        })
        return false
      }
      // 没选择节点不往下进行
      if (this.treeInfo.checkedData.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择左侧节点',
          type: 'warning',
          duration: 3500
        })
        return false
      }
      // 查询年
      // 查询月
      // 查询日
      // 查询小时   设置时间间隔
      let year = this.$fn.switchTime(query.endtime1, 'YYYY') - this.$fn.switchTime(query.starttime1, 'YYYY'),
          month = this.$fn.switchTime(query.endtime1, 'MM') - this.$fn.switchTime(query.starttime1, 'MM'),
          day = this.$fn.switchTime(query.endtime1, 'DD') - this.$fn.switchTime(query.starttime1, 'DD'),
          hour = this.$fn.switchTime(query.endtime1, 'hh') - this.$fn.switchTime(query.starttime1, 'hh')
      switch (query.date_type) {
        case 'hour':
          // 时间间隔不超过72小时
          if (day * 24 + hour > 72) {
            this.$message({
              showClose: true,
              message: '查询的时间间隔不能超过72小时',
              type: 'warning',
              duration: 3500
            })
            return false
          }
          break
        case 'day':
          // 时间间隔不超过三个月
          if (year * 12 + month > 3) {
            this.$message({
              showClose: true,
              message: '查询的时间间隔不能超过三个月',
              type: 'warning',
              duration: 3500
            })
            return false
          }
          break
        case 'month':
          // 时间间隔不超过三年
          if (year > 3) {
            this.$message({
              showClose: true,
              message: '查询的时间间隔不能超过三年',
              type: 'warning',
              duration: 3500
            })
            return false
          }
          break
        case 'year':
          // 时间间隔不超过十年
          year = this.$fn.switchTime(query.endtime1, 'YYYY') - this.$fn.switchTime(query.starttime1, 'YYYY')
          if (year > 10) {
            this.$message({
              showClose: true,
              message: '查询的时间间隔不能超过十年',
              type: 'warning',
              duration: 3500
            })
            return false
          }
          break
      }
      return true
    },
    // 数据处理
    dealParam () {
      // 对数据做处理
      let query = this.listInfo.query, arr = []

      query.entp_code = this.entpCode
      query.proj_id = this.projectInfo.proj_id
      query.dagd_id = query.dimension
      query.mom = query.mom1 ? 1 : 0
      query.yoy = query.yoy1 ? 1 : 0

      this.treeInfo.checkedData.forEach(item => {
        if (item.type === 'dimension') {
          // arr.push({type: 1, dataid: item.dagd_id, dataname: item.name})
        } else if (item.type === 'group') {
          arr.push({type: 2, dataid: item.dagp_id, dataname: item.name})
        } else if (item.type === 'metr') {
          arr.push({type: 3, dataid: item.metr_id, dataname: item.name})
        }
      })
      query.data = arr

      switch (query.date_type) {
      case 'year':
        query.dateType = 3
        query.starttime = this.$fn.switchTime(query.starttime1, 'YYYY')
        query.endtime = this.$fn.switchTime(query.endtime1, 'YYYY')
        break
      case 'month':
        query.dateType = 2
        query.starttime = this.$fn.switchTime(query.starttime1, 'YYYY-MM')
        query.endtime = this.$fn.switchTime(query.endtime1, 'YYYY-MM')
        break
      case 'day':
        query.dateType = 1
        query.starttime = this.$fn.switchTime(query.starttime1, 'YYYY-MM-DD')
        query.endtime = this.$fn.switchTime(query.endtime1, 'YYYY-MM-DD')
        break
      case 'hour':
        query.dateType = 4
        query.starttime = this.$fn.switchTime(query.starttime1, 'YYYY-MM-DD hh')
        query.endtime = this.$fn.switchTime(query.endtime1, 'YYYY-MM-DD hh')
        break
      }

      // 当前表格显示的数据类型
      this.listInfo.date_type = query.date_type
    },
    // 得到数据
    getList () {
      // 过滤器
      if (!this.filterSearch()) {
        return
      }
      this.dealParam()
      this.listInfo.loading = true
      getListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response) {
            // this.listInfo.total = response.content.total

            // 对数据处理，得到表格和图表显示的数据
            this.getData(response.seriesData)
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
    getUnit () {
      let entpName = '能', entpUnit = 'unit'
      switch (this.entpCode + '') {
        case '01000':
          entpName = '电'
          entpUnit = 'kWh'
          break
        case '02000':
          entpName = '水'
          entpUnit = 't'
          break
        case '03000':
          entpName = '气'
          entpUnit = 'Nm³'
          break
        case '04000':
          entpName = '热'
          entpUnit = 'J'
          break
        case '05000':
          entpName = '冷'
          entpUnit = 'RT'
          break
      }

      return '用' + entpName + '量' + '(' + entpUnit + ')'
    },
    // 数据处理
    getData (data) {
     // 根据选择的条件得到eaharts数据
      let echartData = {nameList: [], timeList: [], dataList: [], totalList: []}, 
          tableData = {dataList: [], fieldList: []}
      data.forEach((item, index) => {
        let timeArr = [], dataChild = {}
        dataChild.name = item.name
        dataChild.total = item.total
        // 对时间做处理
        item.time.forEach((timeChild, timeIndex) => {
          let year, 
              month, 
              day, 
              hh, 
              objItem = {}, 
              dateType = this.listInfo.query.date_type,
              dataType = item.dataType,
              field = '',
              field1 = ''
          year = timeChild.substr(0, 4)
          month = timeChild.substr(4, 2)
          day = timeChild.substr(6, 2)
          hh = timeChild.substr(8, 2)



          // 得到图表要显示的时间数据
          if (dateType === 'day') {
            field = day + '日'
            field1 = year + '年' + month + '月' + day + '日'
          } else if (dateType === 'month') {
            field = month + '月'
            field1 = year + '年' + month + '月'
          } else if (dateType === 'year') {
            field = year + '年'
            field1 = year + '年'
          } else if (dateType === 'hour') {
            field = hh + '时'
            field1 = year + '年' + month + '月' + day + '日' + ' ' + hh + '时'
          }
          timeArr.push(field1)

          // 设置表格字段
          if (dateType === 'year') {
            objItem.key = '年'
            objItem.children = [{value: timeIndex + 'data' , key: field}]
          } else {
            objItem.key = field1.replace(field, '').trim()
            objItem.children = [{value: timeIndex + 'data' , key: field}]
          }
          // 设置表格数据
          dataChild[timeIndex + 'data'] = item.data[timeIndex]

          // 初始化表格字段(第一次循环的时候生成字段列表)
          if (index === 0) {
            if (timeIndex === 0) {
              tableData.fieldList.unshift({key: '合计', value: 'total', fixed: true})
              tableData.fieldList.unshift({key: '监测点', value: 'name', fixed: true, width: '260px'})
            }
            let key = 0
            tableData.fieldList.forEach(fieldItem => {
              if (fieldItem.key === objItem.key) {
                fieldItem.children = fieldItem.children.concat(objItem.children)
              } else {
                key++
              }
            })
            if (key === tableData.fieldList.length) {
              tableData.fieldList.push(objItem)
            }
          }
        })
        tableData.dataList.push(dataChild)
        // 数据处理
        echartData.timeList = item.dataType === 1 ? timeArr : echartData.timeList
        echartData.nameList.push(item.name)
        echartData.dataList.push(item.data)
        echartData.totalList.push(item.total)
      })
      // 设置字段列表
      this.fieldList = tableData.fieldList
      // 得到列表显示数据
      this.listInfo.data = tableData.dataList
      this.listInfo.total = this.listInfo.data.length
      // 得到echarts的数据
      this.chartData = echartData
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
    .right{
      margin-left: 260px;
      height: 100%;
      overflow: auto;
    }
  }
</style>
 