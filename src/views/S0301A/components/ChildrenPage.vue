<template>
  <div class="page-children">
    <div class="header">
      <!-- 能耗类型数据 -->
      <div class="entpInfo" v-loading="loading" element-loading-text="数据加载中...">
        <div class="title" :style="'background:' + theme">用{{entpName}}情况</div>
        <ul class="entpList">
          <li class="item-header"
            :style="'border-bottom: solid 1px' + theme + '; color: ' + theme">
            <p class="time"></p>
            <p class="total">总用{{entpName}}量({{entpUnit}})</p>
            <p class="sameratio">同比</p>
            <p class="ringratio">环比</p>
          </li>
          <li 
            class="item-content"
            :style="'border-bottom: dashed 1px' + theme"
            v-for="(item, index) in listInfo.data" 
            :key="index">
            <p class="time">{{item.time}}</p>
            <p class="total">{{item.total}}</p>
            <p class="sameratio">{{item.sameratio}}%<img v-if="(typeof item.sameratio === 'number') && item.sameratio !== 0" :src="item.sameratio > 0 ? arrowsUp : arrowsDown "></p>
            <p class="ringratio">{{item.ringratio}}%<img v-if="(typeof item.ringratio === 'number') && item.ringratio !== 0" :src="item.ringratio > 0 ? arrowsUp : arrowsDown "></p>
          </li>
        </ul>
      </div>
      <!-- 面板 -->
      <div class="panel-box" v-loading="loading" element-loading-text="数据加载中...">
        <Panel 
          v-for="(item, index) in buildDataList"
          :key="index"
          :entpCode="entpCode"
          :buildData="item">
        </Panel>
      </div>
    </div>
    <!-- 图表列表 -->
    <template v-for="(item, index) in chartList">
      <div
        class="chart-box"
        :key="index"
        v-if="!item.entpCode || (entpCode === item.entpCode)"
        v-loading="loading" 
        element-loading-text="数据加载中...">
        <Chart
          :chartData="item.chartData || {nameList: [], timeList: [], dataList: []}"
          :chartType="item.chartType"
          :markPoint="item.markPoint"
          :title="item.title"
          :xUnit="item.xUnit"
          :yUnit="item.yUnit"
          :height="item.height"
          :toolboxShow="item.toolboxShow"
          v-if="tabInfo && tabInfo.activeName === tabInfo.tabName">
        </Chart>
      </div>
    </template>
  </div>
</template>

