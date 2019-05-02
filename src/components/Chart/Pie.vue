<template>
  <div style="width: 100%;height: 30vh" />
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartPie',
  props: {
    chartData: Object
  },
  data () {
    return {
      chart: null, // Echarts实例
      // 固定的一些颜色
      rgbList: [
        [3, 150, 255],
        [234, 84, 85],
        [115, 103, 240],
        [50, 204, 188],
        [248, 216, 0],
        [159, 68, 211],
        [98, 58, 162],
        [245, 85, 85],
        [140, 27, 171],
        [67, 203, 255]
      ]
    }
  },
  watch: {
    // 监听到数据改变，重新加载echarts数据
    chartData (val) {
      this.removeChart('reset')
      this.initData(val)
    }
  },
  mounted () {
    this.init()
    this.initData(this.chartData)
  },
  beforeDestroy () {
    this.removeChart()
  },
  methods: {
    // 初始化
    init () {
      this.chart = echarts.init(this.$el, 'roma')
      // 监听页面大小改变
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize()
        }
      })
    },
    // 设置数据
    initData (val) {
      // 饼状图
      this.chart.setOption({
        title: [{
          text: '总电量',
          left: '49%',
          top: '40%',
          textAlign: 'center',
          textBaseline: 'middle',
          textStyle: {
            color: '#999',
            fontWeight: 'normal',
            fontSize: 15
          }
        }, {
          text: val.total,
          left: '49%',
          top: '49%',
          textAlign: 'center',
          textBaseline: 'middle',
          textStyle: {
            color: '#666',
            fontWeight: 'normal',
            fontSize: 15
          }
        }],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: val.nameList
        },
        color: this.rgbList.map(item => {
          return 'rgb(' + item.join(',') + ')'
        }),
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: val.dataList
          }
        ]
      })
    },
    // 注销echarts
    removeChart (type) {
      if (!this.chart) {
        return
      }
      this.chart.dispose() // 销毁echarts
      this.chart = null
      if (type === 'reset') {
        this.init()
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
