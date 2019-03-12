<template>
  <div class="page-table">
      <!-- 显示表格 -->
      <el-table ref="table" :max-height="listInfo.tableHeight || undefined" :data="listInfo.data" border style="width:100%" v-loading="listInfo.loading">
        <el-table-column align="center" label="序号" :width="fieldList.length === 0 ? '' : 80" fixed v-if="index">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.value"
          :label="item.key"
          :fixed="item.fixed"
          align="center"
          :width="item.width"
          :min-width="item.minwidth || '100px'">
          <template v-if="item.children">
            <el-table-column
              v-for="(childItem, childIndex) in item.children"
              :key="childIndex"
              :prop="childItem.value"
              :label="childItem.key"
              align="center"
              :width="item.width"
              :min-width="item.minwidth || '85px'">
            </el-table-column>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <template>
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
      </template>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    // 是否显示序号
    index: {
      type: Boolean,
      default: true
    },
    // 表格数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作栏配置
    handle: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 列表相关
    listInfo: {
      type: Object,
      default: () => {
        return {query: {}}
      }
    }
  },
  mounted () {
    // 得到表格的高度
    this.listInfo.tableHeight = this.getTableHeight()
    // 监听页面大小改变
    window.addEventListener('resize', () => {
      // 得到表格的高度
      this.listInfo.tableHeight = this.getTableHeight()
    })
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    // 根据页面的头部, 功能框, 分页组件等高度，计算出table的高度
    getTableHeight () {
      // 当表格存在的时候才执行操作
      if (document.getElementsByClassName('el-table').length === 0) {
        return
      }
      let boxH = document.body.clientHeight,
        navH = document.getElementsByClassName('navbar-container')[0].clientHeight,
        tagH = document.getElementsByClassName('tags-view-container')[0].clientHeight,
        searchH = document.getElementsByClassName('page-filter')[0].clientHeight,
        pagerH = document.getElementsByClassName('pagination-container')[0] || {clientHeight: 0},
        bottomH = pagerH.clientHeight ? pagerH.clientHeight + 15 : pagerH.clientHeight - 35,
        tab = document.getElementsByClassName('el-table')[0] || {offsetTop: 0},
        tabOffT = tab.offsetTop

      // 表格的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - 分页组件的高度100 - 分页组件
      document.getElementsByClassName('el-table')[0].style.height = (boxH - tabOffT - navH - tagH - searchH - bottomH) + 'px'
      console.log('表格最大高度为:' + (boxH - navH - tagH - searchH - bottomH))
      return (boxH - navH - tagH - searchH - bottomH)
    }
  }
}
</script>

<style scoped>
</style>
