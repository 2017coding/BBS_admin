<template>
  <el-tabs v-model="activeName" class="build-chart-panel">
    <el-tab-pane
      v-for="(item, index) in tabList" 
      :key="index" 
      :label="item.label"
      v-loading="loading"
      element-loading-text="数据加载中..."
      :name="item.name">
      <Chart 
        :chartData="item.chartData || {nameList: [], timeList: [], dataList: []}"
        :title="item.title"
        :xUnit="item.xUnit"
        :yUnit="item.yUnit"
        :height="item.height"
        :toolboxShow="item.toolboxShow"
        v-if="activeName === item.name">
      </Chart>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getBuildDataApi } from '@/api/project/S0301A'
import Chart from '@/components/chart/index'
import { mapGetters } from 'vuex'
export default {
  props: {
    buildData: {
      type: Object
    },
    entpCode: {
      type: String
    }
  },
  components: {
    Chart
  },
  data () {
    return {
      activeName: '1',
      loading: false,
      tabList: [
        {
          label: '当日', 
          name: '1', 
          title: '',
          xUnit: '小时',
          yUnit: '电量(kWh)',
          height: '300px',
          chartData: null,
          toolboxShow: false
        },
        {
          label: '本月', 
          name: '2', 
          title: '',
          xUnit: '电量(kWh)',
          xUnit: '日',
          yUnit: '电量(kWh)',
          height: '300px',
          chartData: null,
          toolboxShow: false
        },
        {
          label: '本年', 
          name: '3', 
          title: '',
          xUnit: '月',
          yUnit: '电量(kWh)',
          height: '300px',
          chartData: null,
          toolboxShow: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
    ])
  },
  mounted () {
    this.getBuildData()
  },
  watch: {
    activeName () {
      // 加载过的数据不重复加载
      for (let item of this.tabList) {
        if (item.name === this.activeName && item.chartData) {
          return
        }
      }
      this.getBuildData()
    }
  },
  methods: {
    getBuildData () {
      this.loading = true
      getBuildDataApi ({proj_id: this.projectInfo.proj_id , dateType: this.activeName, dagp_id: this.buildData.dagp_id, entp_code: this.entpCode})
      .then(response => {
        this.loading = false
        if (response.success) {
          let obj = {nameList: [], timeList: [], dataList: []}
          // 处理图表数据
          for (let item of response.content.data) {
            obj.nameList.push(item.date)
            obj.dataList.push(item.datas)
            obj.timeList = item.times
          }
          // 得到对应数据
          for (let item of this.tabList) {
            if (item.name === this.activeName) {
              item.chartData = obj
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: response.message,
            type: 'error',
            duration: 3500
          })
        }
      })
      .catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .build-chart-panel{
    padding-bottom: 10px;
  }
</style>