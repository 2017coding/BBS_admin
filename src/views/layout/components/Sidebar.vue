<template>
  <el-menu
    :default-active="$route.path"
    :collapse="true"
    mode="vertical">
    <sidebar-item v-for="route in baseRouter" :key="route.path" :data="route"/>
  </el-menu>
</template>

<script>
import { baseRouter } from '@/router'
// import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
  },
  data () {
    return {
      baseRouter
    }
  },
  mounted () {
    console.log(this.baseRouter)
  }
}
</script>
