<template>
  <div class="app-container S0604A">
    <!-- 左侧数结构 -->
    <div class="tree">
      <Tree 
        :treeData="treeInfo.data"
        :expandAll="true"
        @cdHandleClickLeft="cdHandleClickLeft">
      </Tree>
    </div>
    <!-- 右侧页面 -->
    <div class="content">
      <component v-if="treeInfo.rowData.id" :is="(treeInfo.baseData.find(item => item.id === treeInfo.rowData.id)).component"></component>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/tree/index'
import AlarmGroup from './components/alarmGroup'
import AlarmStrategy from './components/alarmStrategy'

// 引入接口
import { getListApi } from '@/api/project/S0503A'

export default {
  name: 'S0604A',
  components: {
    Tree,
    AlarmGroup,
    AlarmStrategy
  },
  data () {
    return {
      // 树状数据
      treeInfo: {
        baseData: [],
        data: [],
        rowData: {}
      }
    }
  },
  computed: {
  },
  mounted () {
    this.initData()
    this.getList()
  },
  watch: {
  },
  methods: {
    // 得到树状数据
    initData () {
      let arr = [
        {id: 1, pid: -1, name: '告警设置'},
        {id: 2, pid: 1, name: '报警组管理', component: 'AlarmGroup'},
        {id: 3, pid: 1, name: '报警策略管理', component: 'AlarmStrategy'},
        // {id: 4, pid: 1, name: '能耗告警', component: 'Page3'},
        // {id: 5, pid: 1, name: '回路告警', component: 'Page4'},
        // {id: 4, pid: 1, name: '参数告警', type: 3},
      ],
      arr1 = []

      // 处理得到树状数据
      arr1 = this.$fn.getTreeArr({key: 'id', pKey: 'pid', rootPValue: -1, data: arr})
      this.treeInfo.baseData = arr
      this.treeInfo.data = arr1
    },
    // 树状组件左键点击的处理
    cdHandleClickLeft (data) {
      if (data.id > 1) {
        this.treeInfo.rowData = data
      }
      // 获取表格数据
      this.getList()
    },
    // 得到数据
    getList () {
      return
      this.listInfo.loading = true
      getListApi(this.listInfo.query)
        .then(response => {
          this.listInfo.loading = false
          if (response.success) {
            this.listInfo.data = response.content.data
            this.listInfo.total = response.content.total
            // this.listInfo.query.curPage = response.content.curPage
            // this.listInfo.query.pageSize = response.content.pageSize
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
    // 按钮的点击
    handleClickBt (type, row) {
      switch (type) {
      case 'set':
        break
      case 'more':
        this.setting[row].more = !this.setting[row].more
        break
      case 'addItem':
        let obj = {
          build_type: '',
          max: '',
          min: ''
        }
        this.batchParameter.push(obj)
        this.setting.three.list.push(1)
        break
      case 'delect':
        if (!this.setting.three.list[row]) return
        this.batchParameter.splice(row, 1)
        this.setting.three.list.splice(row, 1)
        break
      default:
      }
    },
    // 确认的事件处理
    handleConfirm (type) {
      // 添加和编辑的事件处理
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleApi(type, this.form)
            .then(response => {
              this.dialogInfo.show = false
              if (response.success) {
              } else {
              }
            })
            .catch(() => {
              this.dialogInfo.show = false
            })
        }
      })
    },
    // 删除的事件处理
    handleDelete (row) {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/common/style/mixin.scss';

  .S0604A{
    position: relative;
    .tree{
      position: absolute;
      margin: 20px 0 10px 10px;
      left: 0;
      top: 0;
      bottom: 0;
      border: 1px solid rgb(200, 200, 200)
    }
    .content{
      height: 100%;
      margin-left: 260px;
      overflow: auto;
      .children-content{
        position: relative;
        .one-item{
          padding: 5px 0;
        }
        .collapse-item{
          position: relative;
          .left{
            float: left;
            width: 220px;
            border: 1px solid rgb(200, 200, 200)
          }
          .right{
            padding: 0 10px;
            float: left;
          }
        }
      }
    }
  }
</style>
