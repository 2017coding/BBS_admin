<template>
  <div class="app-container" >
    <div class="shadow">
      <el-form :inline="true" :model="query" :rules="rules" ref="ruleForm">
        <el-form-item prop="dateType" label="显示类型" class="form-item-width">
          <el-select class="filter-item filter-input" v-model="query.dateType" placeholder="请选择显示类型" @change="typeChang">
            <el-option
              v-for="item in date_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="starttime" label="时间" class="form-item-width">
          <el-date-picker
            class="filter-item"
            v-model="query.starttime"
            :type="query.dateType"
            :clearable="false"
            :value-format="valueFormat[query.dateType]"
            :picker-options="pickerOptions"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="electrictype" label="电量类型" class="form-item-width">
          <el-select class="filter-item filter-input" v-model="query.electrictype" placeholder="请选择电量类型">
            <el-option
              v-for="item in batteryType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="metr_id" label="监测点" class="form-item-width">
          <el-select class="filter-item filter-input" v-model.trim="query.metr_id" placeholder="请选择设备">
            <el-option
              v-for="item in deviceList"
              :key="item.metr_id"
              :label="item.metr_name"
              :value="item.metr_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-width">
          <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="filter-container shadow" v-loading="loading">
      <echatrs :echartoptions="lineechartoptions"></echatrs>
    </div>
    <div class="flex shadow" v-loading="loading">
      <index_table :tableData_P="tableData"></index_table>
      <index_pie :pieechartoptions="pieechartoptions"></index_pie>
    </div>


  </div>
</template>

<script>
  import echatrs from './components/echart'
  import index_table from './components/index_table'
  import index_pie from './components/index_pie'
  import {GetDataListApi} from '@/api/project/S0302A'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      echatrs,
      index_table,
      index_pie
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    data () {
      return {
        loading:false,
        formInline: {
          user: '',
          region: ''
        },
        // 查询条件
        query: {
          dateType: 'date', // 显示类型
          starttime: this.$fn.switchTime(new Date(), 'YYYY-MM-DD'),  // 时间
          electrictype: 1, // 电量类型
          metr_id: '', // 关键字
          proj_id: ''  // 项目ID
        },
        // 验证规则
        rules: {
          dateType: [{required: true, message: '请选择显示类型', trigger: 'blur'}],
          starttime: [{required: true, message: '请选择时间', trigger: 'blur'}],
          electrictype: [{required: true, message: '请选择电量类型', trigger: 'change'}],
          metr_id: [{required: true, message: '请输入关键字', trigger: 'blur'}]
        },
        // 显示类型
        date_type: [
          {label: '年', value: 'year'},
          {label: '月', value: 'month'},
          {label: '日', value: 'date'}
        ],
        // 设备列表
        deviceList:[],
        // 当前时间日期选择器特有的选项
        pickerOptions:{
        // 禁用日期通过 disabledDate 设置,这里禁用未来时间
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        // 输出日期类型
        valueFormat: {
          date: 'yyyy-MM-dd',
          month: 'yyyy-MM',
          year: 'yyyy'
        },
        // 电量类型
        batteryType: [
          {
            value: 1,
            label: '正向有功'
          }, {
            value: 2,
            label: '反向有功'
          }, {
            value: 3,
            label: '正向无功'
          }, {
            value: 4,
            label: '反向无功'
          }],
        // 折线统计图数据
        lineechartoptions: {},
        // 表格数据
        tableData: [],
        // 饼状图数据
        pieechartoptions: []
      };
    },
    mounted () {
      this.$api.getMetrApi({projID:this.projectInfo.proj_id}).then(res=>{
        if (res.success) {
          this.deviceList = res.content.data
          this.query.metr_id = this.$fn.useWhichData(this.deviceList[0], 'metr_id', '')
        }
      })
      this.query.proj_id = this.projectInfo.proj_id
    },
    watch: {
      deviceList () {
        this.getList()
      }
    },
    methods: {
      // 得到不同类型的列表
      initlistTypeInfo () {
        // 得到表计列表的数据
        this.$api.getMetrApi({projID:this.projectInfo.proj_id}).then(res=>{
          if (res.success) {
            this.deviceList = res.content.data
            this.query.metr_id = this.$fn.useWhichData(this.deviceList[0], 'metr_id', '')
          }
        })
        .catch(() => {
          console.log('获取表计类型失败')
        })
      },
      getList () {
        this.loading = true
        GetDataListApi(this.query).then(res => {
          if (res.success) {
            this.loading = false
            this.lineechartoptions = Array.isArray(res.content.data.lineData) ? {} : res.content.data.lineData
            this.tableData = res.content.data.tableData
            this.pieechartoptions = res.content.data.pieData
          }
        })
        .catch(() => {
          this.loading = false
        })
      },
      typeChang(val){
        if (val==='date'){
          this.query.starttime=this.$fn.switchTime(new Date(),'YYYY-MM-DD')
        } else if(val==='month'){
          this.query.starttime=this.$fn.switchTime(new Date(),'YYYY-MM')
        }else {
          this.query.starttime=this.$fn.switchTime(new Date(),'YYYY')
        }
      },
    }
  };
</script>

<style scoped>
  .form-item-width {
    width: auto;
    margin-bottom: 0;
    padding: 10px 10px;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .tit {
    font-size: 19px;
    font-weight: bold;
  }

  .flex {
    display: flex;
  }

  .shadow {
    padding: 20px 10px;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 0 10px rgb(200, 200, 200);
  }

</style>
