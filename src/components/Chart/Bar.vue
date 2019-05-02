<template>
  <div :style="'height:' + height + '; width: ' + width" />
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'

export default {
  name: 'ChartBar',
  props: {
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Object
    },
    // 图表位置
    gridTop: {
      type: String,
      default: '25%'
    },
    gridLeft: {
      type: String,
      default: '3%'
    },
    gridRight: {
      type: String,
      default: '5%'
    },
    gridBottom: {
      type: String,
      default: '13%'
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    titleFSize: {
      type: Number,
      default: 16
    },
    // 单位
    xUnit: {
      type: String,
      default: ''
    },
    yUnit: {
      type: String,
      default: ''
    },
    // 图标的位置
    legendOrient: {
      type: String,
      default: 'horizontal'
    },
    legendX: {
      type: String,
      default: 'center'
    },
    legendY: {
      type: String,
      default: 'bottom'
    },
    // 功能列表显示
    toolboxShow: {
      type: Boolean,
      default: true
    },
    // 最值显示
    markPoint: {
      type: Boolean,
      default: false
    }
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
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  watch: {
    // 监听到数据改变，重新加载echarts数据
    chartData (val) {
      this.removeChart('reset')
      this.initData()
    },
    // 左侧菜单变化触发
    'sidebar.opened' () {
      setTimeout(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 300)
    }
  },
  mounted () {
    this.init()
    this.initData()
  },
  beforeDestroy () {
    this.removeChart()
  },
  methods: {
    // 初始化
    init () {
      this.chart = echarts.init(this.$el)
      // 监听页面大小改变
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize()
        }
      })
    },
    // 初始化数据
    initData () {
      if (!this.chartData) return
      const obj = JSON.parse(JSON.stringify(this.chartData)); const arr = []
      obj.dataList.forEach((item, index) => {
        // 随机的颜色和特定的颜色
        const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
        const rgbList = this.rgbList
        const color = rgbList[index] || rgb
        // 对echarts数据做处理
        item = {
          name: obj.nameList[index],
          data: item,
          type: 'bar',
          symbolSize: 5,
          symbol: 'circle',
          // areaStyle: {}, // 设置是否按区域显示
          smooth: true, // 设置线条光滑
          itemStyle: {
            normal: {
              label: {
                fontSize: 40,
                padding: [90, 0, 0, 0],
                color: '#fff',
                textStyle: {
                  baseline: 'top'
                }
              },
              color: 'rgb(' + color.join(',') + ')',
              borderColor: 'rgba(' + color.join(',') + ', .5)',
              borderWidth: 0
            }
          }
        }
        // 根据参数判断是否显示最值
        if (this.markPoint) {
          item.markPoint = {
            label: { show: true },
            data: [
              { type: 'max', name: '最大值', label: '最大值' },
              { type: 'min', name: '最小值', label: '最小值' }
            ]
          }
          item.markLine = {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
        arr.push(item)
      })
      obj.dataList = arr
      this.initChart(obj)
    },
    // 初始化echarts
    initChart (chartData) {
      this.chart.setOption({
        title: {
          text: this.title,
          textStyle: {
            fontSize: this.titleFSize
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'red'
            }
          }
        },
        // 设置图例的位置
        legend: {
          orient: this.legendOrient, // 'horizontal', // 'vertical'
          y: this.legendY,
          x: this.legendX,
          data: chartData.nameList
        },
        // // 加上这个属性，鼠标经过显示最值
        // tooltip: {
        //   trigger: 'axis', // 鼠标经过时显示当前列数据
        // },
        // 更多选项的设置
        toolbox: {
          show: this.toolboxShow,
          feature: {
            dataView: { show: true, readOnly: false },
            // magicType: {show: true, type: ['line', 'bar']},
            // restore: {show: true},
            saveAsImage: { show: true }
          }
        },
        grid: {
          top: this.gridTop,
          left: this.gridLeft,
          right: this.gridRight,
          bottom: this.gridBottom,
          containLabel: true
        },
        xAxis: {
          name: this.xUnit,
          type: 'category',
          boundaryGap: true, // 两边是否留白
          data: chartData.xList,
          axisTick: { show: false }, // 坐标刻度显示
          nameTextStyle: {
            fontSize: 12
          }
        },
        yAxis: {
          name: this.yUnit,
          type: 'value',
          nameTextStyle: {
            fontSize: 12
          }
        },
        series: chartData.dataList
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

<style scoped>

</style>
