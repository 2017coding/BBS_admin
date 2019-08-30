<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <!-- <i class="el-icon-search" style="font-size: 22px" />
      <svg-icon class-name="size-icon" icon-class="size" /> -->
      <svg class="svg-icon size-icon" aria-hidden="true" v-on="$listeners">
        <use xlink:href="#icon-size">
          <svg id="icon-size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%"><path d="M0 54.857h54.796v18.286H36.531V128H18.265V73.143H0V54.857zm127.857-36.571H91.935V128H72.456V18.286H36.534V0h91.326l-.003 18.286z" /></svg>
        </use>
      </svg>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{
          item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data () {
    return {
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    }
  },
  computed: {
    size () {
      return this.$store.getters.size
    }
  },
  methods: {
    handleSetSize (size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
      this.$message({
        message: this.$t('checkOutSize'),
        type: 'success'
      })
    },
    refreshView () {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.size-icon {
  cursor: pointer;
  font-size: 18px;
  vertical-align: middle;
}
</style>
