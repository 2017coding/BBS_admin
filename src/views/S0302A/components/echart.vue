<template>
  <div class="charts">

    <div id="Mylinecharts" :style="{height:'400px'}"></div>

  </div>
</template>

<script>
  export default {
    name: "echart",
    props: {
      echartoptions: Object
    },
    data () {
      return {
        lineOption: {
          title: {
            text: '电量',
            subtext: '单位: kWh'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.echartoptions.xAxisData
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            },
            axisPointer: {
              snap: true
            }
          },
          visualMap: {
            show: false,
            dimension: 0,
            pieces: [
              {
                lte: 6,
                color: 'green'
              }, {
                gt: 6,
                lte: 8,
                color: 'green'
              }, {
                gt: 8,
                lte: 14,
                color: 'green'
              }, {
                gt: 14,
                lte: 17,
                color: 'green'
              }, {
                gt: 17,
                color: 'green'
              }]
          },
          series: [
            {
              name: '用电量',
              type: 'line',
              smooth: true,
              data: this.echartoptions.seriesData
            }
          ]
        }
      }
    },
    watch: {
      echartoptions (val, oldval) {
        this.lineOption.xAxis.data = val.xAxisData
        this.lineOption.series[0].data = val.seriesData
        let self = this
        let myecharts = this.$echarts.init(document.getElementById('Mylinecharts'))
        myecharts.setOption(self.lineOption)
      }
    },
    mounted () {
      let self = this
      let myecharts = this.$echarts.init(document.getElementById('Mylinecharts'))
      myecharts.setOption(self.lineOption)
    }
  }
</script>

<style scoped>

</style>
