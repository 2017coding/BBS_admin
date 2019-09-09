<template>
  <transition name="warn-transition">
    <div v-if="visible" v-loading="initLoading" class="notification-list">
      <div class="close-box" :style="`background: ${theme}`" @click.stop="handleClick('close')">
        <i class="el-icon-close" />
      </div>
      <!-- head -->
      <!-- <div class="notification-head">
        <span class="title">
          消息列表
        </span>
        <el-tooltip :content="'清空已读消息'" effect="dark" placement="left">
          <i class="el-icon-delete" @click.stop="handleClick('empty', item)" />
        </el-tooltip>
      </div> -->
      <!-- list -->
      <ul class="notification-content">
        <el-tabs v-model="tabInfo.active">
          <el-tab-pane
            v-for="(item, index) in tabInfo.list"
            :key="index"
            type="card"
            :label="item.key"
            :name="item.value"
          />
        </el-tabs>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotificationList',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      initLoading: false,
      listTypeInfo: {
        typeList: [
          { key: '属性数值相关报警', value: 0 },
          { key: '设备故障引发的报警', value: 1 }
        ],
        statusList: [
          { key: '未确认', value: 0 },
          { key: '已确认', value: 1 }
        ]
      },
      tabInfo: {
        active: 'notice',
        list: [
          { key: '通知', value: 'notice' },
          { key: '评论', value: 'commont' },
          { key: '点赞', value: 'good' },
          { key: '关注', value: 'focus' }
        ]
      },
      list: {
        alarm: [],
        notification: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme'
    ])
  },
  watch: {
    visible: {
      handler (val) {
        if (!val) {
          return
        }
      },
      deep: true,
      immediate: true
    },
    query: {
      handler (val) {
      },
      deep: true,
      immediate: true
    },
    'tabInfo.active' (val) {
    }
  },
  mounted () {
    this.receiveEventBus()
  },
  methods: {
    receiveEventBus () {
      // 接收eventBus
      this.$eventBus.$on('click-new-message', data => {
        this.$emit('update:visible', true)
      })
      this.$eventBus.$on('refresh-new-message', data => {
        // if (this.visible) {
        // }
      })
    },
    handleClick (type, data) {
      switch (type) {
        case 'close':
          this.$emit('update:visible', false)
          break
      }
    }
  }
}
</script>

<style lang="scss">
.notification-list{
  .notification-content{
    .el-tabs{
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__nav{
        width: 100%;
      }
      .el-tabs__active-bar, .el-tabs__item{
        width: 25% !important;
      }
      .el-tabs__item{
        text-align: center;
      }
    }
  }
}
.notification-message{
  .item{
    margin-bottom: 5px;
    .label{
      display: inline-block;
      // text-align: right;
      width: 70px;
      font-size: 13px;
    }
    .value{
      font-size: 15px;
    }
  }
}
</style>
<style lang="scss" scoped>
.notification-list{
  position: fixed;
  right: 0;
  top: 85px;
  bottom: 0;
  width: 300px;
  background: rgba(255, 255, 255, .9);
  z-index: 1111;
  overflow: auto;
  box-shadow: rgb(200, 200, 200) 0px 0px 3px;
  .close-box{
    position: fixed;
    padding: 10px 5px;
    top: 50%;
    border-radius: 3px 0 0 3px;
    right: 300px;
    cursor: pointer;
    .el-icon-close{
      color: white;
    }
  }
  .notification-head{
    position: fixed;
    // top: 85px;
    right: 0;
    width: 300px;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 255, 255, .9);
    border-bottom: 1px solid rgb(200, 200, 200);
    .el-icon-delete{
      position: absolute;
      right: 0;
      top: 0;
      padding: 10px;
      font-size: 20px;
      cursor: pointer;
       &:hover{
        color: red;
        transition: all .3s;
      }
    }
    .title{
      display: block;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .set-all-read{
      padding: 10px;
      top: -10px;
      left: 0;
      position: absolute;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .notification-content{
    position: relative;
    // margin-top: 40px;
    .notification-content-list{
      width: 100%;
      height: calc(100vh - 40px - 40px - 85px);
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .item{
      position: relative;
      padding: 10px;
      border-bottom: 1px solid rgb(200, 200, 200);
      cursor: pointer;
      &:last-child{
        border: none;
      }
      &:hover{
        background: rgba(220, 220, 220, .5);
        .el-icon-view{
          display: inline;
        }
      }
      .el-icon-view{
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        display: none;
      }
      .item-title{
        color: red;
        font-size: 16px;
      }
      .item-content{
        padding: 10px 0;
      }
      .item-time{
        font-size: 12px;
        color: rgb(100, 100, 100)
      }
    }
  }
}
// 报警盒子动画
.warn-transition-enter-active, .warn-transition-leave-active {
  transition: all .4s;
}
.warn-transition-enter, .warn-transition-leave-active {
  transform: translate3d(100%, 0, 0);
  // opacity: 0;
}
</style>
