<template>
  <el-menu
    :default-active="$route.path"
    :collapse="!sidebar.opened"
    :background-color="''"
    :text-color="baseScss.textColor"
    :active-text-color="baseScss.theme"
    mode="vertical"
    unique-opened>
    <sidebar-item v-for="route in baseRouter" :key="route.path" :item="route"/>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { baseRouter } from '@/router'
import SidebarItem from './SidebarItem'
import baseScss from '@/common/style/base.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data () {
    return {
      baseScss,
      baseRouter
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
</style>
