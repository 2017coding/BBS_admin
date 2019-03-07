<template>
  <div class="home">
    <template>
      <!-- 配置首页加载 -->
      <component :is='index'></component>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import S0001A from './S0001A'
import Default from './default'
export default {
  components: {
    S0001A,
    Default
  },
  computed: {
    ...mapGetters([
      'theme',
      'userInfo',
      'projectInfo'
    ])
  },
  data () {
    return {
      index: '',
      show: false
    }
  },
  mounted () {
    if (this.projectInfo) {
      this.getHomePage(this.projectInfo.index)
    }
  },
  watch: {
    'projectInfo' (val) {
      this.getHomePage(val.index)
    }
  },
  methods: {
    getHomePage (index) {
      if (this.$options.components[index]) {
        this.index = index
      } else {
        this.index = 'Default'
      }
      this.show = true
    }
  }
}
</script>

<style scoped>
  .home{
    height: 100%;
  }
</style>