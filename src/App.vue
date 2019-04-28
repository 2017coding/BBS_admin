<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
#app {
  height: 100%; // 继承父级高度
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
