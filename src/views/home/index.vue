<template>
  <div class="app-container">
    <panel-group></panel-group>
    <div class="charts" v-for="(item, index) in chartList" :key="index">
      <line-or-bar
        :chartData="item.chartData || {nameList: [], xList: [], dataList: []}"
        :chartType="item.chartType"
        :markPoint="item.markPoint"
        :title="item.title"
        :xUnit="item.xUnit"
        :yUnit="item.yUnit"
        :height="item.height"
        :toolboxShow="item.toolboxShow || false">
      </line-or-bar>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineOrBar from '@/components/Chart/LineOrBar'

export default {
  components: {
    PanelGroup,
    LineOrBar
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
              arr[index].push(Math.floor(Math.random() * (max - min + 1) + min))
            }
          })
          return arr
        }
      this.chartList = [
        {
          title: '近七天用户在线分析',
          height: '300px',
          chartType: 'line',
          chartData: {
            nameList: ['3/1', '3/2', '3/3', '3/4', '3/5', '3/6', '3/7'],
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
