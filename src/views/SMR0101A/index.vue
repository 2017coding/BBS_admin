<template>
  <div class="app-container MR0101A">
    <div class="left">
      <!-- 左侧数结构 -->
      <div class="tree">
        <Tree
          v-loading="treeInfo.loading"
          :checkBox="true"
          :rightClick="true"
          :treeData="treeInfo.initData"
          @cdHandleTreeCheck="cdHandleTreeCheck"
          @cdHandleRightEvent="cdHandleRightEvent">
        </Tree>
      </div>
    </div>
    <!-- 右侧页面 -->
    <div class="content">
       <!-- 查询模块 -->
      <div class="filter-container">
        <div class="filter-item">
          <el-checkbox v-model="listInfo.query.checked" style="padding-right: 20px">勾选导出</el-checkbox>
          <label class="filter-label">状态:</label>
          <el-select class="filter-item filter-input" v-model="listInfo.query.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in  listTypeInfo.statusList" :key="item.value" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="filter-item filter-item_left">
          <label class="filter-label">关键字:</label>
          <el-input class="filter-item filter-input" v-model.trim="listInfo.query.keyword" placeholder="请输入电表编号/名称"></el-input>
        </div>
        <div class="filter-item filter-item_left">
          <el-button class="filter-item" type="primary" icon="el-icon-search" v-waves @click="getList()">搜索</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" v-waves @click="exportExcel()">导出</el-button>
        </div>
      </div>
      <!-- 页面显示 -->
      <div class="wrap" v-loading="listInfo.loading">
        <Meter :data.sync="item" v-for="(item, index) in listInfo.data" :key="index" :checked="listInfo.query.checked"></Meter>
      </div>
    </div>
  </div>
</template>

<script>
// 引入接口
  import { getListApi, exportToExcelApi } from '@/api/project/SMR0101A'
  import Tree from './components/tree'
  import Meter from './components/meter'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Tree,
      Meter
    },
    data () {
      return {
        listInfo: {
          data: [],
          loading: false,
          query: {
            checked: false,
            status: '',
            keyword: ''
          }
        },
        listTypeInfo: {
          statusList: [
            {key: '正常', value: 0},
            {key: '异常', value: 1}
          ]
        },
        treeInfo: {
          loading: false,
          initData: [],
          checkedData: [],
          clickData: {}
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
      this.getTreeData()
    },
    watch: {
    },
    methods: {
      getTreeData () {
        this.treeInfo.loading = true
        this.$api.GetGroupListApi({proj_id: this.projectInfo.proj_id, dagd_code: 'DIM03'})
          .then(response => {
            this.treeInfo.loading = false
            if (response.success) {
              this.treeInfo.initData = this.$fn.getTreeArr({
                key: 'id', 
                pKey: 'dagp_pid', 
                rootPValue: 0, 
                data: response.content.data.map(item => {
                  item.id = item.dagp_id
                  item.name = item.dagp_name
                  return item
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
            this.treeInfo.loading = false
            console.log('获取数据失败')
          })
      },
      // 过滤条件
      filterSearch () {
        // 选择不能为空
        if (this.treeInfo.checkedData.length === 0) {
          this.$message({
            showClose: true,
            message: '左侧树节点至少勾选一项',
            type: 'warning',
            duration: 3500
          })
          return false
        }
        return true
      },
      getList () {
        // 过滤器
        if (!this.filterSearch()) {
          return
        }
        let query = this.listInfo.query,
            obj = {
              dagp_ids: this.treeInfo.checkedData.join(','),
              status: query.status,
              keyword: query.keyword
            }
        this.listInfo.loading = true
        getListApi(obj).then(response => {
          this.listInfo.loading = false
          this.listInfo.data = []
          if (response.success) {
            this.listInfo.data = response.content.data.map(item => {
              item.checked = false
              return item
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
      cdHandleTreeCheck (data) {
        this.treeInfo.checkedData = data
        this.getList()
      },
      cdHandleRightEvent (type, data) {
        this.handleClickBt(type, data)
      },
      // 按钮的点击
      handleClickBt (type, row) {
        switch (type) {
          case 'refresh':
            this.getTreeData()
            break
        }
      },
      // 导出excel
      exportExcel () {
        // 过滤器
        if (!this.filterSearch()) {
          return
        }
        let query = this.listInfo.query,
            checked = this.listInfo.data.filter(item => {
              return item.checked
            }),
            obj = {
              dagp_ids: this.treeInfo.checkedData.join(','),
              status: query.status,
              keyword: query.keyword,
              metr_ids: checked.map(item => item.metr_id).join(',')
            }
        exportToExcelApi(obj).then(response => {
          if (response) {
            this.$fn.openWindow(`${this.$fn.getHost()}/api/SMR0101/ExportExcel?fileName=${response}`)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .MR0101A{
    position: relative;
    height: 100%;
    .left{
      position: absolute;
      height: calc(100% - 40px);
    }
    .tree{
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border: 1px solid rgb(200, 200, 200)
    }
    .content{
      height: 100%;
      overflow: auto;
      margin-left: 260px;
      .wrap{
        display: flex;
        flex-wrap: wrap;
        min-height: 50%;
      }
    }
  }
</style>
