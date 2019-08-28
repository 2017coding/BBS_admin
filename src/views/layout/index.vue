<template>
  <div
    class="app-wrapper"
  >
    <Sidebar
      class="sidebar-container"
      :class="className"
    />
    <div
      class="main-container"
    >
      <transition name="el-fade-in-linear">
        <div style="position: relative; z-index: 99">
          <navbar v-show="!fullScreen" @handleFullScreen="handleFullScreen" />
          <tags-view v-show="!fullScreen" />
        </div>
      </transition>
      <app-main />
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt'
import { mapGetters } from 'vuex'
import { AppMain, Sidebar, Navbar, TagsView } from './components'
// import baseScss from '@/common/style/base.scss'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView
  },
  data () {
    return {
      tip: null // 弹窗
    }
  },
  computed: {
    className () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        fullScreen: this.fullScreen
      }
    },
    ...mapGetters([
      'theme',
      'sidebar',
      'fullScreen',
      'userInfo'
    ])
  },
  watch: {
    theme: {
      handler (val) {
        this.$nextTick(() => {
          // this.setLayoutsidebar()
        })
      },
      immediate: true
    }
  },
  mounted () {
    this.initMqtt()
    // 添加全局的键盘事件
    document.body.addEventListener('keyup', this.handleFullScreen)
  },
  methods: {
    // 动态替换style TODO: 暂时没找到通过js将scss变成css的方法
    setLayoutsidebar () {
      // const theme = this.theme
      // const cssString = `.sidebar-container, .menu-wrapper .el-menu-item, .el-submenu .el-submenu__title{
      //   background-color: mix(${baseScss['layout-sider-color']}, ${theme},70%) !important;
      // }
      // .menu-wrapper .el-menu-item, .el-submenu .el-submenu__title{
      //   &:hover {
      //     background-color: rgba(${theme}, .5) !important;
      //   }
      // }
      // .el-submenu{
      //   &.is-opened{
      //     .menu-wrapper .el-menu-item{
      //       background-color: mix(${baseScss['layout-sider-color']}, ${theme}, 80%) !important;
      //       &:hover {
      //         background-color: rgba(${theme}, .5) !important;
      //       }
      //     }
      //   }
      // }`
      // const layoutSidebarStyle = document.querySelector('#layout-sidebar-style')
      // if (!layoutSidebarStyle) {
      //   const style = document.createElement('style')
      //   style.setAttribute('id', 'layout-sidebar-style')
      //   style.setAttribute('type', 'text/css')
      //   style.innerHTML = cssString
      //   document.head.appendChild(style)
      // } else {
      //   layoutSidebarStyle.innerHTML = cssString
      // }
    },
    // 全屏显示
    handleFullScreen (event, start) {
      const e = event || window.event
      // 按下 shift + F11 组合 全屏显示
      if (e.keyCode === 122 && e.shiftKey || start) {
        // this.fullScreen = !this.fullScreen
        this.$store.commit('app/TOGGLE_FULLSCREEN', !this.fullScreen)
        if (this.fullScreen) {
          this.tip = this.$message({
            message: '按 Esc 或 shift + F11组合键 退出全屏模式',
            center: true
          })
        } else {
          if (!this.tip) return
          this.tip.close()
        }
      }
      if (this.fullScreen && e.keyCode === 27) {
        this.$store.commit('app/TOGGLE_FULLSCREEN', !this.fullScreen)
      }
    },
    initMqtt () {
      const URL = process.env.VUE_APP_TYPE === 'localhost' ? '127.0.0.1:1212' : 'www.lyh.red/mqttwss'
      // 在不同协议下，使用不同的连接方式
      const protocol = location.protocol === 'http:' ? 'mqtt:' : 'mqtts:'
      const client = mqtt.connect(`${protocol}//${URL}`)
      const TopicList = [
        `/chat/user/${this.userInfo.id}`,
        `/chat/group/#`,
        `/message/user/${this.userInfo.id}`,
        `/message/audit/#`
      ]
      // 连接
      client.on('connect', () => {
        console.log('连接' + new Date())
        TopicList.forEach(topic => {
          client.subscribe(topic, function (err) {
            if (!err) {
              console.log('订阅成功: ' + topic)
            }
          })
        })
      })
      // 获取到消息
      client.on('message', (topic, message) => {
        // message is Buffer
        console.log(topic, message.toString())
      })
      // 断开自动重连
      client.on('close', () => {
        console.log('close重新连接' + new Date())
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/common/style/base.scss';
.app-wrapper{
  display: flex;
  height: 100%;
  .sidebar-container{
    width: $layout-sider-width !important;
    transition: width 0.28s ease-in-out;
    overflow-y: auto;
    &.hideSidebar{
      width: $layout-sider-hide-width !important;
    }
    &.openSidebar{
      width: $layout-sider-width !important;
    }
    &.fullScreen{
      width: 0px !important;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .main-container{
    flex: 1;
    width: 0;
    transition: all 0.28s;
  }
}
</style>
<style lang="scss">
@import '@/common/style/base.scss';
.sidebar-container, .menu-wrapper .el-menu-item, .el-submenu .el-submenu__title{
  background-color: $layout-sider-background !important;
}
.menu-wrapper .el-menu-item, .el-submenu .el-submenu__title{
  &:hover {
    background-color: mix($layout-sider-background, white, 85%) !important;
  }
}
.el-submenu{
  &.is-opened{
    .menu-wrapper .el-menu-item{
      background-color: mix($layout-sider-background, white, 95%) !important;
      &:hover {
        background-color: mix($layout-sider-background, white, 85%) !important;
      }
    }
  }
}
.horizontal-collapse-transition {
  transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
}
</style>
