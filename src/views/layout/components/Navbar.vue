<template>
  <div class="navbar">
    <div class="left">
      <i :class="sidebar.opened ? 'el-icon-more toggle open' : 'el-icon-more toggle close'" @click="_handleToggle"></i>
      <breadcrumb class="breadcrumb-container"/>
    </div>
    <div class="right">
      <!-- 天气信息的容器 -->
      <div id="tp-weather-widget" style="padding: 10px"></div>
      <el-dropdown @command="_handleCommand">
        <span class="el-dropdown-link">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in dropdownList" :key="index" :command="item.command">{{item.key}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb' // 导航

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      dropdownList: [
        {key: '个人中心', command: 'userInfo'},
        {key: '修改密码', command: 'updatePassword'},
        {key: '退出登录', command: 'loginOut'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  mounted () {
    this._initWeather()
  },
  methods: {
    // 使用天气
    _initWeather () {
      // 显示天气的方法， 要在这个位置初始化
      (function (T, h, i, n, k, P, a, g, e) {
        g = function () {
          P = h.createElement(i)
          a = h.getElementsByTagName(i)[0]
          P.src = k
          P.charset = 'utf-8'
          P.async = 1
          a.parentNode.insertBefore(P, a)
        }
        T['ThinkPageWeatherWidgetObject'] = n
        T[n] || (T[n] = function () { (T[n].q = T[n].q || []).push(arguments) })
        T[n].l = +new Date()
        if (T.attachEvent) {
          T.attachEvent('onload', g)
        } else {
          T.addEventListener('load', g, false)
        }
      }(window, document, 'script', 'tpwidget', '//widget.seniverse.com/widget/chameleon.js'))
      // 方法存在开始加载
      if (typeof tpwidget === 'function') {
        tpwidget('init', {
          'flavor': 'slim',
          'location': 'WX4FBXXFKE4F',
          'geolocation': 'enabled',
          'language': 'auto',
          'unit': 'c',
          'theme': 'chameleon',
          'container': 'tp-weather-widget',
          'bubble': 'enabled',
          'alarmType': 'badge',
          'color': '#C6C6C6',
          'uid': 'UBBB8DBE07',
          'hash': '6dda6603c46080d47f2c51d061c86bba'
        })
        tpwidget('show')
      }
    },
    // 切换菜单
    _handleToggle () {
      this.$store.dispatch('app/toggleSideBar')
    },
    _handleCommand (command) {
      switch (command) {
      case 'userInfo':
        break
      case 'updatePassword':
        break
      case 'loginOut':
        this.$store.dispatch('user/loginOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        break
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/common/style/base.scss';
@import '@/common/style/mixin.scss';
  .navbar{
    position: relative;
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    height: 50px;
    background: white;
    &::after{
      @include border-1px();
    }
    .left, .right{
      display: flex;
      align-items: center;
    }
    .left{
      .toggle{
        transform: rotate(90deg);
        padding: 5px 10px;
        color: rgb(130, 130, 130);
        font-size: 24px;
        cursor: pointer;
        transition: transform .3s ease-in-out;
      }
      .open{
        transform: rotate(0deg);
      }
      .close{
        transform: rotate(90deg);
      }
    }
    .right{
      cursor: pointer;
      .tp-weather-widget{
        padding-right: 20px;
      }
    }
  }
</style>
