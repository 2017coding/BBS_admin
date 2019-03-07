<template>
  <div :style="'height:' + height + '; width: ' + width"></div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'lineChart',
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
        type: Object,
        default: null
      }
    },
    data () {
      return {
        chart: null // Echarts实例
      }
    },
    computed: {
      ...mapGetters([
        'layoutType',
        'sidebar'
      ])
    },
    mounted () {
      this.init()
      this.initData()
    },
    beforeDestroy () {
      this.removeChart()
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
    methods: {
      // 初始化
      init () {
        this.chart = this.$echarts.init(this.$el)
        // 监听页面大小改变
        window.addEventListener('resize', () => {
          if (this.chart) {
            this.chart.resize()
          }
        })
      },
      // 初始化数据
      initData () {
        // if (!this.chartData) return
        // let obj = JSON.parse(JSON.stringify(this.chartData))
        // let arr = []
        // obj.dataList.forEach((item, index) => {
        //   item = {
        //     name: obj.nameList[index],
        //     data: item,
        //     type:'line', 
        //     symbolSize: 5, 
        //     symbol: 'circle', 
        //     itemStyle: {
        //       normal: {
        //         label: {
        //           fontSize: 40,
        //           padding: [90, 0, 0, 0],
        //           color: '#fff',
        //           textStyle: {
        //             baseline: 'top'
        //           }
        //         },
        //         borderWidth: 10
        //       }
        //     }
        //   }
        //   arr.push(item)
        // })
        // obj.dataList = arr
        this.initChart()
      },
      // 初始化echarts
      initChart (chartData) {
        this.chart.setOption({
          color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
    //title: {
    //    text: '报警次数'
    //},
    tooltip: {
        trigger: 'axis',
        //formatter: "{b} <br> 合格率: {c}%"
    },
    legend: {
        data: ['负荷', '用能']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7']
    },
    yAxis: [
      {
        type: 'value',
        name: '负荷',
      },
      {
        type: 'value',
        name: '用能',
      }
    ],
    series: [{
            name: '负荷',
            type: 'line',
            stack: '总量',
            symbolSize: 5, 
            symbol: 'circle',
            itemStyle: {
              label: {
                fontSize: 40,
                padding: [90, 0, 0, 0],
                color: '#fff',
                textStyle: {
                  baseline: 'top'
                }
              },
              borderWidth: 10,
              normal: {
                color: "#FFCC33"
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '用能',
            type: 'line',
            stack: '总量',
            symbolSize: 5, 
            symbol: 'circle',
            itemStyle: {
              label: {
                fontSize: 40,
                padding: [90, 0, 0, 0],
                color: '#fff',
                textStyle: {
                  baseline: 'top'
                }
              },
              borderWidth: 10,
              normal: {
                color: "#009E67"
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
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

<style scoped>

</style>
