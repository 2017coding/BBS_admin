export default {
  data () {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        data: [], // 数据
        total: 0, // 总条数
        loading: false, // 加载动画
        pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
        query: { // 查询条件
          curPage: 1,
          pageSize: 10
        }
      }
    }
  },
  methods: {
    // 得到数据
    getList (api) {
      this.listInfo.loading = true
      return new Promise((resolve, reject) => {
        api(this.listInfo.query).then(res => {
          this.listInfo.loading = false
          if (res.success) {
            this.listInfo.data = res.content.data
            this.listInfo.total = res.content.total
            this.listInfo.query.curPage = res.content.curPage
            this.listInfo.query.pageSize = res.content.pageSize
            resolve(res)
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
    // 页面切换
    handleCurrentChange (val) {
      this.listInfo.query.curPage = val // 当前页
      this.getList()
    },
    // 页数改变
    handleSizeChange (val) {
      this.listInfo.query.pageSize = val // 一页几个
      this.getList()
    }
  }
}
