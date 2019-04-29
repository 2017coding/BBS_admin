<template>
  <div class="app-container">
    <panel-group />
    <div
      v-for="(item, index) in chartList"
      :key="index"
      class="charts"
    >
      <component
        :is="'chart-' + item.chartType"
        v-loading="loading"
        :chart-data="item.chartData || {nameList: [], xList: [], dataList: []}"
        :mark-point="item.markPoint"
        :title="item.title"
        :x-unit="item.xUnit"
        :y-unit="item.yUnit"
        :height="item.height"
        :toolbox-show="item.toolboxShow || false"
      />
    </div>
  </div>
</template>

<script>
import { userLoginAnalyzeApi } from '@/api/charts'
import PanelGroup from './components/PanelGroup'
import Line from '@/components/Chart/Line'
import Bar from '@/components/Chart/Bar'

export default {
  components: {
    PanelGroup,
    'chart-line': Line,
    'chart-bar': Bar
  },
  data () {
    return {
      loading: false,
      chartList: [
        {
          dataType: 'loginAnalyze',
          title: '近七天用户登录分析',
          height: '100%',
          chartType: 'line',
          xUnit: '小时',
          yUnit: '次',
          chartData: {
            nameList: [],
            xList: [],
            dataList: []
          }
        }
        // {
        //   title: '本年注册用户分析',
        //   height: '300px',
        //   chartType: 'bar',
        //   chartData: {
        //     nameList: ['今年年', '去年'],
        //     xList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        //     dataList: [[11, 23, 34], [23, 46, 11, 55, 3, 22, 44, 66, 13, 89, 99, 101]]
        //   }
        // }
      ]
    }
  },
  mounted () {
    this.getCharts()
  },
  methods: {
    getCharts () {
      this.loading = true
      userLoginAnalyzeApi({ days: 7 }).then(res => {
        this.loading = false
        if (res.success) {
          const data = res.content
          this.chartList.forEach(item => {
            if (item.dataType === 'loginAnalyze') {
              item.chartData = {
                nameList: data.daysList,
                xList: data.timeList,
                dataList: data.dataList
              }
            }
          })
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container{
    display: flex;
    flex-direction: column;
    .charts{
      flex: 1;
      margin-bottom: 20px;
      padding: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
      border-color: rgba(0, 0, 0, .05);
    }
  }
</style>
