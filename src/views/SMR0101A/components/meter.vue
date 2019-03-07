<template>
  <div class="meter-box">
    <p class="code" :style="'color:' + theme">{{$fn.useWhichData(data, 'metr_no', '')}}</p>
    <div class="box" :style="'background:' + theme" @dblclick="getMeterData()">
      <el-checkbox class="checkbox" v-if="data && checked" v-model="data.checked"></el-checkbox>
      <i :class="getStyle(data) + ' icon-status'"></i>
      <p class="data disabled-select" 
        :style="`color:${data.status ? 'rgb(245, 108, 108)' : 'rgb(103, 194, 58)'}`">{{$fn.useWhichData(data, 'r0P1', '0')}}</p>
    </div>
    <p class="title" :style="'color:' + theme">{{$fn.useWhichData(data, 'metr_name', '')}}</p>

    <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header" :visible.sync="dialogInfo.show" append-to-body>
      <p class="header">
        <span>
          <span class="label">电表编号：</span>
          <span class="code" :style="'color:' + theme">{{$fn.useWhichData(data, 'metr_no', '')}}</span>
        </span>
        <span style="padding-left: 20px;">
          <span class="label">电表名称：</span>
          <span class="name" :style="'color:' + theme">{{$fn.useWhichData(data, 'metr_name', '')}}</span>
        </span>
        <i :class="getStyle(data)" style="margin: 0 10px;"></i>
        <!-- <span>最新采集时间: {{$fn.switchTime(new Date(), 'YYYY-MM-DD hh:mm:ss')}}<i :class="getStyle(data)" style="margin: 0 10px;"></i></span> -->
      </p>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabList" 
          :key="index"
          :label="item.label"
          v-loading="loading"
          element-loading-text="数据加载中..."
          :name="index + ''">
          <MeterTable :dataType="item.name" v-if="tabShowList[index]" :meterData="data"></MeterTable>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import MeterTable from './metrtTable'
  import {mapGetters} from 'vuex'
  export default {
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    components: {
      MeterTable
    },
    data () {
      return {
        activeName: '',
        tabShowList: [],
        loading: false,
        tabList: [
          {
            label: '实时参数', 
            name: 'elec',
            load: false
          },
          {
            label: '告警历史', 
            name: 'alarm',
            load: false
          },
          {
            label: '租户详情', 
            name: 'tenant',
            load: false
          },
        ],
        // 弹窗相关
        dialogInfo: {
          header: '',
          status: '',
          show: false
        }
      }
    },
    computed: {
      ...mapGetters([
        'theme'
      ])
    },
    mounted () {
    },
    watch: {
      'data.status' (val) {
        this.$emit('update:data', this.data)
      },
      'dialogInfo.show' (val) {
        if (!val) {
          this.activeName = ''
          this.tabShowList = []
        } else {
          this.activeName = '0'
        }
      },
      activeName (val) {
        // 让组件有一个懒加载
        this.tabShowList[+val] = true
      }
    },
    methods: {
      getStyle (data) {
        return data.status === 0 ? 'status open' : 'status close'
      },
      getMeterData () {
        this.dialogInfo.header = '详细信息'
        this.dialogInfo.show = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .meter-box .code,
  .meter-box .title,
  .meter-box  .box .data,
  .el-dialog .code,
  .el-dialog .name{
    font-weight: bold;
    text-align: center;
  }
  .meter-box{
    margin: 10px;
    max-width: calc(25% - 20px);
    width: calc(16.666% - 20px);
    min-width: 140px;
    .box{
      position: relative;
      margin: 5px 0;
      height: 0;
      padding-top: 42.5%;
      border-radius: 7px;
      .checkbox{
        position: absolute;
        top: 6px; 
        left: 6px;
      }
      .icon-status{
        position: absolute;
        top: 6px; 
        right: 6px;
      }
      .data{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: default;
      }
    }
  }
  .status{
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .open{
    background: rgb(103, 194, 58);
    box-shadow: rgb(103, 194, 58) 0px 0px 10px;
  }
  .close{
    background: rgb(245, 108, 108);
    box-shadow: rgb(245, 108, 108) 0px 0px 10px;
  }
  .el-dialog{
    .header{
      // display: flex;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid rgb(230, 230, 230);
      .label{
        font-size: 12px;
      }
    }
  }
  .el-tabs{
    margin: 20px 0;
  }
  .el-checkbox{
    color: rgb(103, 194, 58)!important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: rgb(103, 194, 58)!important;
    border-color: rgb(103, 194, 58)!important;
  }
</style>