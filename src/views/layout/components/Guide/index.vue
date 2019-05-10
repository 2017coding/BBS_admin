<template>
  <el-tooltip
    effect="dark"
    content="使用引导"
    placement="bottom"
  >
    <i
      class="el-icon-question"
      :style="'font-size:' + fontSize"
      @click.prevent.stop="guide()"
    />
  </el-tooltip>
</template>

<script>
import * as Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './defineSteps'

export default {
  name: 'Guide',
  props: {
    fontSize: {
      type: String,
      default: '24px'
    }
  },
  data () {
    return {
      driver: null
    }
  },
  mounted () {
    this.driver = new Driver()
  },
  methods: {
    guide () {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>

<style lang="scss" scoped>
  i{
    cursor: pointer;
  }
</style>
