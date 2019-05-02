<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      v-for="(item, index) in list"
      :key="index"
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('newVisitis')"
      >
        <div :class="'card-panel-icon-wrapper icon-' + item.type">
          <i :class="'el-icon ' + item.icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ item.title }}
          </div>
          <count-to
            :start-val="0"
            :end-val="item.total"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { platformDataCountApi } from '@/api/count'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data () {
    return {
      list: [
        { title: '问题数', type: 'questions', total: 0, icon: 'el-icon-albb-message_fill' },
        { title: '文章数', type: 'articles', total: 0, icon: 'el-icon-albb-createtask_fill' },
        { title: '专栏数', type: 'columns', total: 0, icon: 'el-icon-albb-order_fill' },
        { title: '用户数', type: 'users', total: 0, icon: 'el-icon-albb-group_fill' }
      ]
    }
  },
  mounted () {
    this.getPlatformDataCount()
  },
  methods: {
    handleSetLineChartData (type) {
      this.$emit('handleSetLineChartData', type)
    },
    getPlatformDataCount () {
      platformDataCountApi().then(res => {
        if (res.success) {
          const data = res.content
          for (const item of this.list) {
            if (data[item.type]) {
              item.total = data[item.type]
            }
          }
        } else {
          console.log('获取信息失败')
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .el-icon{
      font-size: 48px;
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-questions {
         background: rgb(3, 150, 255);
      }
      .icon-articles {
        background: rgb(234, 84, 85);
      }
      .icon-columns {
        background: rgb(115, 103, 240);
      }
      .icon-users {
        background: rgb(50, 204, 188)
      }
    }
    .icon-questions {
      color: rgb(3, 150, 255);
    }
    .icon-articles {
      color: rgb(234, 84, 85);
    }
    .icon-columns {
      color: rgb(115, 103, 240);
    }
    .icon-users {
      color: rgb(50, 204, 188)
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
