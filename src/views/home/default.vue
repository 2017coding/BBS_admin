<template>
  <div class="app-container" :style="projectInfo ? getStyle() : ''">
    <p class="title" :style="'color:' + theme">{{projectInfo ? projectInfo.proj_name || getDateMeg() : getDateMeg()}}- 欢迎您</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'theme',
      'projectInfo'
    ])
  },
  methods: {
    getStyle () {
      let style = '',
      img = this.projectInfo ? this.projectInfo.sysbg : ''
      style += "background-image: url('" + img + "');"
      style += "background-repeat: no-repeat;"
      style += "background-size: 100% 100%;"
      style += "background-position: center center;"
      return style
    },
    getDateMeg () {
      let hour = this.$fn.switchTime(new Date(), 'hh') - 0
      if (0 < hour && hour < 9) {
        return '早上好'
      } else if (9 <= hour && hour < 12) {
        return '上午好'
      } else if (12 <= hour && hour < 13) {
        return '中午好'
      } else if (13 <= hour && hour < 18) {
        return '下午好'
      } else if (18 <= hour) {
        return '晚上好'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/common/style/mixin.scss';
  .app-container{
    @include center('vertical', true);
    overflow: hidden;
    .title{
      display: inline-block;
      margin-bottom: 15%;
      font-size: 50px;
      color: rgb(0, 38, 42);
      text-shadow: 5px 0px 50px black;

      backface-visibility: visible;
      animation-name: flip;
      animation-duration: 1s;
      animation-fill-mode: both;
    }
  }
  @keyframes flip {
    0% {
      -webkit-transform:perspective(400px) rotate3d(0,1,0,-360deg);
      -ms-transform:perspective(400px) rotate3d(0,1,0,-360deg);
      transform:perspective(400px) rotate3d(0,1,0,-360deg);
      -webkit-animation-timing-function:ease-out;
      animation-timing-function:ease-out
    }
    40% {
      -webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);
      -ms-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);
      transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);
      -webkit-animation-timing-function:ease-out;
      animation-timing-function:ease-out
    }
    50% {
      -webkit-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);
      -ms-transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);
      transform:perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);
      -webkit-animation-timing-function:ease-in;
      animation-timing-function:ease-in
    }
    80% {
      -webkit-transform:perspective(400px) scale3d(.95,.95,.95);
      -ms-transform:perspective(400px) scale3d(.95,.95,.95);
      transform:perspective(400px) scale3d(.95,.95,.95);
      -webkit-animation-timing-function:ease-in;
      animation-timing-function:ease-in
    }
    100% {
      -webkit-transform:perspective(400px);
      -ms-transform:perspective(400px);
      transform:perspective(400px);
      -webkit-animation-timing-function:ease-in;
      animation-timing-function:ease-in
    }
  }
</style>
