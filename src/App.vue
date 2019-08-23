<template>
  <div id="app">
    <!-- 初始化主题 -->
    <theme-picker class="init-theme" />
    <router-view />
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { ThemePicker },
  computed: {
    ...mapGetters([
      'theme'
    ])
  },
  watch: {
    theme: {
      handler (val) {
        this.$nextTick(() => {
          this.setNprogress()
        })
      },
      immediate: true
    }
  },
  methods: {
    // 动态替换style
    setNprogress () {
      const theme = this.theme
      const cssString = `#nprogress .bar{
        background: ${theme} !important;
      }
      #nprogress .peg{
        box-shadow: 0 0 10px ${theme}, 0 0 5px ${theme}!important;
      }`
      const domNprogressStyle = document.querySelector('#nprogress-style')
      if (!domNprogressStyle) {
        const style = document.createElement('style')
        style.setAttribute('id', 'nprogress-style')
        style.setAttribute('type', 'text/css')
        style.innerHTML = cssString
        document.head.appendChild(style)
      } else {
        domNprogressStyle.innerHTML = cssString
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%; // 继承父级高度
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .init-theme{
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
}
</style>
