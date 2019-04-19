<template>
  <el-form
    class="page-form"
    :class="className"
    :model="data"
    :rules="rules"
    ref="form"
    :label-width="labelWidth">
    <el-form-item
      v-for="(item, index) in getConfigList()"
      :key="index"
      :prop="item.value"
      :label="item.label"
      :class="item.className">
      <!-- solt -->
      <template v-if="item.type === 'slot'">
        <slot :name="item.value"></slot>
      </template>
      <!-- 普通输入框 -->
      <el-input
        v-if="item.type === 'input' || item.type === 'password'"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        v-model="data[item.value]">
      </el-input>
      <!-- 文本输入框 -->
      <el-input
        v-if="item.type === 'textarea'"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :autosize="{minRows: 2, maxRows: 10}"
        @focus="handleEvent(item.event)"
        v-model.trim="data[item.value]">
      </el-input>
      <!-- 计数器 -->
      <el-input-number
        v-if="item.type === 'inputNumber'"
        v-model="data[item.value]"
        @change="handleEvent(item.event)"
        size="small"
        :min="item.min"
        :max="item.max">
      </el-input-number>
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="data[item.value]"
        @change="handleEvent(item.event, data[item.value])"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)">
        <el-option v-for="(item ,index) in  listTypeInfo[item.list]" :key="index" :label="item.key" :value="item.value"></el-option>
      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="data[item.value]"
        :type="item.dateType"
        :clearable="item.clearable"
        :disabled="item.disabled"
        @focus="handleEvent(item.event)"
        :placeholder="getPlaceholder(item)">
      </el-date-picker>
      <!-- 信息展示框 -->
      <el-tag v-if="item.type === 'tag'">
        {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: data[item.value]}) || '-'}}
      </el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PageForm',
  props: {
    // 自定义类名
    className: {
      type: String
    },
    // 表单数据
    data: {
      type: Object
    },
    // 相关字段
    fieldList: {
      type: Array
    },
    // 验证规则
    rules: {
      type: Object
    },
    // 相关的列表
    listTypeInfo: {
      type: Object
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    refObj: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  watch: {
    data: {
      handler: function (val) {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    }
  },
  mounted () {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 获取字段列表
    getConfigList () {
      return this.fieldList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show))
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
    handleClickBt (event, data) {
      this.$emit('handleClickBt', event, data)
    }
  }
}
</script>

<style scoped>
</style>
