<template>
  <div
    v-if="!item.hidden"
    class="menu-wrapper"
  >
    <!-- 在这里循环普通菜单 -->
    <template v-if="hasOneShowingChildren(item, item.children) && (!item.children[0].children || item.children[0].children.length === 0)">
      <router-link :to="resolvePath(item)">
        <el-menu-item :index="resolvePath(item)">
          <i
            v-if="item.children[0].meta && item.children[0].meta.icon"
            :class="'icon iconfont ' + item.children[0].meta.icon"
          />
          <span
            v-if="item.children[0].meta && item.children[0].meta.title"
            slot="title"
          >{{ item.children[0].meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <!-- 多级菜单的子项 -->
    <template v-else-if="!item.children.length">
      <router-link :to="item.path">
        <el-menu-item :index="item.path">
          <i
            v-if="item.meta && item.meta.icon"
            :class="'icon iconfont ' + item.meta.icon"
          />
          <span
            v-if="item.meta && item.meta.title"
            slot="title"
          >{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <!-- 在这里循环多级菜单 -->
    <el-submenu
      v-else
      ref="subMenu"
      popper-append-to-body
      :index="item.path"
    >
      <template slot="title">
        <i
          v-if="item.meta && item.meta.icon"
          :class="'icon iconfont ' + item.meta.icon"
        />
        <span
          v-if="item.meta && item.meta.title"
          slot="title"
        >{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-submenu>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    resolvePath (item) {
      return item.path ? item.path + '/' + item.children[0].path : item.children[0].path
    },
    hasOneShowingChildren (item, children) {
      // 判断路由是否显示
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      // 设置当只有一个子目录的时候并且名字和父级一样时，菜单不展开
      if (showingChildren.length === 1 && showingChildren[0].meta.title === item.meta.title) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon{
    padding-right: 5px;
    font-size: 24px;
  }
</style>
