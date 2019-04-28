<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in levelList"
        :key="item.path"
      >
        <span
          v-if="item.redirect === &quot;noredirect&quot; || index == levelList.length - 1"
          class="nav"
        >{{ item.meta.title }}</span>
        <!-- <router-link v-else :to="item.redirect || item.path">{{item.meta.title}}</router-link> -->
        <span
          v-else
          :to="item.redirect || item.path"
          class="nav"
        >{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
    <transition>
      <span
        v-if="_ifShow()"
        class="no-redirect"
      >首页</span>
    </transition>
  </el-breadcrumb>
</template>

<script>

export default {
  name: 'Breadcrumb',
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this._getBreadcrumb()
    }
  },
  created () {
    this._getBreadcrumb()
  },
  methods: {
    _getBreadcrumb () {
      // matched会匹配到当前路由的所有路由记录
      let matched = this.$route.matched.filter(item => item.meta.title)
      const first = matched[0]
      if (first && first.name !== 'index') {
        matched = [{ path: '/', meta: { title: '' }}].concat(matched)
      }
      // 当父目录和子目录名字一样的时候, 去重
      const arr = []
      matched.forEach(item => {
        if (arr.length === 0) {
          arr.push(item)
        }
        let i = 0
        arr.forEach(item1 => {
          if (item.meta.title !== item1.meta.title) {
            i++
          }
          if (i === arr.length) {
            arr.push(item)
          }
        })
      })
      this.levelList = arr.filter(item => item.meta.title)
    },
    _ifShow () {
      let index = 0
      this.levelList.forEach(item => {
        if (!item.meta.title) {
          index++
        }
      })
      return index === this.levelList.length
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 34px;
    .nav {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
