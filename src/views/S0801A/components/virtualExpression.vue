<template>
  <div class="virtual-expression">
    <!-- 条件栏 -->
    <div class="filter-container">
      <div class="filter-item">
        <label class="filter-label">运算符号:</label>
        <el-select class="filter-item filter-input" v-model="expressionType" placeholder="请选择运算符号" style="width: 70px">
          <el-option v-for="(item, index) in  listTypeInfo.expressionTypeList" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item filter-item_left">
        <el-button class="filter-item" type="primary" v-waves @click="handleConfirm()">确认</el-button>
        <el-button class="filter-item" type="primary" v-waves @click="handleClean()">请除</el-button>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <ExpressionTree
          @cdHandleTreeCheck="cdHandleTreeCheck"
          :checkBox="true"
          :defaultChecked="virtualExpression.selectIds"
          :virtualExpressionText="virtualExpression.text"
          :rightData="rightData">
        </ExpressionTree>
      </div>
      <div class="right" :style="'border: solid 1px' + theme">
        {{virtualExpression.text}}
      </div>
    </div>
  </div>
</template>

<script>
import ExpressionTree from './expressionTree'
import { mapGetters } from 'vuex'
export default {
  props: {
    rightData: {
      type: Object
    },
    // 虚拟表达式文字
    expressionText: {
      type: String
    },
     // 虚拟表达式ID
    expressionID: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  components: {
    ExpressionTree
  },
  data () {
    return {
      // 运算符号类型
      expressionType: '+',
      listTypeInfo: {
        expressionTypeList: [
          {key: '+', value: '+'},
          {key: '-', value: '-'}
        ]
      },
      virtualExpression: {
        text: '',
        id: '',
        selectIds: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme'
    ])
  },
  mounted () {
    this.virtualExpression.text = this.expressionText
    this.virtualExpression.id = this.expressionID
  },
  watch: {
    'virtualExpression.id' (val) {
      this.virtualExpression.selectIds = []
      // 将拼接的id转换为数组
      let arr = val.replace(/[+-]/g, ',').split(',')
      arr.forEach(item => {
        if (item) {
          this.virtualExpression.selectIds.push('meter' + +item)
        }
      })
    }
  },
  methods: {
    // 确定生成表达式
    handleConfirm () {
      this.$emit('update:expressionText', this.virtualExpression.text)
      this.$emit('update:expressionID', this.virtualExpression.id)
      this.$emit('update:visible', false)
    },
    // 清除表达式
    handleClean () {
      this.virtualExpression.text = ''
      this.virtualExpression.id = ''
      this.$emit('update:expressionText', '')
      this.$emit('update:expressionID', '')
    },
    // 树选中事件
    cdHandleTreeCheck (data) {
      // 初始化，为初始选择的数据加上时间戳参数
      let index = 0
      data.forEach(item => {
        if (!item.timestamp) {
          item.timestamp = index++
        }
      })
      // 排序
      let arr = data.sort((a, b) => a.timestamp - b.timestamp)

      this.virtualExpression.id = ''
      this.virtualExpression.text = ''
      // 给每个选项绑定单位
      for (let item of arr) {
        // 处理选中的表计数据
        if (item.type === 'meter') {
          if (!item.unit) {
            item.unit = this.expressionType
          }
          this.virtualExpression.text += item.unit + ' ' + '[' + item.metr_name + ']' + ' '
          this.virtualExpression.id += item.unit + item.metr_id
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .virtual-expression{
    .content{
      display: flex;
      height: 400px;
      .left{
        flex: 3;
      }
      .right{
        flex: 4;
        margin-left: 20px;
        padding: 10px;
      }
      .left, .right{
        height: 100%;
        overflow: auto;
      }
    }
  }
</style>