<template>
  <div class="page-filter">
    <div class="filter-item" v-for="(item, index) in filterList" :key="index">
      <!-- <label class="filter-label" v-if="item.type !== 'button'">{{item.key}}</label> -->
      <!-- 输入框 -->
      <el-input
        :class="`filter-${item.type}`"
        v-if="item.type === 'input'"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        v-model="searchQuery[item.value]">
      </el-input>
      <!-- 选择框 -->
      <el-select
        :class="`filter-${item.type}`"
        v-if="item.type === 'select'"
        v-model="searchQuery[item.value]"
        :disabled="item.disabled"
        @change="handleEvent(item.even)"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)">
        <el-option v-for="(item ,index) in  listTypeInfo[item.list]" :key="index" :label="item.key" :value="item.value"></el-option>
      </el-select>
      <!-- 时间选择框 -->
      <el-time-select
        :class="`filter-${item.type}`"
        v-if="item.type === 'time'"
        v-model="searchQuery[item.value]"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)">
      </el-time-select>
      <!-- 日期选择框 -->
      <el-date-picker
        :class="`filter-${item.type}`"
        v-if="item.type === 'date'"
        v-model="searchQuery[item.value]"
        :picker-options="item.datePickerOptions || datePickerOptions"
        :type="item.dateType"
        :clearable="item.clearable"
        :disabled="item.disabled"
        @focus="handleEvent(item.event)"
        :placeholder="getPlaceholder(item)">
      </el-date-picker>
      <!-- 按钮 -->
      <el-button
        :class="`filter-${item.type}`"
        v-else-if="item.type === 'button' && item.show"
        v-waves
        :type="item.btType"
        :icon="item.icon"
        @click="handleClickBt(item.event)">{{item.label}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFilter',
  props: {
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    filterList: {
      type: Array
    },
    query: {
      type: Object
    }
  },
  data () {
    return {
      // 时间相关设置
      datePickerOptions: {
        disabledDate (time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      searchQuery: {}
    }
  },
  watch: {
    searchQuery: {
      handler: function (val) {
        // 修改传入进来的参数
        this.$emit('update:query', val)
      },
      deep: true // 深度监听
    }
  },
  mounted () {
    this.searchQuery = JSON.parse(JSON.stringify(this.query))
  },
  methods: {
    // 得到placeholder的显示
    getPlaceholder (row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 绑定的相关事件
    handleEvent (evnet) {
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClickBt (event, data) {
      this.$emit('handleClickBt', event, data)
    }
  }
}
</script>

<style scoped>
</style>
