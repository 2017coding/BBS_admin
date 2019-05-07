<template>
  <div
    class="page-filter"
    :class="className"
  >
    <div
      v-for="(item, index) in getConfigList()"
      :key="index"
      class="filter-item"
    >
      <!-- <label class="filter-label" v-if="item.type !== 'button'">{{item.key}}</label> -->
      <!-- 输入框 -->
      <el-input
        v-if="item.type === 'input'"
        v-model="searchQuery[item.value]"
        :class="`filter-${item.type}`"
        :type="item.type"
        :disabled="item.disabled"
        :clearable="item.clearable === false ? item.clearable : true"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="searchQuery[item.value]"
        :class="`filter-${item.type}`"
        :disabled="item.disabled"
        :clearable="item.clearable === false ? item.clearable : true"
        :filterable="item.filterable === false ? item.filterable : true"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.even)"
      >
        <el-option
          v-for="(childItem, childIndex) in listTypeInfo[item.list]"
          :key="childIndex"
          :label="childItem.key"
          :value="childItem.value"
        />
      </el-select>
      <!-- 时间选择框 -->
      <el-time-select
        v-if="item.type === 'time'"
        v-model="searchQuery[item.value]"
        :class="`filter-${item.type}`"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable === false ? item.clearable : true"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
      />
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="searchQuery[item.value]"
        :class="`filter-${item.type}`"
        :picker-options="item.datePickerOptions || datePickerOptions"
        :type="item.dateType"
        :clearable="item.clearable === false ? item.clearable : true"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <!-- 按钮 -->
      <el-button
        v-else-if="item.type === 'button'"
        v-waves
        :class="`filter-${item.type}`"
        :type="item.btType"
        :icon="item.icon"
        @click="handleClick(item.event)"
      >
        {{ item.label }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFilter',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 相关列表
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 过滤器列表
    filterList: {
      type: Array
    },
    // 参数
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
      flag: 'inner', // 内 inner  外outside
      searchQuery: {}
    }
  },
  watch: {
    searchQuery: {
      handler: function (val) {
        // 传入参数修改，不派发
        if (this.flag === 'outside') {
          this.flag = 'inner'
          return
        }
        // 修改传入进来的参数
        this.$emit('update:query', { ...this.query, ...val })
      },
      deep: true // 深度监听
    },
    query (val) {
      this.flag = 'outside' // 标识为传入参数修改
      this.searchQuery = val
    }
  },
  mounted () {
    this.initParams()
  },
  methods: {
    initParams () {
      const obj = {}
      for (const key in this.query) {
        if (this.query[key]) {
          obj[key] = this.query[key]
        }
      }
      this.searchQuery = obj
    },
    // 获取列表
    getConfigList () {
      return this.filterList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show))
    },
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
    handleClick (event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style scoped>
</style>
