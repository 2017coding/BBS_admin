<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <div
      ref="scrollWrapper"
      class="scroll-wrapper"
      :style="{left: left + 'px'}"
    >
      <slot />
    </div>
  </div>
</template>

<script>
const padding = 15 // tag's padding

export default {
  name: 'ScrollPane',
  data () {
    return {
      left: 0
    }
  },
  methods: {
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        } else {
          this.left = 0
        }
      }
    },
    moveToTarget ($target) {
      // 容器
      const $container = this.$refs.scrollContainer
      // 容器宽度
      const $containerWidth = $container.offsetWidth
      // 标签左偏移
      const $targetLeft = $target.offsetLeft
      // 标签可见宽度
      const $targetWidth = $target.offsetWidth
      if ($targetLeft < -this.left) {
        // 标签在可视区域左侧
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // 标签在可视区域
        this.left = Math.min(0, $containerWidth - $targetWidth - $targetLeft - padding)
      } else {
        // 标签在可视区域右侧
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
  }
}
</style>
