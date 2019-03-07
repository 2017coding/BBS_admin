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
            <label class="filter-label">时间:</label>
            <el-date-picker
              class="filter-item filter-date"
              v-model="listInfo.query.starttime"
              type="date"
              :picker-options="datePickerOptions"
              :clearable="false"
              format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <!-- <div class="filter-item filter-item_left">
            <label class="filter-label">结束时间:</label>
            <el-date-picker
              class="filter-item filter-date"
              v-model="listInfo.query.endtime"
              :clearable="false"
              :picker-options="datePickerOptions"
              type="datetime"
              format="yyyy-MM-dd HH"
              placeholder="选择结束时间">
            </el-date-picker>
          </div> -->
          <div class="filter-item filter-item_left">
            <label class="filter-label">关键字:</label>
            <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入监测点编号/名称"></el-input>
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
          :min-width="item.width || '160px'">
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
import { getListApi } from '@/api/project/S0404A'
import { getListApi as getDimensionType } from '@/api/project/S0803A'
export default {
  name: 'childrenPage',
  props: {
    entpId: {
      type: Number,
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
          // 开始时间和结束时间
          starttime: this.$fn.switchTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00',
          keyword: ''
          // endtime : new Date()
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
        dimensionTypeList: []
      },
      // 树组件相关数据
      treeInfo: {
        dialogType: 'add', // 当前右键点击的类型
        eventType: '',
        data: ''
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
    initField () {
      let elecDataList, coldDataList, waterDataList, hotDataList, gasDataList, config, children
      
      // 能耗类型为电
      elecDataList = [
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'metr_rate', key: '变比', width: '100px'},
        {value: 'metertime', key: '采集时间', width: '160px'},
      ]
      config = [
        {unit: 'elic_R0P', key: ''},
        {unit: 'elic_R1P', key: '尖峰'},
        {unit: 'elic_R2P', key: '峰'},
        {unit: 'elic_R3P', key: '平'},
        {unit: 'elic_R4P', key: '谷'}
      ]
      children = ['正向有功总电能', '反向有功总电能', '正向无功总电能', '反向无功总电能']
      for (let i = 0, len = config.length; i < len; i++) {
        let arr = []
        for(let j = 0; j < children.length; j++) {
          let obj = {value: config[i].unit + (j + 1), key: config[i].key + children[j]}
          arr.push(obj)
        }
        elecDataList = elecDataList.concat(arr)
      }

      // 能耗类型为水
      waterDataList = [
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'watr_metertime', key: '采集时间', width: '160px'},
        {value: 'watr_value', key: '水表值', width: '160px'},
        // {value: 'watr_flow', key: '流量', width: '160px'},
        // {value: 'watr_pa', key: '水压', width: '160px'},
        // {value: 'watr_temp', key: '水温', width: '160px'}
      ] 

      // 能耗类型为冷
      coldDataList = [
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'cold_metertime', key: '采集时间', width: '160px'},
        {value: 'cold_value', key: '总制冷量(RT)', width: '160px'},
        // {value: 'cold_flow', key: '累积流量(m³)', width: '160px'},
        {value: 'cold_heat', key: '总制热量(MWh)', width: '160px'},
        // {value: 'cold_rtflow', key: '流速(m³/s)', width: '160px'},
        // {value: 'cold_supplytemp', key: '供水温度(℃)', width: '160px'},
        // {value: 'cold_returntemp', key: '回水温度(℃)', width: '160px'}
      ]

      // 能耗类型为热
      hotDataList = [
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'watr_metertime', key: '采集时间', width: '160px'},
        {value: 'hot_value', key: '热量表示值', width: '160px'},
        // {value: 'hot_inwater', key: '供水温度', width: '160px'},
        // {value: 'hot_out_water', key: '回水温度', width: '160px'},
        // {value: 'hot_temp_diff', key: '温差', width: '160px'},
        // {value: 'hot_instant_flow', key: '瞬时流量', width: '160px'},
        // {value: 'hot_count_flow', key: '累计流量', width: '160px'},
        // {value: 'hot_pa', key: '水压', width: '160px'}
      ]

      // 能耗类型为气
      gasDataList = [
        {value: 'metr_name', key: '监测点名称', width: '260px', fixed: true},
        {value: 'gas_metertime', key: '采集时间', width: '160px'},
        {value: 'gas_value', key: '燃气表示值', width: '160px'},
        // {value: 'gas_flow', key: '流量', width: '160px'},
        // {value: 'gas_pa', key: '压力', width: '160px'},
        // {value: 'gas_density', key: '浓度', width: '160px'}
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
    // 过滤条件
    filterSearch () {
      // 时间不能为空
      if (!this.listInfo.query.starttime) {
        this.$message({
          showClose: true,
          message: '时间不能为空',
          type: 'warning',
          duration: 3500
        })
        return false
      }
      // 结束时间不能大于起始时间
      // if (+this.listInfo.query.starttime > +this.listInfo.query.endtime) {
      //   this.$message({
      //     showClose: true,
      //     message: '开始时间不能大于结束时间',
      //     type: 'warning',
      //     duration: 3500
      //   })
      //   return false
      // }
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

      query.starttime = this.$fn.switchTime(query.starttime)
      // query.endtime = this.$fn.switchTime(query.endtime)

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
          url =  `${this.$fn.getHost()}/api/S0404A/GetExportDataList?proj_id=${query.proj_id}`,
          params = {
            // proj_id: this.projectInfo.proj_id, 
            dagd_id: query.dimension,
            entp_code: query.entp_code, 
            starttime: query.starttime,
            endtime: query.endtime}
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
