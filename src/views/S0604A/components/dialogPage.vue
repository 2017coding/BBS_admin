<template>
  <div class="app-container">
    <!-- <p style="padding-bottom: 10px;">已选中和添加的测点： <span style="color: #f56c6c; padding: 0 3px; font-weight: bold;">{{selectedList.length}}</span>个</p> -->
    <!-- <p style="padding-bottom: 20px; color: #f56c6c;">{{pageStatus === 'addPoit' ? '选中数据将添加到' + listInfo.dataName + '' : '取消选中数据将从' + listInfo.dataName +'中删除'}}</p> -->
    <!-- 查询模块 -->
    <div class="filter-container" v-if="pageStatus === 'addPoit'">
      <div class="filter-item" v-if="dataType === 4">
        <label class="filter-label">监测点:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.metr_id" placeholder="请选择监测点" filterable clearable style="width: 150px">
          <el-option v-for="(item, index) in  listTypeInfo.metrList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item" v-if="dataType === 1 || dataType === 2">
        <label class="filter-label">建筑:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.buildId" placeholder="请选择建筑" filterable clearable style="width: 150px">
          <el-option v-for="(item, index) in  listTypeInfo.buildList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.name" placeholder="请输入名称" clearable style="width: 150px"></el-input>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- 功能模块 -->
    <div class="filter-container">
    </div>
    <!-- 表格 -->
    <el-table 
      ref="table" 
      :data="listInfo.data" 
      border 
      style="width:100%" 
      v-loading="listInfo.loading" 
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        v-if="dataType === item.dataType"
        :prop="item.value" :label="item.key"
        align="center"
        :min-width="item.width || '160px'">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: scope.row[item.value]})}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div v-show="!listInfo.loading" class="pagination-container">
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
// 引入接口
import { getTypeListApi as getListApi } from '@/api/project/S0604A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'dialogPage',
  props: {
    // 选择的列表
    selectedList: {
      type: Array
    },
    // 报警类型
    alsgAlarmtype: {
      type: Number
    },
    // 策略ID
    alsgId: {
      type: Number
    },
    // 页面状态 (查看 | 设置)
    pageStatus: {
      type: String,
      default: 'addPoit'
    },
    // 数据类型
    dataType: {
      type: Number
    },
    // 测点类型
    poitType: {
      type: String
    }
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        key: '', // 选择的ID的字段名
        dataName: '', // 选择的数据名称
        data: [],
        total: 0,
        loading: false,
        pageSizes: [5, 10, 25, 50, 100],
        // 查询条件
        query: {
          curPage: 1,
          pageSize: 5,
          proj_id: '', // 项目ID
          alsg_id: '', // 策略
          alsg_alarmtype: '', // 报警类型
          type: '', // 数据类型 （数据类型:1,设备组；2，采集器组；3，驱动组；4，测点组）
          searchType:  '', // 查询数据（1：查所有测点；2：查已选择的测点，3：查未选择的测点）
          poit_type: '', // 测点类型
          metr_id: '', // 表计ID
          buildId: '', // 建筑ID
          name: '' // 名称
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 表计列表
        metrList: [],
        // 建筑列表
        buildList: []
      },
      // 字段表
      fieldList: [
        {value: 'poit_name', key: '测点名称', dataType: 4, width: '60px'},
        {value: 'poit_type', key: '测点类型', dataType: 4, width: '60px'},
        {value: 'poit_device_id', key: '所属监测点', dataType: 4, list: 'metrList'},
        {value: 'metr_name', key: '设备名称', dataType: 1},
        {value: 'metr_code', key: '设备编码', dataType: 1, width: '140px'},
        {value: 'metr_bubi_id', key: '所属建筑', dataType: 1, list: 'buildList'},
        {value: 'daci_name', key: '采集器名称', dataType: 2},
        {value: 'daci_code', key: '采集器编码', dataType: 2},
        {value: 'daci_bubi_id', key: '所属建筑', dataType: 2, list: 'buildList'},
        {value: 'driv_name', key: '驱动名称', dataType: 3},
        {value: 'driv_code', key: '驱动编码', dataType: 3}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'projectInfo'
    ])
  },
  mounted () {
    // 初始化参数
    let query = this.listInfo.query
    query.proj_id = this.projectInfo.proj_id
    query.alsg_id = this.alsgId
    query.alsg_alarmtype = this.alsgAlarmtype
    query.searchType = this.pageStatus === 'addPoit' ? 3 : 2
    query.poit_type = this.poitType
    query.type = this.dataType
    
    this.initData()
    this.getKey()
    this.initlistTypeInfo()
    this.getList()
  },
  watch: {
    dagp_id () {
      this.listInfo.query.dagp_id = this.dagp_id
      this.getList()
    }
  },
  methods: {
    initData () {
    },
    getKey () {
      let data = this.listInfo
      switch(this.dataType) {
        case 1:
          data.key = 'metr_id'
          data.dataName = '设备组'
          break
        case 2:
          data.key = 'daci_id'
          data.dataName = '采集器组'
          break
        case 3:
          data.key = 'driv_id'
          data.dataName = '驱动组'
          break
        case 4:
          data.key = 'poit_id'
          data.dataName = '测点组'
          break
      }
    },
    // 初始化查询相关数据
    initlistTypeInfo () {
      // 得到所有的表计列表
      this.$api.getMetrApi({projID: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.metrList = response.content.data
        this.listTypeInfo.metrList.forEach(item => {
          item.value = item.metr_id
          item.key = item.metr_name
        })
      })
      .catch(() => {
        console.log('获取表计列表失败')
      })
      // 得到所有的建筑列表
      this.$api.getBuildApi({bubi_proj_id: this.projectInfo.proj_id}).then(response => {
        this.listTypeInfo.buildList = response.content.data
        this.listTypeInfo.buildList.forEach(item => {
          item.value = item.bubi_id
          item.key = item.bubi_name
        })
      })
      .catch(() => {
        console.log('获取建筑列表失败')
      })
    },
    // 树的选择
    cdHandleTreeCheck (val) {
      this.treeInfo.checkedMods = val
    },
    // 得到数据
    getList (type) {
      if (type === 'search') {
        this.listInfo.query.curPage = 1
      }
      this.listInfo.loading = true
      getListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            this.listInfo.data = response.content.data
            this.listInfo.total = response.content.total
            this.listInfo.query.curPage = response.content.curPage
            this.listInfo.query.pageSize = response.content.pageSize

            // 设置当前选中项
            this.selectedList.forEach(selected => {
              let row = this.listInfo.data.find(item => {
                return item[this.listInfo.key] === selected
              })
              this.$nextTick(() => {
                if (!row) return
                this.$refs.table.toggleRowSelection(row, true)
              })
            })
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
    },
    // 选中发生改变
    handleSelectionChange (rows) {
      let selectIds = [], 
          unSelectedIds = [], 
          selectedList = JSON.parse(JSON.stringify(this.selectedList)),
          key = this.listInfo.key
      // 拿到当前列表中未选中的数据
      if (rows.length === 0) {
        unSelectedIds = this.listInfo.data.map(item => {
          return item[key]
        })
      } else {
        this.listInfo.data.forEach(item => {
          let index = 0
          rows.forEach((item1, index1) => {
            if (item1 && item1[key]) {
              // 得到当前选中的ID
              selectIds.push(item1[key])
              // 当列表中的数据在选择的数据中不存在
              if (item[key] !== item1[key]) {
                index++
              }
            }
          })
          // 得到当前未选中的id
          if (index === rows.length) {
            unSelectedIds.push(item[key])
          }
        })
      }
      // 从当期列表中将未选中的元素删除
      unSelectedIds.forEach(item1 => {
        // 判断要删除的数据是否在选择的数据中
        if (selectedList.indexOf(item1) === -1) return
        selectedList.splice(selectedList.indexOf(item1), 1)
      })
      // 合并选中并去重
      selectIds = [...new Set(selectIds.concat(selectedList))]
      this.$emit('update:selectedList', selectIds)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
