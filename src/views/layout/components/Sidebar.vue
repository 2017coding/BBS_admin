<template>
  <el-menu
    :default-active="$route.path"
    :collapse="!sidebar.opened"
    :background-color="baseScss['layout-sider-background']"
    :text-color="baseScss['layout-sider-color']"
    :active-text-color="theme || baseScss.theme"
    mode="vertical"
    unique-opened
  >
    <sidebar-item
      v-for="route in menu"
      :key="route.path"
      :item="route"
    />
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import baseScss from '@/common/style/base.scss'

export default {
  components: { SidebarItem },
  data () {
    return {
      baseScss
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'sidebar',
      'menu'
    ])
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
</style>
