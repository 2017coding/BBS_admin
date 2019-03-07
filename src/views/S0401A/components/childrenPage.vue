<template>
  <div class="page-children">
    <!-- 左侧页面 -->
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
          :treeRefresh="treeRefresh"
          :dimension="listTypeInfo.dimensionTypeList.find(item => { item.id = item.dagd_id; item.name = item.key; return item.value === listInfo.query.dimension})"
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
            <label class="filter-label">关键字:</label>
            <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入电表编号/名称"></el-input>
          </div>
          <div class="filter-item filter-item_left">
            <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList('search')">搜索</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves @click="exportExcel()">导出</el-button>
          </div>
        </div>
      </div>
      <!-- 显示表格 -->
      <el-table ref="table" :max-height="listInfo.tableHeight || undefined" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
        <el-table-column align="center" label="序号" width="80" fixed>
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
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
import { mapGetters } from 'vuex'
import Tree from '@/components/reportTree/index'
// 引入接口
import { getListApi, exportExcelApi } from '@/api/project/S0401A'
import { getListApi as getDimensionType } from '@/api/project/S0803A'
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
          data: {},
          date_type: 'day',
          dateType: 1,
          starttime: this.$fn.switchTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00',
          keyword: ''
        }
      },
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      // 自定义对应的表单字段，用来动态匹配显示数据
      fieldList: {
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
      // 树组件相关数据
      treeInfo: {
        dialogType: 'add', // 当前右键点击的类型
        eventType: '',
        clickData: {}
      },
      treeRefresh: 0
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
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
  },
  methods: {
    // 初始化生成字段
    initField () {
      let elecDataList, coldDataList, waterDataList, hotDataList, gasDataList, config, children

      // 能耗类型为电
      elecDataList = [
        // {value: 'dagp_name', key: '分组名称', width: '160px', fixed: true},
        // {value: 'metr_no', key: '表号', width: '200px', fixed: true},
        {value: 'metr_name', key: '电表名称', width: '200px', fixed: true},
        {value: 'starttime', key: '日期', width: '160px'},
        {value: 'metr_rate', key: '变比', width: '80px'},
        {value: 'r0P_S', key: '起始表底值', width: '160px'},
        // {value: 'endtime', key: '结束日期', width: '160px'},
        {value: 'r0P_E', key: '结束表底值', width: '160px'},
        {value: 'r0P', key: '用电量', width: '160px'},
      ]

      // 能耗类型为水
      waterDataList = [
        // {value: 'dagp_name', key: '分组名称', width: '260px', fixed: true},
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'wacd_starttime', key: '日期', width: '160px'},
        {value: 'wacd_val_s', key: '起始表底值(t)', width: '160px'},
        // {value: 'wacd_endtime', key: '结束日期', width: '160px'},
        {value: 'wacd_val_e', key: '结束表底值(t)', width: '160px'},
        {value: 'wacd_val', key: '用水量(t)', width: '160px'},
      ] 

      // 能耗类型为冷
      coldDataList = [
        // {value: 'dagp_name', key: '分组名称', width: '260px', fixed: true},
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'coch_starttime', key: '日期', width: '160px'},
        {value: 'coch_val_s', key: '起始表底值(RT)', width: '160px'},
        // {value: 'coch_endtime', key: '结束日期', width: '160px'},
        {value: 'coch_val_e', key: '结束表底值(RT)', width: '160px'},
        {value: 'coch_val', key: '用冷量(RT)', width: '160px'},
      ]

      // 能耗类型为热
      hotDataList = [
        // {value: 'dagp_name', key: '分组名称', width: '260px', fixed: true},
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'hoch_starttime', key: '日期', width: '160px'},
        {value: 'hoch_val_s', key: '起始表底值(J)', width: '160px'},
        // {value: 'hoch_endtime', key: '结束日期', width: '160px'},
        {value: 'hoch_val_e', key: '结束表底值(J)', width: '160px'},
        {value: 'hoch_val', key: '用热量(J)', width: '160px'},
      ]

      // 能耗类型为气
      gasDataList = [
        // {value: 'dagp_name', key: '分组名称', width: '260px', fixed: true},
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'gach_starttime', key: '日期', width: '160px'},
        {value: 'gach_val_s', key: '起始表底值(Nm³)', width: '160px'},
        // {value: 'gach_endtime', key: '结束日期', width: '160px'},
        {value: 'gach_val_e', key: '结束表底值(Nm³)', width: '160px'},
        {value: 'gach_val', key: '用气量(Nm³)', width: '160px'},
      ]

      switch (this.entpCode) {
        case this.$config.elecCode:
          this.fieldList = elecDataList
          break
        case this.$config.waterCode:
          this.fieldList = waterDataList
          break
        case this.$config.gasCode:
          this.fieldList = gasDataList
          break
        case this.$config.hotCode:
          this.fieldList = hotDataList
          break
        case this.$config.coldCode:
          this.fieldList = coldDataList
          break
      }
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data, type) {
      // 点击不同数据的时候, 页数初始化
      if (JSON.stringify(this.treeInfo.clickData) !== JSON.stringify(data)) {
        this.listInfo.initCurPage = true
      }
      // 得到当前点击的数据
      this.treeInfo.clickData = data
      // TODO: 双击刷新表格(现在还是使用单击)
      if (type === 'double') {
        this.getList('search')
      }
      // 初始化，获取到所有数据后请求列表
      if (this.listInfo.pageInit) {
        this.getList('search')
        this.listInfo.pageInit = false
      }
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
      let query = this.listInfo.query,
          data = this.treeInfo.clickData
      query.entp_code = this.entpCode
      query.proj_id = this.projectInfo.proj_id
      query.dagd_id = query.dimension

      switch (query.date_type) {
      case 'year':
        query.dateType = 3
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY')
        break
      case 'month':
        query.dateType = 2
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY-MM')
        break
      case 'day':
        query.dateType = 1
        query.starttime = this.$fn.switchTime(query.starttime, 'YYYY-MM-DD')
        break
      }

      // 当前表格显示的数据类型
      this.listInfo.date_type = query.date_type

      // 如果为查询数据, 则使用点击的ID, 分页时用上一次查询时的ID
      if (type === 'search') {
        // 对数据做处理
        if (data.type === 'dimension') {
          query.data = {type: 1, dataid: data.dagd_id}
        } else if (data.type === 'group') {
          query.data = {type: 2, dataid: data.dagp_id}
        } else if (data.type === 'metr') {
          query.data = {type: 3, dataid: data.metr_id}
        }
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
    // 导出excel
    exportExcel () {
      // 过滤器
      if (!this.filterSearch()) {
        return
      }
      this.dealParam()
      let query = this.listInfo.query,
          url = `${this.$fn.getHost()}/api/S0401A/ExportToExcel?proj_id=${query.proj_id}`,
          params = {
            // proj_id: this.projectInfo.proj_id, 
            dagd_id: query.dimension, 
            DateType: query.dateType,
            entp_code: query.entp_code, 
            starttime: query.starttime}
      params['data.dataid'] = query.data.dataid
      params['data.type'] = query.data.type
      for (let key in params) {
        url += '&' + key + '=' + params[key]
      }
      this.$fn.openWindow(url)
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
