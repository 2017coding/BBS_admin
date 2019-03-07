<template>
  <div class="app-container">
  <div class="filter-container">
    <div class="filter-item">
      <label class="filter-label">建筑:</label>
      <el-select v-model.trim="listInfo.query.value" clearable placeholder="请选择建筑名称">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="filter-item filter-item_left">
      <label class="filter-label">时间:</label>
      <el-date-picker
        v-model="datatime"
        type="month"
        placeholder="请选择月"
        >
      </el-date-picker></div>
    <div class="filter-item filter-item_left">
      <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
    </div>
  </div>
    <div>
      <div class="content-Tool-result architecture">
        <div class="title-h2" style="padding-left:0;">
          <h2>运营水平</h2>
        </div>
        <table class="rate-table epert-table">
          <tbody>
          <tr>
            <td>建筑掉线次数<span id="notInCount">{{operational_level.time}}次</span></td>
            <td>累计掉线天数<span id="notIn">{{operational_level.numberdays}}天</span></td>
            <td>系统平均修复时间<span id="avgDay">{{operational_level.repair_time}}天</span></td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="expert-name">
                <img src="./img/zhendun.png" alt="">
                <p>专家意见</p>
              </div>
              <div class="expert-detali">
                {{operational_level.expert_opinion}}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="title-h2" style="padding-left:0;">
          <h2>数据诊断</h2>
        </div>
        <table class="rate-table epert-table">
          <tbody>
          <tr>
            <td>异常数据处理次数<span id="exceptionCount">{{data_dumps.Processing_times}}次</span></td>
            <td>异常数据处理次数占比<span id="exceptionPower">{{data_dumps.Duty_Ratio}}</span></td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="expert-name">
                <img src="./img/zhendun.png" alt="">
                <p>专家意见</p>
              </div>
              <div class="expert-detali">
                <p>&nbsp;</p>
                <p id="option3">{{data_dumps.expert_opinion}}</p>
                <p>&nbsp;</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="title-h2" style="padding-left:0;">
          <h2>能耗诊断</h2>
        </div>
        <table class="rate-table epert-table">
          <tbody>
          <tr>
            <td colspan="2">建筑能耗指标<span id="average">{{Energy_diagnosis.EUI}}</span></td>
            <td colspan="2">能耗排名<span id="ranking">第{{Energy_diagnosis.Energy_Ranking}}名</span></td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="expert-name">
                <img src="./img/zhendun.png" alt="">
                <p>专家意见</p>
              </div>
              <div class="expert-detali">
                <p>&nbsp;</p>
                <p id="opinion">{{Energy_diagnosis.expert_opinion1}}</p>
                <p>&nbsp;</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width:25px;">照明插座<span id="lighting">{{Energy_diagnosis.lighting_socket}}</span></td>
            <td style="width:25px;">空调用电<span id="air">{{Energy_diagnosis.Air_conditioning}}</span></td>
            <td style="width:25px;">动力用电<span id="power">{{Energy_diagnosis.Power_electricity}}</span></td>
            <td style="width:25px;">特殊用电<span id="special">{{Energy_diagnosis.Special_power}}</span></td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="expert-name">
                <img src="./img/zhendun.png" alt="">
                <p>专家意见</p>
              </div>
              <div class="expert-detali">
                <p>&nbsp;</p>
                <p id="opinion2">{{Energy_diagnosis.expert_opinion2}}</p>
                <p>&nbsp;</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script>
  // 引入接口
  import {getListApi} from '@/api/project/S0307A'
  // 时间转换
   


  export default {
    data() {
      return {
        operational_level:{
          time:'',
          numberdays:'',
          repair_time:'',
          expert_opinion:''
        },
        data_dumps:{
          Processing_times:'',
          Duty_Ratio:'',
          expert_opinion:''

        },
        Energy_diagnosis:{
          EUI:'',
          Energy_Ranking:'',
          expert_opinion1:'',
          lighting_socket:'',
          Air_conditioning:'',
          Power_electricity:'',
          Special_power:'',
          expert_opinion2:''

        },
        datatime:'',
        options: [{
          value:  0,
          label: '荆楚理工学院'
        }, {
          value:  1,
          label: '楚天学校'
        }, {
          value:  2,
          label: '龙泉中学北校'
        }, {
          value:  3,
          label: '外语学校高中部'
        }, {
          value:  4,
          label: '一医南院住院部门诊楼'
        }],
        listInfo:{
          query:{
            value: '',
            valuetime:''
          }
        }
      }
    },
    methods:{
      getlist(){
      this.listInfo.query.valuetime=this.$fn.switchTime(this.datatime,"YYYY-MM")
      getListApi(this.listInfo.query).then(res=>{
        let data=res.content
        if (res.success){
          this.operational_level=data.operational_level  // 运营水平
          this.data_dumps=data.data_dumps  // 数据诊断
          this.Energy_diagnosis=data.Energy_diagnosis  // 能耗诊断
        }
      })

      }
    }
  }
</script>

<style scoped>
  .architecture {
    margin: 0 20px;
  }
  .content-Tool-result {
    /* width: 1258px; */
   /* min-width: 1258px;
    min-height: 500px;*/
    margin: 0 0 13px;
  }
  .title-h2 {
    padding: 16px 0 36px 20px;
    height: 20px;
    line-height: 20px;
    position: relative;
  }
  .title-h2 h2 {
    padding-left: 10px;
    font-size: 16px;
    border-left: 5px solid #3786e2;
    color: #323232;
    margin: 0;
    font-weight: bold;
    display: inline-block;
  }
  table.rate-table {
    width: 100%;
    margin: 0;
    font-size: 14px;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }
  table.rate-table td:first-child {
    border-left: 0;
  }
  table.rate-table td {
    height: 48px;
    font-size: 15px;
    text-align: left;
    color: #414141;
    border: 1px solid #b5b9c0;
    padding: 0 22px;
    width: 33.33%;
    vertical-align: middle;
  }
  .epert-table td {
    border: 1px solid #b5b9c0 !important;
  }
  table.rate-table td span {
    color: #3786e2;
    float: right;
  }
  table.rate-table td span {
    color: #3786e2;
    float: right;
  }
  table.rate-table td span {
    color: #3786e2;
    float: right;
  }
  .expert-name {
    width: 110px;
    height: 60px;
    display: inline-block;
    float: left;
    text-align: center;
    padding: 2px 20px 20px 0;
  }
  img {
    vertical-align: middle;
  }
  .expert-detali {
    min-height: 70px;
    display: inline-block;
    padding: 20px 40px;
    border-left: 1px solid #b5b9c0;
  }

</style>
