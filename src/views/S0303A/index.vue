<template>
  <div class="app-container S0303A">
    <!-- 查询参数 -->
    <div class="search-container" :style="'border-left: 5px solid' + theme">
      <p class="title">查询参数</p>
      <div class="search-item">
        <div class="filter-container" style="padding: 0">
          <div class="filter-item">
            <label class="filter-label">设备名称:</label>
            <el-input class="filter-item filter-input" size="mini" placeholder="设备名称"></el-input>
          </div>
          <div class="filter-item filter-item_left">
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" v-waves>搜索</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 设备数据展示 -->
    <div class="data-show">
      <div class="item" v-for="(item, index) in dataList" :key="index">
        <img src="./image/deviceUse.svg" alt="图标" class="icon item-style">
        <span class="desc item-style">{{item.desc}}</span>
        <span class="data item-style" :style="'color:' + colorList[index % 6]">{{item.data}}</span>
        <span class="unit item-style">{{item.unit}}</span>
        <span class="time item-style" :style="item.time ? '' : 'visibility: hidden;'">{{'发生于: ' + item.time}}</span>
      </div>
    </div>
    <!-- 图表综合分析 -->
    <div class="data-analyze">
      <p class="title">足迹综合分析</p>
      <!-- 仪表图分析 -->
      <div class="instrument">
        <div class="legend-list" style="height: 50px;">
          <p class="legend-item" style="color: rgb(51, 204, 255);">— 昨日(上月)同期</p>
          <p class="legend-item" style="color: rgb(0, 255, 153);">— 今日(本月)</p>
          <p class="legend-item" style="color: rgb(255, 100, 0);">— 最近7日平均</p>
          <p class="legend-item" style="color: rgb(255, 51, 204);">— 预测</p>
        </div>
        <div class="chart-list">
          <Instrument :title="'上一小时'" :width="'33%'"></Instrument>
          <Instrument :title="'当日'" :width="'33%'"></Instrument>
          <Instrument :title="'当月'" :width="'33%'"></Instrument>
        </div>
      </div>
      <!-- 折线图分析 -->
      <div class="line">
        <LineChart></LineChart>
      </div>
      <!-- 饼图分析 -->
      <div class="pie">
        <div class="item" v-for="(item, index) in pieList" :key="index">
          <p class="title">{{item.title}}</p>
          <PieChart></PieChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入组件
import Instrument from './components/instrument'
import LineChart from './components/lineChart'
import PieChart from './components/pieChart'

export default {
  name: 'S0303A',
  components: {
    Instrument,
    LineChart,
    PieChart
  },
  data () {
    return {
      // 基本数据参数
      colorList: [
        'rgb(0, 255, 0)',
        'rgb(255, 255, 0)',
        'rgb(255, 51, 102)',
        'rgb(255, 122, 204)',
        'rgb(51, 204, 255)',
        'rgb(151, 24, 25)'
      ],
      dataList: [
        {
          desc: '当前单位时间最多能量',
          data: 0,
          unit: 'kWh',
          time: '12:15',
        },
        {
          desc: '当前单位时间最大负荷',
          data: 0,
          unit: 'kWh',
          time: '12:15'
        },
        {
          desc: '当前尖时段用能总量',
          data: 0,
          unit: 'kWh',
          time: ''
        },
        {
          desc: '当前峰时段用能总量',
          data: 0,
          unit: 'kWh',
          time: ''
        },
        {
          desc: '当前平时段用能总量',
          data: 0,
          unit: 'kWh',
          time: ''
        },
        {
          desc: '当前谷时段用能总量',
          data: 0,
          unit: 'kWh',
          time: ''
        }
      ],
      // 饼状图数据参数
      pieList: [
        {title: '上月计划用电量'},
        {title: '上月实际用电量'},
        {title: '用电量足迹分析'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'theme'
    ])
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import '@/common/style/mixin.scss';
  @import '@/common/style/base.scss';

  $background: rgb(240, 240, 240);
  $color: rgb(100, 100, 100);

  .S0303A{
    // 搜索模块
    .search-container{
      display: flex;
      padding: 10px;
      padding-left: 15px;
      @include center();
      background: $background;
      border-radius: 0 5px 5px 0;
      .title{
        flex: 1;
        font-size: 16px;
        font-weight: bold;
        color: $color;
      }
    }
    // 基本数据模块
    .data-show{
      display: flex;
      justify-content: space-around;
      @include shadow();
      .item{
        display: flex;
        @include center('horizontal', true);
        .item-style{
          padding: 5px 0;
        }
        .icon{
          width: 50px;
          height: 50px;
        }
        .data{
          font-size: 32px;
          font-weight: bold;
        }
      }
    }
    // 数据分析模块
    .data-analyze{
      .title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-weight: bold;
        color: $color;
        background: $background;
        border-radius: 5px;
      }
      .instrument, .line, .pie{
        margin: 10px 0;
        padding: 10px 0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgb(200 , 200, 200);
      }
      .instrument{
        .legend-list, .chart-list{
          display: flex;
        }
        .legend-list{
          padding-left: 20px;
          @include center();
          .legend-item{
            padding: 0 10px;
          }
        }
      }
      .line{

      }
      .pie{
        display: flex;
        .item{
          width: 33.3%;
          padding: 0 10px;
        }
      }
    }
  }
</style>
