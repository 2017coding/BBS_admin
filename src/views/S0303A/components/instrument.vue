<template>
  <div :style="'height:' + height + '; width: ' + width"></div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'instrument',
    props: {
      height: {
        type: String,
        default: '400px'
      },
      width: {
        type: String,
        default: '100%'
      },
      title: {
        type: String,
        default: ''
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
          tooltip : {
              formatter: "{a} <br/>{c} {b}"
          },
          title: {
            x: "center",
            top: 0,
            text: this.title,
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                color: "#00A5A0"
            }
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              min: 0,
              max: 1000,
              detail: {formatter:'{value}%', show: false},
              itemStyle: {
                normal: {
                  color: "rgb(25, 55, 25)"
                }
              },
              data: [{value: 1000}]
            },
            {
              name: '业务指标',
              type: 'gauge',
              min: 0,
              max: 1000,
              // pointer: {
              //   width:2
              // },
              detail: {formatter:'{value}%', show: false},
              data: [{value: 20}]
            },
            {
              name: '业务指标',
              type: 'gauge',
              min: 0,
              max: 1000,
              detail: {formatter:'{value}%', show:false},
              data: [{value: 800}]
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
