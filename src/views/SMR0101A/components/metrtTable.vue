<template>
  <div class="meter-table">
    <!-- 显示表格 -->
    <el-table ref="table" max-height="400" :data="this.listInfo.data[dataType]" border style="width:100%" v-loading="listInfo.loading">
      <el-table-column 
        v-for="(item, index) in fieldList[dataType]"
        v-if="!item.type || item.type === 'three'"
        :key="index" 
        :prop="item.value" 
        :label="item.key"
        :fixed="item.fixed"
        align="center" 
        :min-width="item.width || '100px'">
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div v-show="!listInfo.loading" class="pagination-container" v-if="dataType !== 'elec'">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listInfo.query.curPage"
        :page-sizes="listInfo.pageSizes"
        :page-size="listInfo.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="listInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getAlarmListApi, getTeneListApi } from '@/api/project/SMR0101A'
  export default {
    props: {
      meterData: {
        type: Object,
        default: () => {
          return 
        }
      },
      dataType: {
        type: String,
        default: 'elec'
      }
    },
    data () {
      return {
        listInfo: {
          data: {
            elec: [],
            tenant: [],
            alarm: []
          },
          total: 0,
          loading: false,
          pageSizes: this.$config.PAGESIZES,
          query: {
            proj_id: '',
            metr_id: '',
            curPage: 1,
            pageSize: 5
          }
        },
        // 页面相关的列表类型
        listTypeInfo: {
          // 报警类型
          alarmTypeList: [
            {value:  0, key: 'AI越限报警 '},
            {value:  1, key: 'DI变位报警'},
            {value:  2, key: '设备报警'},
            {value:  3, key: '采集器报警'},
            {value:  4, key: '驱动报警'},
            {value:  5, key: '能耗告警'}
          ]
        },
        fieldList: {
          elec: [],
          tenant: [],
          alarm: []
        }
      }
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    created () {
    },
    mounted () {
      this.listInfo.query.proj_id = this.projectInfo.proj_id
      this.listInfo.query.metr_id = this.meterData.metr_id
      this.initField()
      this.getList()
    },
    watch: {
      'dataType' () {
        this.listInfo.query.curPage = 1
      }
    },
    methods: {
      initField () {
        this.fieldList = {
          elec: [
            {value: 'name', key: '', width: '50px'},
            {value: 'U', key: '电压', width: '100px'},
            {value: 'I', key: '电流', width: '100px'},
            {value: 'p', key: '有功功率', width: '100px'},
            {value: 'q', key: '无功功率', width: '100px'},
            {value: 's', key: '视在功率', width: '100px'},
            {value: 'cos', key: '功率因素', width: '100px'},
            {value: 'hz', key: '频率', width: '100px'}
          ],
          tenant: [
            {value: 'masp_no', key: '铺号', width: '100px'},
            {value: 'temt_name', key: '租户名称', width: '100px'},
            // {value: 'spmt_splitrate', key: '分摊比例', width: '80px'},
            {value: 'tetr_starttime', key: '开始时间', width: '160px'},
            {value: 'tetr_startreading', key: '读数', width: '100px'},
            {value: 'tetr_endtime', key: '结束时间', width: '160px'},
            {value: 'tetr_endreading', key: '读数', width: '100px'},
          ],
          alarm: [
            {value: 'alrm_type_name', key: '告警类型', width: '100px'},
            {value: 'alrm_desc', key: '告警内容', width: '400px'},
            {value: 'alrm_time', key: '告警时间', width: '160px'}
          ]
        }
      },
      getList () {
        let list = this.listInfo.data,
            dataType = this.dataType,
            meterData = this.meterData
            // 不存在的用'-'显示
            for(let key in meterData) {
              if (key !== 'status') {
                meterData[key] = meterData[key] || '-'
              }
            }
        switch (dataType) {
          case 'elec':
            if (meterData.metr_type === '单相') {
              list[dataType] = [
                {name: '', U: meterData.ua, I: meterData.ia, p: meterData.p, q: meterData.q, s: meterData.s, cos: meterData.cos, hz: meterData.hz}
              ]
            } else {
              list[dataType] = [
                {name: 'A', U: meterData.ua, I: meterData.ia, p: '-', q: '-', s: '-', cos: '-', hz: '-'},
                {name: 'B', U: meterData.ub, I: meterData.ib, p: '-', q: '-', s: '-', cos: '-', hz: '-'},
                {name: 'C', U: meterData.uc, I: meterData.ic, p: '-', q: '-', s: '-', cos: '-', hz: '-'},
                {name: '', U: meterData.u, I: meterData.i, p: meterData.p, q: meterData.q, s: meterData.s, cos: meterData.cos, hz: meterData.hz},
              ]
            }
            break
          case 'tenant':
          case 'alarm':
            let api = dataType === 'tenant' ? getTeneListApi : getAlarmListApi
            this.listInfo.loading = true
            api(this.listInfo.query).then(response => {
              this.listInfo.loading = false
              if (response.success) {
                list[dataType] = response.content.data.map(item => {
                  item.alrm_type_name = this.$fn.getDataName({dataList: this.listTypeInfo.alarmTypeList, value: 'value', label: 'key', data: item.alrm_type})
                  return item
                })
                this.listInfo.total = response.content.total
                this.listInfo.query.curPage = response.content.curPage
                this.listInfo.query.pageSize = response.content.pageSize
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
              this.listInfo.loading = false
            })
            break
        }
      },
      // 页面切换
      handleCurrentChange (val) {
        this.listInfo.query.curPage = val // 当前页
        this.getList()
      },
      // 页数改变
      handleSizeChange (val) {
        this.listInfo.query.pageSize = val  // 一页几个
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>