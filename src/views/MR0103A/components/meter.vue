<template>
  <div class="meter">
    <div class="head">
      <p class="nav">
        <span class="label">当前租户：</span>
        <span class="tenant-name">{{tenantInfo.tenant_name}}</span>
      </p>
      <el-button type="info" icon="el-icon-back" @click="handleClickBt('back')"></el-button>
    </div>
    <!-- <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-arrow-left" v-waves @click="handleClickBt('back')">返回</el-button>
    </div> -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" v-waves @click="handleClickBt('add')">添加电表</el-button>
    </div>
    <!-- 显示表格 -->
    <el-table 
      ref="table"
      :max-height="listInfo.tableHeight || undefined"
      :data="listInfo.data" 
      border 
      style="width:100%"
      v-loading="listInfo.loading">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="metr_code" label="电表编号" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="metr_name" label="电表名称" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="ct_rate" label="CT变比" align="center" min-width="80px">
      </el-table-column>
      <el-table-column prop="rate" label="分摊比例" align="center" min-width="80px">
      </el-table-column>
      <el-table-column prop="ss" label="电损系数" align="center" min-width="80px">
      </el-table-column>
      <el-table-column prop="start_time" label="开始时间" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="start_value" label="开始读数" align="center" min-width="120px">
      </el-table-column>
      <el-table-column prop="end_time" label="结束时间" align="center" min-width="160px">
      </el-table-column>
      <el-table-column prop="end_value" label="结束读数" align="center" min-width="120px">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" icon="el-icon-edit" v-waves @click="handleClickBt('update', scope.row)" :loading="scope.row.updateLoading">编辑
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-sort" v-waves @click="handleClickBt('delete', scope.row)">停用
          </el-button>
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
    <!-- 操作弹窗 -->
    <el-dialog :title="dialogInfo.header[dialogInfo.status]" :visible.sync="dialogInfo.show">
      <template v-if="dialogInfo.status === 'add'">
        <el-table 
          ref="table" 
          :data="listTypeInfo.metrList" 
          border 
          style="width:100%"
          height="400"
          v-loading="listInfo.loading" 
          @select-all="handleSelectionChange"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="metr_code" label="电表代码" align="center" min-width="160px">
          </el-table-column>
          <el-table-column prop="metr_name" label="电表名称" align="center" min-width="200px">
          </el-table-column>
        </el-table>
      </template>
      <template v-else>
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <!-- <el-form-item label="分摊比例" prop="rate">
            <el-input v-model.trim="form.rate" placeholder="请输入分摊比例"></el-input>
          </el-form-item> -->
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="form.start_time"
              type="datetime"
              :clearable="false"
              format="yyyy-MM-dd HH"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取消</el-button>
        <el-button type="primary" :loading="dialogInfo.btLoading" @click="handleConfirm(dialogInfo.status)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    props: {
      tenantInfo: {
        type: Object
      },
      showPage: {
        type: String
      }
    },
    data () {
      return {
        // 列表相关
        listInfo: {
          pageInit: true,
          tableHeight: 0,
          data: [],
          // 电表
          meter: [],
          total: 0,
          loading: false,
          pageSizes: this.$config.PAGESIZES,
          // 查询条件
          query: {
            curPage: 1,
            pageSize: this.$config.PAGESIZE,
            dimension: '',
            dagp_id: '',
            dagp_pid: '',
            dagp_pname: ''
          },
          tablePath: '维度' // 表格显示的位置
        },
        // 页面相关的列表类型
        listTypeInfo: {
          // 维度列表
          dimensionTypeList: [],
          // 计量方式
          wayList: [
            {value:  1, key: '总电表量'},
            {value:  2, key: '子电表量'}
          ],
          // 总表列表
          metrList: [
          ]
        },
        // 表单数据
        form: {
          metr_id: '', // 电表ID *
          metr_code: '', // 电表code *
          metr_name: '', // 电表名称 *
          rate: '', // 分摊比例 *
          start_time: '', // 开始时间 *
          start_value: '', // 开始读数 *
          end_time: '', // 结束时间 *
          end_value: '' // 结束读数 *
        },
        // 验证规则
        rules: {
        },
        // 弹窗相关
        dialogInfo: {
          header: {
            add: '添加电表',
            update: '编辑电表'
          },
          show: false,
          showGroup: false,
          status: '',
          btLoading: false,
          selectedList: []
        },
        // 选择的电表
        selectedMetrs: []
      }
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    mounted () {
      this.initlistTypeInfo()
      this.getList()

      // 得到表格的高度
      this.listInfo.tableHeight = this.$fn.getTableHeight()

      // 监听页面大小改变
      window.addEventListener('resize', () => {
        // 得到表格的高度
        this.listInfo.tableHeight = this.$fn.getTableHeight()
      })
    },
    methods: {
      // 初始化查询相关数据
      initlistTypeInfo () {
        // 得到所有的监测点数据
        this.$api.getMetrApi({projID: this.projectInfo.proj_id}).then(response => {
          if (response.success) {
            this.listTypeInfo.metrList = response.content.data

            this.listTypeInfo.metrList.forEach(item => {
              item.key = item.metr_name
              item.value = item.metr_id
            })
          }
        })
        .catch(() => {
          console.log('获取监测点列表失败')
        })
      },
      // 得到数据
      getList () {
        this.listInfo.data = [
          {
            metr_id: 1, // * 电表ID
            metr_name: '12联络+1AA3', // * 电表名称
            metr_code: '2018-07320300', // * 电表编码
            rate: '1',
            ct_rate: '1',
            ss: '1.07',
            start_time: '2018-02-02 08:30:00', // * 开始时间
            start_value: '115989.99', // 开始读数
            end_time: '-', // * 结束时间
            end_value: '127780.17' // 结束读数
          },
          {
            metr_id: 2, // * 电表ID
            metr_name: '市电联络柜+2AA6', // * 电表名称
            metr_code: '2018-07320193', // * 电表编码
            rate: '1',
            ct_rate: '1',
            ss: '1.07',
            start_time: '2015-10-09 01:12:33', // * 开始时间
            start_value: '33335.33', // 开始读数
            end_time: '2018-01-22 20:04:17', // * 结束时间
            end_value: '115989.99' // 结束读数
          }
        ]
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
      handleSelectionChange (rows) {
      },
      // 按钮的点击
      handleClickBt (type, row) {
        switch (type) {
        case 'back':
          this.$emit('update:showPage', 'tenant')
          break
        case 'add':
          this.dialogInfo.show = true
          this.dialogInfo.status = 'add'
          break
        case 'update':
          this.dialogInfo.show = true
          this.dialogInfo.status = 'update'

          for (let key in row) {
            this.form[key] = row[key]
          }
          break
        }
      },
      // 确认的事件处理
      handleConfirm (type) {
      },
      // 删除的事件处理
      handleDelete (row) {
      },
      // 取消按钮的点击
      handleCancel () {
        this.dialogInfo.show = false
      },
      // 表单初始化
      resetForm () {
        this.form = {
          metr_id: '', // 电表ID *
          metr_code: '', // 电表code *
          metr_name: '', // 电表名称 *
          rate: '', // 分摊比例 *
          start_time: '', // 开始时间 *
          start_value: '', // 开始读数 *
          end_time: '', // 结束时间 *
          end_value: '' // 结束读数 *
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.meter {
  position: absolute;
  padding: 20px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    .icon-back{
      font-size: 22px;
      cursor: pointer;
    }
    .label{
      font-size: 14px;
      color: rgb(150, 150, 150);
    }
    .tenant-name{
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
