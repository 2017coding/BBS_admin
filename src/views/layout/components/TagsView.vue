<template>
  <div
    class="tags-view-container"
    @contextmenu.prevent="_openMenu('', $event)"
  >
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
    >
      <router-link
        v-for="tag in Array.from(visitedViews)"
        ref="tag"
        :key="tag.path"
        class="tags-view-item"
        :class="isActive(tag)? 'active' : ''"
        :style="isActive(tag)"
        :to="tag"
        @contextmenu.prevent.native.stop="_openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span
          v-if="visitedViews.length > 1"
          class="el-icon-close"
          @click.prevent.stop="_closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      class="contextmenu"
      :style="{left:left + 'px', top: top + 'px'}"
    >
      <li
        v-if="selectedTag && visitedViews.length > 1"
        @click="_closeSelectedTag(selectedTag)"
      >
        关闭
      </li>
      <li
        v-if="selectedTag"
        @click="_closeOthersTags"
      >
        关闭其他
      </li>
      <li @click="_closeAllTags">
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from '@/components/ScrollPane'
import baseScss from '@/common/style/base.scss'

export default {
  name: 'TagsView',
  components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      baseScss
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
      // 设置只保留8个菜单
      // return this.$store.state.tagsView.visitedViews.slice(-8)
    }
  },
  watch: {
    $route () {
      this._addViewTags()
      this._moveToCurrentTag()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this._closeMenu)
      } else {
        document.body.removeEventListener('click', this._closeMenu)
      }
    }
  },
  mounted () {
    this._addViewTags()
  },
  methods: {
    _generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    // 返回当前访问路由的样式
    isActive (tag) {
      if (tag.path === this.$route.path) {
        return 'background-color: ' + baseScss.theme + '; color: #fff;border-color: ' + baseScss.theme + ';'
      }
      return false
    },
    _addViewTags () {
      const route = this._generateRoute()
      // route || route.path === '/index' || route.path === '/home/index'
      if (!route || route.path === '/retrieve') {
        return false
      }
      this.$store.dispatch('tagsView/addVisitedViews', route)
    },
    _moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            if (!tag.$el) break
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    _closeSelectedTag (view) {
      // 关掉选中的tag后，将最后一个tag变成选择
      this.$store.dispatch('tagsView/delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            // 关闭所有路由后进入的页面
            // this.$router.push('/')
          }
        }
      })
    },
    _closeOthersTags () {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this._moveToCurrentTag()
      })
    },
    _closeAllTags () {
      this.$store.dispatch('tagsView/delAllViews')
      // 关闭所有路由后进入的页面
      this.$router.push('/')
    },
    _openMenu (tag, e) {
      this.visible = true
      this.selectedTag = tag
      // 不同布局下的位置
      if (!this.sidebar.opened) {
        this.left = e.clientX - 60
      } else {
        this.left = e.clientX - 220
      }
      this.top = e.clientY + 10
    },
    _closeMenu () {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 @import '@/common/style/base.scss';
.tags-view-container {
  // position: relative;
  // z-index: 1;
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        // background-color: $g_theme;
        // color: #fff;
        // border-color: $g_theme;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  height: 30px;
  background: white;
  box-shadow: 0 2px 3px -1px #FCCFD4;
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
