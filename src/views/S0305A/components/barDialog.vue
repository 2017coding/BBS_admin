<template>
  <div>

    <div id="MybarchartsS" :style="{height:'400px'}"></div>

  </div>
</template>

<script>
  export default {
    name: "bar",
    props: {
      echartoptionsS: Object
    },
    data () {
      return {
        OptionS: {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.echartoptionsS.xAxisdata,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                interval:0,
                rotate:40
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '能耗量',
              type: 'bar',
              barWidth: '50%',
              data: this.echartoptionsS.seriesdata
            }
          ]
        }
      }
    },
    watch: {
      echartoptionsS (val, oldval) {
        let self = this
        this.OptionS.xAxis[0].data = val.xAxisdata
        this.OptionS.series[0].data = val.seriesdata
        let myechartsS = this.$echarts.init(document.getElementById('MybarchartsS'))
        myechartsS.setOption(self.OptionS)
        /*myecharts.on('click', function (params) {
          self.$emit('DveiceId',params.data.id)
        })*/
      }
    },
    mounted () {
      /*let self = this
      let myecharts = this.$echarts.init(document.getElementById('Mybarcharts'))
      myecharts.setOption(self.OptionS)*/
    }
  }
</script>

<style lang="scss" scoped>

</style>
