<template>
  <div class="boxboxbox" @click="handleBuildInfo">
    <ul class="panpel" :style="'border: 1px solid' + theme">
      <li class="title">{{buildData ? buildData.dagp_name : '建筑'}}</li>
      <div class="content" v-for="(item, index) in list" :key="index">
        <li class="data-name">{{item.name}}</li>
        <li class="data-value" :style="'color' + theme">{{item.value}}</li>
      </div>
    </ul>
    <!-- 弹窗 -->
    <el-dialog :title="buildInfo.title" :visible.sync="buildInfo.show" append-to-body>
      <BuildChart v-if="buildInfo.show" :buildData="buildInfo.data" :entpCode="entpCode"></BuildChart>
    </el-dialog>
  </div>
</template>

<script>
import BuildChart from './buildChart'
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
    BuildChart
  },
  data () {
    return {
      list: [
        {name: '本年用电量(kWh)', value: '--', key: 'year'},
        {name: '本月用电量(kWh)', value: '--', key: 'month'},
        {name: '当日用电量(kWh)', value: '--', key: 'day'}
      ],
      buildInfo: {
        title: '',
        show: false,
        data: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme'
    ])
  },
  mounted () {
    this.getData()
  },
  watch: {
    buildData () {
      this.getData()
    }
  },
  methods: {
    // 匹配得到对应的数据
    getData () {
      if (!this.buildData) {
        return
      }
      for (let item of this.list) {
        for (let key in this.buildData) {
          if (item.key === key) {
            item.value = this.buildData[key]
          }
        }
      }
    },
    handleBuildInfo () {
      this.buildInfo.title = this.buildData.dagp_name
      this.buildInfo.show = true
      this.buildInfo.data = this.buildData
    }
  }
}
</script>

<style lang="scss" scoped>
  .boxboxbox{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    width: 240px;
    cursor: pointer;
    .panpel{
      width: 100%;
      height: 100%;
      text-align: center;
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .title{
      font-size: 30px;
      color: rgb(10, 20, 30);
    }
    .data-name{
      font-size: 16px;
      color: rgb(100, 100, 100);
    }
    .data-value{
      font-size: 16px;
    }
    .title, .data-name, .data-value{
      padding: 8px;
    }
  }
  .panpel:hover{
    box-shadow: 0 0 10px rgb(100, 100, 100)  inset;
    transition: all .3s;
    border: 1px solid rgb(245, 247, 250)!important;
    background: rgb(245, 247, 250);
  }
</style>
