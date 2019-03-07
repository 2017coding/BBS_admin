<template>
  <div id="Mypiecharts"></div>
</template>

<script>
  export default {
    name: "index_pie",
    props: {
      pieechartoptions: Array
    },
    data () {
      return {
        pieOption: {
          title: {
            text: '分时用电占比',
            subtext: '单位: kWh',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: ['尖', '峰', '平', '谷']
          },
          series: [
            {
              name: '尖峰平谷电量图',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.pieechartoptions
            }
          ]
        }
      }
    },
    watch: {
      pieechartoptions (val, oldval) {
        this.pieOption.series[0].data = val
        let self = this
        let myecharts = this.$echarts.init(document.getElementById('Mypiecharts'))
        myecharts.setOption(self.pieOption)
      }
    },
    mounted () {
      let self = this
      let myecharts = this.$echarts.init(document.getElementById('Mypiecharts'))
      myecharts.setOption(self.pieOption)
    }
  }
</script>

<style lang="scss" scoped>
  #Mypiecharts {
    width: 50%;
    height: 500px;
  }
</style>
