<template>
  <el-card
    class="page-card"
    :class="className"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <span class="title">{{ title }}</span>
      <i
        :title="title"
        class="el-icon-info"
        style="float: right; padding: 3px 0; color: rgb(150, 150, 150)"
      />
    </div>
    <ul class="info">
      <li
        v-for="(item, index) in fieldList"
        :key="index"
        class="item"
      >
        <span
          class="label"
          :style="`width: ${lableWidth}; text-align: ${textAligin}`"
        >{{ item.label }}</span>
        <span class="value">{{ $fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: data[item.value]}) || '-' }}</span>
      </li>
    </ul>
  </el-card>
</template>

<script>
export default {
  props: {
    className: {
      type: String
    },
    title: {
      type: String
    },
    textAligin: {
      type: String,
      default: 'left'
    },
    lableWidth: {
      type: String,
      default: '100px'
    },
    data: {
      type: Object
    },
    fieldList: {
      type: Array
    },
    listTypeInfo: {
      type: Object
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/common/style/base.scss';
@import '@/common/style/mixin.scss';
  .page-card{
    .title{
      font-size: 16px;
      color: $g_theme;
    }
    .info{
      .item{
        padding: 7px;
        .label, .value{
          display: inline-block;
        }
        .label{
          font-size: 13px;
          color: rgb(150, 150, 150);
        }
        .value{
          padding-left: 10px;
          color: rgb(100, 100, 100);
        }
      }
    }
  }
</style>
