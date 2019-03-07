<template>
  <div>

    <div id="Mybarcharts" :style="{height:'400px'}"></div>

  </div>
</template>

<script>
  export default {
    name: "bar",
    props: {
      echartoptions: Object
    },
    data () {
      return {
        Option: {
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
              data: this.echartoptions.xAxisdata,
              axisTick: {
                alignWithLabel: true
              },
              triggerEvent: true,
              axisLabel:{
                interval:0,
                rotate:40
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              triggerEvent: true
            }
          ],
          series: [
            {
              name: '能耗量',
              type: 'bar',
              barWidth: '50%',
              data: this.echartoptions.seriesdata
            }
          ]
        }
      }
    },
    watch: {
      echartoptions (val, oldval) {
        let self = this
        this.Option.xAxis[0].data = val.xAxisdata
        this.Option.series[0].data = val.seriesdata
        let myecharts = this.$echarts.init(document.getElementById('Mybarcharts'))
        myecharts.setOption(self.Option)
        myecharts.on('click', function (params) {
          self.$emit('DveiceId',params.data.id)
        })
      }
    },
    mounted () {
      /*let self = this
      let myecharts = this.$echarts.init(document.getElementById('Mybarcharts'))
      myecharts.setOption(self.Option)
      myecharts.on('click', function (params) {
        self.$emit('DveiceId',params.data.id)
      })*/
    }
  }
</script>

<style lang="scss" scoped>

</style>
