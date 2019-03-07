<template>
  <div class="app-container">
    <!-- 查询模块 -->
    <div class="filter-container">
      <div class="filter-item">
        <label class="filter-label">关键字:</label>
        <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入铺号" clearable style="width: 200px"></el-input>
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
      <el-table-column prop="masp_no" label="铺号" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="masp_desc" label="描述" align="center" min-width="200px">
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
import { getMaspListApi as getListApi } from '@/api/project/SMR0202A'

// 定义提示弹窗初始参数
let MESSAGE, TYPE

export default {
  name: 'dialogPage',
  props: {
    selectedList: {
      type: Array
    },
    selectRows: {
      type: Array
    },
    temt_id: {
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
          proj_id: '', // 项目ID
          temt_id: '', // 租户ID
          keyword: '' // 关键字
        }
      },
      // 页面相关的列表类型
      listTypeInfo: {
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
    this.listInfo.query.temt_id = this.temt_id
    
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
                return item.masp_id === selected
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
          return item.masp_id
        })
      } else {
        this.listInfo.data.forEach(item => {
          let index = 0
          rows.forEach((item1, index1) => {
            if (item1 && item1.masp_id) {
              // 得到当前选中的ID
              selectIds.push(item1.masp_id)
              // 当列表中的数据在选择的数据中不存在
              if (item.masp_id !== item1.masp_id) {
                index++
              }
            }
          })
          // 得到当前未选中的id
          if (index === rows.length) {
            unSelectedIds.push(item.masp_id)
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
      this.$emit('update:selectRows',
        this.$fn.handleRepeatArr({data: [...this.selectRows, ...rows], key: 'masp_id'})
          .filter(item => selectIds.indexOf(item.masp_id) !== -1)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
