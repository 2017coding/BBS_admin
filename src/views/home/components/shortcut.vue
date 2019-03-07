<template>
  <div class="shortcut">
    <p class="title">{{$fn.useWhichData(data, 'title', '快捷功能')}}</p>
    <p class="no-list" v-if="!data.list || (data.list && data.list.length === 0)">暂无{{$fn.useWhichData(data, 'title', '功能导航')}}</p>
    <ul class="list">
      <li v-for="(item, index) in $fn.useWhichData(data, 'list', []) || []" :class="'item ' + $fn.useWhichData(data, 'type', 'func')">
        <span :style="$fn.useWhichData(data, 'type', 'func') === 'func' ? 'margin-bottom: 10px;' : ''">
          <i :class="'icon-' + $fn.useWhichData(data, 'type', 'func') + ' ' + $fn.useWhichData(item, 'icon', 'el-icon-loading')"
              :style="getStyle($fn.useWhichData(data, 'type', 'func'), index)"
              @click="goto($fn.useWhichData(item, 'path', ''))">
          </i>
        </span>
        <span class="name" @click="goto($fn.useWhichData(item, 'path', ''))">{{$fn.useWhichData(item, 'name', '快捷模块')}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object
      }
    },
    data () {
      return {
        rgbList: [
          [3,150,255],
          [234,84,85],
          [115,103,240],
          [50,204,188],
          [248,216,0],
          [159,68,211],
          [98,58,162],
          [245,85,85],
          [140,27,171],
          [67,203,255]
        ]
      }
    },
    methods: {
      getStyle (type, index) {
        let rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)],
            rgbList = this.rgbList,
            color = rgbList[index] || rgb
        if (type === 'func') {
          return 'background: rgb(' + color.join(',') + ')'
        } else {
          return 'color: rgb(' + color.join(',') + ')'
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
  .shortcut{
    min-height: 33.33%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    .title{
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      .item{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 0;
        width: 25%;
        .icon-func, .icon-table, .name{
          cursor: pointer;
        }
      }
      .func{
        flex-direction: column;
      }
    }
    .icon-func{
      padding: 6px;
      font-size: 24px;
      color: white;
      border-radius: 50%;
    }
    .icon-table{
      font-size: 24px;
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