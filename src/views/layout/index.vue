<template>
  <div class="app-wrapper" :class="className">
    <transition name="el-fade-in-linear">
      <Sidebar class="sidebar-container" v-show="!fullScreen"></Sidebar>
    </transition>
    <div class="main-container">
      <transition-group name="el-fade-in-linear">
        <navbar v-show="!fullScreen" :key="'navbar'" />
        <tags-view v-show="!fullScreen" :key="'tags-view'" />
      </transition-group>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {AppMain, Sidebar, Navbar, TagsView} from './components'

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
      fullScreen: false, // 是否全屏
      tip: null // 弹窗
    }
  },
  computed: {
    className () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      }
    },
    ...mapGetters([
      'sidebar'
    ])
  },
  mounted () {
    // 添加全局的键盘事件
    document.body.addEventListener('keyup', this.handleFullScreen)
  },
  methods: {
    // 全屏显示
    handleFullScreen (event) {
      let e = event || window.event
      // 按下 shift + F11 组合 全屏显示
      if (e.keyCode === 122 && e.shiftKey) {
        this.fullScreen = !this.fullScreen
        if (this.fullScreen) {
          this.tip = this.$message({
            message: '按 shift + F11组合键 退出全屏模式',
            center: true
          })
        } else {
          this.tip.close()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .app-wrapper{
    height: 100%;
    .sidebar-container{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 220px;
      // transition: width 10s;
    }
    .main-container{
      transition: all .3s linear;
    }
  }
  .hideSidebar{
    .main-container{
      margin-left: 60px;
    }
  }
  .openSidebar{
    .main-container{
      margin-left: 220px;
    }
  }
</style>
