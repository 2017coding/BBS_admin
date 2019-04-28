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
      chartList: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let arr = () => {
          let arr = []
          for (let i = 0, len = 24; i < len; i++) {
            arr.push(i > 9 ? i + ':00' : '0' + i + ':00')
          }
          return arr
        },
        data = () => {
          let arr = [[], [], [], [], [], [], []]
          arr.forEach((item, index) => {
            for (let i = 0, len = 24; i < len; i++) {
              let max = 10, min = 1
              arr[index].push(Math.round(Math.random() * (max - min + 1) + min))
            }
          })
          return arr
        }
      this.chartList = [
        {
          title: '近七天用户登录统计',
          height: '300px',
          chartType: 'line',
          chartData: {
            nameList: ['4/5', '4/6', '4/7', '4/8', '4/9', '4/10', '4/11'],
            xList: arr(),
            dataList: data()
          }
        },
        {
          title: '本年注册用户分析',
          height: '300px',
          chartType: 'bar',
          chartData: {
            nameList: ['今年年', '去年'],
            xList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dataList: [[11, 23, 34], [23, 46, 11, 55, 3, 22, 44, 66, 13, 89, 99, 101]]
          }
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .app-container{
    display: flex;
    flex-direction: column;
    .charts{
      margin-bottom: 20px;
      padding: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
      border-color: rgba(0, 0, 0, .05);
    }
  }
</style>
