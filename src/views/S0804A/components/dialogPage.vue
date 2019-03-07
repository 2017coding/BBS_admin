<template>
  <div class="app-container">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
        <label class="filter-label">建筑:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.bubi_id" placeholder="请选择建筑" filterable clearable style="width: 150px">
          <el-option v-for="(item, index) in  listTypeInfo.buildList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
        <label class="filter-label">是否总表:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.metr_intake" placeholder="请选择" filterable clearable style="width: 100px">
          <el-option v-for="(item, index) in  listTypeInfo.isList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
        <label class="filter-label">是否虚拟表:</label>
        <el-select class="filter-item filter-input" v-model="listInfo.query.metr_virtual" placeholder="请选择" filterable clearable style="width: 100px">
          <el-option v-for="(item, index) in  listTypeInfo.isList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <label class="filter-label">关键字:</label>
        <el-input 
          class="filter-item filter-input" 
          v-model.trim="listInfo.query.keyword" 
          :placeholder="`请输入${projectInfo.proj_code === $config.PROJCODE_ZJ ? '表号/名称/代码' : '代码/名称'}`" 
          clearable 
          :style="`width: ${projectInfo.proj_code === $config.PROJCODE_ZJ ? '240px' : '160px'}`">
        </el-input>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
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
      <el-table-column prop="bubi_name" label="建筑名称" align="center" min-width="160px" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
      </el-table-column>
      <el-table-column prop="metr_no" label="表号" align="center" min-width="160px" v-if="projectInfo.proj_code === $config.PROJCODE_ZJ">
      </el-table-column>
      <el-table-column prop="metr_code" label="表计代码" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="metr_name" label="表计名称" align="center" min-width="200px">
      </el-table-column>
      <el-table-column prop="metr_intake" label="是否总表" align="center" min-width="100px" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo.isList, value: 'value', label: 'key', data: scope.row.metr_intake})}}
        </template>
      </el-table-column>
      <el-table-column prop="metr_virtual" label="是否虚拟表" align="center" min-width="100px" v-if="projectInfo.proj_code !== $config.PROJCODE_ZJ">
        <template slot-scope="scope">
          {{$fn.getDataName({dataList: listTypeInfo.isList, value: 'value', label: 'key', data: scope.row.metr_virtual})}}
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
import { getGroupMeterListApi as getListApi } from '@/api/project/S0804A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'dialogPage',
  props: {
    selectedList: {
      type: Array
    },
    dagp_id: {
      type: Number
    },
    entp_id: {
      type: Number
    }
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        data: [],
        total: 0,
        loading: false,
        pageSizes: [5, 10, 25, 50, 100],
        // 查询条件
        query: {
          curPage: 1,
          pageSize: 5,
          entp_id: '',
          proj_id: '', // 项目ID
          bubi_id: '', // 建筑
          dagp_id: '', // 分组
          metr_intake: '', // 总表
          metr_virtual: '', // 虚拟表
          keyword: '' // 关键字
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
        // 建筑列表
        buildList: [],
        // 是否列表
        isList: [
          {value:  0, key: '否'},
          {value:  1, key: '是'}
        ],
        // 状态
        statusList: [
          {value:  0, key: '停用'},
          {value:  1, key: '启用'}
        ]
      }
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
    this.listInfo.query.proj_id = this.projectInfo.proj_id
    this.listInfo.query.dagp_id = this.dagp_id
    this.listInfo.query.entp_id = this.entp_id
    
    this.initData()
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
    // 初始化查询相关数据
    initlistTypeInfo () {
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
    getList () {
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
                return item.metr_id === selected
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
          selectedList = JSON.parse(JSON.stringify(this.selectedList))
      // 拿到当前列表中未选中的数据
      if (rows.length === 0) {
        unSelectedIds = this.listInfo.data.map(item => {
          return item.metr_id
        })
      } else {
        this.listInfo.data.forEach(item => {
          let index = 0
          rows.forEach((item1, index1) => {
            if (item1 && item1.metr_id) {
              // 得到当前选中的ID
              selectIds.push(item1.metr_id)
              // 当列表中的数据在选择的数据中不存在
              if (item.metr_id !== item1.metr_id) {
                index++
              }
            }
          })
          // 得到当前未选中的id
          if (index === rows.length) {
            unSelectedIds.push(item.metr_id)
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
