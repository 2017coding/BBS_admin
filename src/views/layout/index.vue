<template>
  <div
    class="app-wrapper"
    :class="className"
  >
    <transition name="el-fade-in-linear">
      <Sidebar
        v-show="!fullScreen"
        class="sidebar-container"
      />
    </transition>
    <div
      class="main-container"
      :style="fullScreen ? 'margin-left: 0' : ''"
    >
      <transition name="el-fade-in-linear">
        <div style="position: relative; z-index: 99">
          <navbar v-show="!fullScreen" />
          <tags-view v-show="!fullScreen" />
        </div>
      </transition>
      <app-main />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AppMain, Sidebar, Navbar, TagsView } from './components'

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
        openSidebar: this.sidebar.opened
      }
    },
    ...mapGetters([
      'sidebar',
      'fullScreen'
    ])
  },
  mounted () {
    this.startTips()
    // 添加全局的键盘事件
    document.body.addEventListener('keyup', this.handleFullScreen)
  },
  methods: {
    // 全屏显示
    handleFullScreen (event) {
      const e = event || window.event
      // 按下 shift + F11 组合 全屏显示
      if (e.keyCode === 122 && e.shiftKey) {
        // this.fullScreen = !this.fullScreen
        this.$store.commit('app/TOGGLE_FULLSCREEN', !this.fullScreen)
        if (this.fullScreen) {
          this.tip = this.$message({
            message: '按 shift + F11组合键 退出全屏模式',
            center: true
          })
        } else {
          this.tip.close()
        }
      }
    },
    // 消息提示
    startTips () {
      setTimeout(() => {
        this.$notify({
          title: '全屏模式',
          message: 'shift + F11',
          duration: 30000,
          offset: 50
        })
      }, 100)
      setTimeout(() => {
        this.$notify({
          title: '源码',
          message: '右上角点用户进去源码地址，可去作者git仓库查看node端源码和管理平台源码',
          duration: 30000,
          offset: 50
        })
      }, 200)
      setTimeout(() => {
        this.$notify({
          title: '用户管理',
          message: '1. 用户创建某个用户，这个用户以及他子用户创建的所有用户，父级都能够管理 2. 删除用户时，用户如果有子用户，需要先将子用户转移给同级用户后才可删除',
          duration: 30000,
          offset: 50
        })
      }, 300)
      setTimeout(() => {
        this.$notify({
          title: '角色管理',
          message: '1. 使用右键可以对角色编辑 2. 绑定用户时，如果用户已经绑定其他角色需要先取消绑定后才能操作 3. 分配菜单或者数据权限的时候，只能分配给当前角色的父级角色的权限',
          duration: 30000,
          offset: 50
        })
      }, 400)
      setTimeout(() => {
        this.$notify({
          title: '菜单管理',
          message: '1. 右键添加菜单, 菜单中可添加对应的数据权限 2. 数据权限tab需要点击页面级菜单才会显示',
          duration: 30000,
          offset: 50
        })
      }, 500)
      // setTimeout(() => {
      //   this.$notify({
      //     title: '日志管理',
      //     message: '日志管理会记录当前登录用户，时间，IP等信息',
      //     duration: 30000,
      //     offset: 50
      //   })
      // }, 600)
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
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
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
