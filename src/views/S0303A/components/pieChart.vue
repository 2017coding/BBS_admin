<template>
  <div :style="'height:' + height + '; width: ' + width">
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'pieChart',
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
    data() {
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
    mounted() {
      this.init()
      this.initData()
    },
    beforeDestroy() {
      this.removeChart()
    },
    watch: {
      // 监听到数据改变，重新加载echarts数据
      chartData(val) {
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
      init() {
        this.chart = this.$echarts.init(this.$el)
        // 监听页面大小改变
        window.addEventListener('resize', () => {
          if (this.chart) {
            this.chart.resize()
          }
        })
      },
      // 初始化数据
      initData() {
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
      initChart(chartData) {
        var dataStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)',
          }
        }
        var placeHolderStyle = {
          normal: {
            color: 'rgba(44,59,70,1)', //未完成的圆环的颜色
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            color: 'rgba(44,59,70,1)' //未完成的圆环的颜色
          }
        }
        this.chart.setOption({
          title: {
            text: '75%',
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              color: "#0bb6f0",
              fontSize: 40
            }
          },
          color: ['#eb644b', '#313443', '#fff'],
          tooltip: {
            show: false,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            show: false,
            itemGap: 12,
            data: ['01', '02']
          },
          toolbox: {
            show: false,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          series: [{
              name: 'Line 1',
              type: 'pie',
              clockWise: false,
              radius: [125, 130],
              itemStyle: dataStyle,
              hoverAnimation: false,
              data: [{
                  value: 75,
                  name: '01'
                }, {
                  value: 25,
                  name: 'invisible',
                  itemStyle: placeHolderStyle
                }
              ]
            }
          ]
        })
      },
      // 注销echarts
      removeChart(type) {
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