<script>
import Chart from '@/components/chart/index'
import Panel from './panel'
import arrowsDown from '@/assets/image/arrows_down.png'
import arrowsUp from '@/assets/image/arrows_up.png'
// 引入接口
import { getEntpDataApi } from '@/api/project/S0301A'
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
    Chart,
    Panel
  },
  data () {
    return {
      entpName: '能',
      entpUnit: 'unit',
      arrowsDown: arrowsDown,
      arrowsUp: arrowsUp,
      loading: false,
      // 数据
      listInfo: {
        data: [
          {time: '年', total: '--', sameratio: '-', ringratio: '--'},
          {time: '月', total: '--', sameratio: '-', ringratio: '--'},
          {time: '日', total: '--', sameratio: '-', ringratio: '--'}
        ],
        loading: false
      },
      // 建筑数据
      buildDataList: [],
      // 汇总Echarts数据
      chartList: []
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo',
      'theme'
    ])
  },
  created () {
    this.getEntp()
  },
  mounted () {
    this.getEntpData()
  },
  watch: {
    'listInfo.data' (val) {
      if (!val || val.length === 0) {
        val = [
          {time: '年', total: '--', sameratio: '-', ringratio: '--'},
          {time: '月', total: '--', sameratio: '-', ringratio: '--'},
          {time: '日', total: '--', sameratio: '-', ringratio: '--'}
        ]
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
              key++
            }
          })
        }
      })
      .catch(() => {
        console.log('获取维度类型失败')
      })
    },
    // 根据能耗编码得到当前能耗类型
    getEntp () {
      let entpName = '能', entpUnit = 'unit', arr = []
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
      arr = [
        // 用电相关图表配置
        {
          entpCode: this.$config.elecCode,
          dataType: 'load',
          title: '负荷分析',
          xUnit: '时间',
          yUnit: '功率(kW)',
          height: '300px',
          chartData: null,
          toolboxShow: true,
          markPoint: true
        },
        // 公共图表
        {
          dataType: 'day7',
          title: '近7天总用电分析',
          xUnit: '小时',
          yUnit: '电量(kWh)',
          height: '300px',
          chartData: null,
          toolboxShow: true
        },
        {
          dataType: 'monthData',
          chartType: 'bar',
          title: '本月总用电分析',
          xUnit: '日',
          yUnit: '电量(kWh)',
          chartData: null,
          toolboxShow: true
        },
        {
          dataType: 'yearData',
          chartType: 'bar',
          title: '本年总用电分析',
          xUnit: '月',
          yUnit: '电量(kWh)',
          height: '300px',
          chartData: null,
          toolboxShow: true
        }
      ]
      // 对数据的标题和单位显示做处理
      for (let item of arr) {
        item.title = item.title.replace(/用.*?分/, '用' + entpName + '分')
        // 不为负荷的图表单位修改
        if (item.dataType !== 'load') {
          item.yUnit = entpName + '量' + '(' + entpUnit + ')'
        }
      }

      this.entpUnit = entpUnit
      this.entpName = entpName
      this.chartList = arr
    },
    // 得到数据
    getEntpData () {
      this.loading = true
      getEntpDataApi ({proj_id: this.projectInfo.proj_id, entp_code: this.entpCode}).then(response => {
        this.loading = false
        if (response.success) {
          let data = response.content.data,
              load = {nameList: [], timeList: [], dataList: []},
              day7 = {nameList: [], timeList: [], dataList: []},
              monthData = {nameList: [], timeList: [], dataList: []},
              yearData = {nameList: [], timeList: [], dataList: []},
              arr = [
                {key: 'load', value: load},
                {key: 'day7', value: day7},
                {key: 'monthData', value: monthData},
                {key: 'yearData', value: yearData}
              ]

          // 如果data为空对象， 则不往下执行
          if (!data.gridData) return

          // 数据赋值 (将数据中大于一万的转换为以万为单位)
          this.listInfo.data = data.gridData.map(item => {
            if (item.total > 10000 || item.total < -10000) {
              item.total = (item.total / 10000).toFixed(2) + '万'
            }

            return item
          }).reverse()
          this.buildDataList = data.groupData.map(item => {
            for (let key in item) {
              if (typeof item[key] === 'number' && (item[key] > 10000 || item[key] < -10000)) {
                item[key] = (item[key] / 10000).toFixed(2) + '万'
              }
            }

            return item
          })
          
          // 数据处理
          for (let item of arr) {
            // 处理图表数据
            for (let item1 of data[item.key]) {
              item.value['nameList'].push(item1.date)
              item.value['dataList'].push(item1.datas)
              item.value['timeList'] = item1.times
            }
            // 得到对应数据
            for (let item2 of this.chartList) {
              if (item2.dataType === item.key) {
                item2.chartData = item.value
              }
            }
          }
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
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-children{
    position: relative;
    height: 100%;
    overflow-x: hidden;
    .chart-box{
      margin: 20px 30px;
      padding: 10px;
      box-shadow: 0 0 10px rgb(200, 200, 200);
      border-radius: 10px;
    }
    .header{
      display: flex;
      position: relative;
      margin: 20px 30px;
      .entpInfo{
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 440px;
        min-height: 278px;
        // max-width: 50%;
        box-shadow: 0 0 10px rgb(200, 200, 200);
        border-radius: 10px;
        overflow: hidden;
        transition: all .3s;
        .title{
          height: 50px;
          font-size: 20px;
          color: rgb(248, 248, 248);
        }
        .entpList{
          flex: 1;
          display: flex;
          flex-direction: column;
          .item-header{
            flex: 5;
            font-weight: bold;
            font-size: 18px;
          }
          .item-content{
            flex: 4;
          }
          .item-content:hover{
            background: #f5f7fa;
          }
          .item-header, .item-content{
            display: flex;
            .time{
              width: 50px;
            }
            .total{
              flex: 5;
            }
            .sameratio, .ringratio{
              flex: 2;
              img{
                height: 20px;
              }
            }
            .time, .total, .sameratio, .ringratio{
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          }
        }
        .title, .entpList{
          padding: 15px;
        }
      }
      .panel-box{
        margin-left: 20px; 
        margin-top: 5px; 
        box-shadow: 0 0 10px rgb(200, 200, 200);
        border-radius: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        transition: all .3s;
      }
    }
  }
</style>
 