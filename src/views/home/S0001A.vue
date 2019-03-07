<template>
  <div class="home">
    <!-- 待处理 -->
    <div class="information-list list">
      <div class="item" v-for="(item, index) in information" :key="index">
        <Information :data="item" :dataList="item.list"></Information>
      </div>
    </div>
    <!-- 图表 -->
    <div class="chart-list list">
      <div class="item" v-for="(item, index) in chartsData" :key="index">
        <Chart
          :width="'100%'"
          :height="'100%'"
          :chartData="item.chartData || {nameList: [], timeList: [], dataList: []}"
          :chartType="item.chartType"
          :markPoint="item.markPoint"
          :title="item.title"
          :titleFSize="item.titleFSize"
          :xUnit="item.xUnit"
          :yUnit="item.yUnit"
          :gridTop="item.gridTop"
          :gridBottom="item.gridBottom"
          :toolboxShow="item.toolboxShow">
        </Chart>
      </div>
    </div>
    <!-- 快捷方式 -->
    <div class="shortcut-list list">
      <div class="item" v-for="(item, index) in shortcut" :key="index">
        <Shortcut :data="item" :dataList="item.list"></Shortcut>
      </div>
    </div>
  </div>
</template>

<script>
  import Information from './components/information'
  import Chart from '@/components/chart'
  import Shortcut from './components/shortcut'
  import { mapGetters } from 'vuex'
  import { GetToDoListApi, getNoConfirmListApi, GetTenementEnergyChartApi, GetTTenementShopChartApi, GetShortcutApi } from '@/api/project/SMR0001A'
  export default {
    components: {
      Information,
      Chart,
      Shortcut
    },
    data () {
      return {
        /*列表相关*/
        listInfo: {
          data: [],
          total: 0,
          loading: false,
          pageSizes: this.$config.PAGESIZES,
          /*查询相关*/
          query: {
            curPage: 1,
            pageSize: 10,
            proj_id: '',
            alrm_confirm: 0 // 未处理的报警数据
          }
        },
        listTypeInfo: {
          // 报警类型
          alarmTypeList: [
            {value:  0, key: 'AI越限报警 '},
            {value:  1, key: 'DI变位报警'},
            {value:  2, key: '设备报警'},
            {value:  3, key: '采集器报警'},
            {value:  4, key: '驱动报警'},
            {value:  5, key: '能耗告警'}
          ],
        },
        information: [
          {
            title: '待办事项',
            type: 'event',
            path: '/S08/SMR0202A',
            list: []
          },
          {
            title: '报警信息',
            path: '/S06/S0601A',
            type: 'alarm',
            list: []
          }
        ],
        chartsData: [{}, {}],
        shortcut: [
          {
            title: '功能导航',
            type: 'func',
            list: []
          },
          {
            title: '报表导航',
            type: 'table',
            list: []
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
      this.listInfo.query.proj_id = this.projectInfo.proj_id
      this.getlist('alarm')
      this.getlist('event')
      this.getChartData('tenant')
      this.getChartData('masp')
      this.getShortcut()
    },
    methods: {
      // 获取列表数据
      getlist (type) {
        let api, index
        if (type === 'alarm') {
          api = getNoConfirmListApi
          index = 1
        } else {
          api = GetToDoListApi
          index = 0
        }
        api({proj_id: this.projectInfo.proj_id, topN: 20}).then(response => {
          if (response.success) {
            response.content.data.forEach(item => {
              item.message = item.title || item.alrm_desc
              item.time = this.$fn.switchTime(item.time || item.alrm_time, 'YYYY-MM-DD hh:mm:ss')
              item.type = this.$fn.getDataName({dataList: this.listTypeInfo.alarmTypeList, value: 'value', label: 'key', data: item.alrm_type})
              return item
            })
            // 通过set方法设置数据
            this.$set(this.information[index], 'list', response.content.data)
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
        })
      },
      // 获取到echarts数据
      getChartData (type) {
        let api, index
        if (type === 'tenant') {
          api = GetTenementEnergyChartApi
          index = 0
        } else {
          api = GetTTenementShopChartApi
          index = 1
        }
        api({proj_id: this.projectInfo.proj_id}).then(response => {
          if (response.success) {
            for (let key in response.content.data) {
              response.content.data[key] = response.content.data[key] || undefined
            }
            // 通过set方法设置数据
            this.$set(this.chartsData, index, response.content.data)
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      },
      // 获取快捷方式数据
      getShortcut () {
        GetShortcutApi ({proj_id: this.projectInfo.proj_id}).then(response => {
          if (response.success) {
            // 通过set方法设置数据
            this.$set(this.shortcut[0], 'list', response.content.data.ds)
            this.$set(this.shortcut[1], 'list', response.content.data.ds1)
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home{
    padding: 7px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .list{
      display: flex;
      flex: 1;
    }
    .information-list, .chart-list, .shortcut-list{
      .item{
        margin: 5px;
        padding: 10px;
        flex: 1;
        border-radius: 3px;
        box-shadow: 0 0 7px rgb(200, 200, 200);
      }
    }
    .information-list {
      .item{
        width: 50%;
        overflow: hidden;
      }
      .item:last-child{
        // flex: 2;
      }
    }
  }
</style>
