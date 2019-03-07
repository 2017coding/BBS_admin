<template>
  <div class="information">
    <p class="title">{{$fn.useWhichData(data, 'title', '代办事项')}}</p>
    <div class="box" ref="box">
      <p class="no-list" v-if="!data.list || (data.list && data.list.length === 0)">暂无{{$fn.useWhichData(data, 'title', '代办事项')}}</p>
      <ul class="list" ref="list" :id="$fn.useWhichData(data, 'type', 'alarm') === 'alarm' ? 'alarm-list111' : ''">
        <li class="item" v-for="(item, index) in getList($fn.useWhichData(data, 'type', 'alarm'))">
          <span :class="'message ' + 'message-' + $fn.useWhichData(data, 'type', 'event')">{{$fn.useWhichData(item, 'message', '')}}</span>
          <span :class="`time ${'time-' + data.type}`">{{item.time}}</span>
        </li>
      </ul>
    </div>
    <p class="all" @click="goto($fn.useWhichData(data, 'path', ''))">查看全部</p>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object
      },
      dataList: {
        type: Array
      }
    },
    data () {
      return {
        index: 0,
        timer: '',
        list: []
      }
    },
    watch: {
      dataList (val) {
        // 得到数据
        this.list = val
        this.domScroll()
      }
    },
    mounted () {
      this.list = this.$fn.useWhichData(this.data, 'list', [])
      this.domScroll()
    },
    destroyed () {
      // 清除计时器
      clearInterval(this.timer)
    },
    methods: {
      getList (type) {
        if (type === 'alarm') {
          return this.list
        } else {
          return this.$fn.useWhichData(this.data, 'list', [])
        }
      },
      domScroll () {
        let boxH = this.$refs.box.clientHeight,
            listH = this.list.length * 30,
            list = document.getElementById('alarm-list111'),
            nums = parseInt((listH - boxH) / 30)

        list.style.cssText = 'transform: translate3d(0, 0, 0)'

        if (listH - boxH > 0) {
          // 当列表高度大于盒子高度的时候将数据复制一份，用来做无缝滚动
          let arr = JSON.parse(JSON.stringify(this.list))
          this.list = [...arr, ...arr]
          this.timer = setInterval(() => {
            if (this.index > this.list.length / 2) {
              this.index = 0
              list.style.cssText = 'transition: none;'
            } else {
              list.style.cssText = 'transition: all .3s linear;'
            }
            list.style.cssText += 'transform: translate3d(0, -' + this.index * 30 + 'px, 0);'
            this.index++
          }, 3000)
        }
      },
      goto (path) {
        if (path) {
          this.$router.push(path)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/common/style/mixin.scss';
  .information{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    .title{
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
    }
    .box{
      padding-left: 10px;
      margin-bottom: 10px;
      flex: 1;
      overflow: hidden;
      .list{
        font-size: 12px;
        .item{
          margin: 10px 0;
          line-height: 1.5;
          .message{
            width: 100%;
            // @include textHide();
          }
          .message-event, .time-alarm{
            // font-size: 24px;
            color: #0E5CAD;
          }
          .message-alarm, .time-event{
            margin: 0;
            color: #F55555;
          }
          .time{
            float: right;
          }
        }
      }
    }
    .all{
      text-align: right;
      cursor: pointer;
    }
    .no-list{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #F55555;
    }
  }
</style>