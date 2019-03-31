<template>
  <div class="page-table" :class="className">
      <!-- 显示表格 -->
      <el-table
        ref="table"
        :max-height="listInfo.tableHeight || undefined"
        :data="data"
        border
        style="width:100%"
        v-loading="listInfo.loading">
        <!-- <el-table-column align="center" label="序号" :width="fieldList.length === 0 ? '' : 80" fixed v-if="index">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.value"
          :label="item.label"
          :fixed="item.fixed"
          align="center"
          :width="item.width"
          :min-width="item.minWidth || '100px'">
          <template slot-scope="scope">
            <!-- 嵌套表格 -->
            <template v-if="item.children">
              <el-table-column
                v-for="(childItem, childIndex) in item.children"
                :key="childIndex"
                :prop="childItem.value"
                :label="childItem.label"
                align="center"
                :width="item.width"
                :min-width="item.minWidth || '85px'">
              </el-table-column>
            </template>
            <!-- 状态 -->
            <span v-else-if="item.value === 'status'">
              <i
                :class="scope.row.status === 1 ? 'el-icon-check' : 'el-icon-close'"
                :style="{color: scope.row.status === 1 ? '#67c23a' : '#f56c6c', fontSize: '20px'}">
              </i>
            </span>
            <!-- 其他 -->
            <span v-else>
              {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: scope.row[item.value]})}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="handle"
          :fixed="handle.fixed"
          align="center"
          :label="handle.label"
          :width="handle.width"
          :key="'handle'">
          <template slot-scope="scope">
            <template v-for="(item, index) in handle.btList">
              <el-button
                v-if="item.show"
                :key="index"
                size="mini"
                :type="handBtShow('type', item, scope.row)"
                :icon="item.icon"
                v-waves
                @click="handleClickBt(item.event, scope.row)"
                :disabled="item.disabled"
                :loading="scope.row[item.loading]">
                {{handBtShow('label', item, scope.row)}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <template v-if="pager">
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
    // 自定义类名
    className: {
      type: String
    },
    // 刷新
    refresh: {
      type: Boolean
    },
    // 获取数据的接口
    api: {
      type: Function
    },
    // 是否显示序号
    index: {
      type: Boolean,
      default: true
    },
    // 类型列表
    listTypeInfo: {
      type: Object
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
      type: Object
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 重置当前页
    initCurpage: {
      type: Boolean
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表数据
    data: {
      type: Array
    }
  },
  data () {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        total: 0, // 总条数
        loading: false, // 加载动画
        pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
        query: { // 查询条件
          curPage: 1, // 当前页
          pageSize: 10 // 每页条数
        }
      }
    }
  },
  watch: {
    initCurpage () {
      this.listInfo.query.curPage = 1
    },
    refresh () {
      if (!this.api) return
      this.getList(this.api)
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
    // 处理参数
    handleParams () {
      let obj = {}
      for (let key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key]
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? {...this.listInfo.query, ...obj} : obj
    },
    // 处理按钮显示
    handBtShow (type, bt, row) {
      switch (type) {
      case 'type':
        if (bt.event === 'status') {
          return row.status - 1 >= 0 ? 'danger' : 'success'
        } else {
          return bt[type]
        }
      case 'label':
        if (bt.event === 'status') {
          return row.status - 1 >= 0 ? '停用' : '启用'
        } else {
          return bt[type]
        }
      }
    },
    // 得到数据
    getList (api) {
      this.listInfo.loading = true
      return new Promise((resolve, reject) => {
        // 每次调用接口时都自动绑定最新的数据
        api(this.handleParams()).then(res => {
          this.listInfo.loading = false
          if (res.success) {
            // 使外面可以访问到表格数据
            this.$emit('update:data', res.content.result)
            this.listInfo.total = res.content.totals
            this.listInfo.query.curPage = res.content.curPage - 0
            this.listInfo.query.pageSize = res.content.pageSize - 0
            resolve(res)
            this.$emit('handleEvent', 'list', res.content.result)
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
            reject()
          }
        }).catch(() => {
          reject()
          this.listInfo.loading = false
        })
      })
    },
    handleSizeChange (val) {
      this.listInfo.query.pageSize = val // 每页条数
      this.getList(this.api)
    },
    handleCurrentChange (val) {
      this.listInfo.query.curPage = val // 当前页
      this.getList(this.api)
    },
    // 派发按钮点击事件
    handleClickBt (event, data) {
      this.$emit('handleClickBt', event, data)
    },
    // 根据页面的头部, 功能框, 分页组件等高度，计算出table的高度
    getTableHeight () {
      // 当表格存在的时候才执行操作
      if (document.getElementsByClassName('el-table').length === 0) {
        return
      }
      let boxH = document.body.clientHeight,
        navH = document.getElementsByClassName('navbar-container')[0] ? document.getElementsByClassName('navbar-container')[0].clientHeight : 0,
        tagH = document.getElementsByClassName('tags-view-container')[0] ? document.getElementsByClassName('tags-view-container')[0].clientHeight : 0,
        searchH = document.getElementsByClassName('page-filter')[0] ? document.getElementsByClassName('page-filter')[0].clientHeight : 0,
        pagerH = document.getElementsByClassName('pagination-container')[0] || {clientHeight: 0},
        bottomH = pagerH.clientHeight ? pagerH.clientHeight + 40 : pagerH.clientHeight - 35,
        tab = document.getElementsByClassName('el-table')[0] || {offsetTop: 0},
        tabOffT = tab.offsetTop

      // 表格的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - 分页组件的高度100 - 分页组件
      document.getElementsByClassName('el-table')[0].style.height = (boxH - tabOffT - navH - tagH - searchH - bottomH) + 'px'
      // console.log('表格最大高度为:' + (boxH - navH - tagH - searchH - bottomH))
      return (boxH - navH - tagH - searchH - bottomH)
    }
  }
}
</script>

<style scoped>
</style>
