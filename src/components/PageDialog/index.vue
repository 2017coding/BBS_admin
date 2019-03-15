<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :width="width"
    :class="className">
    <el-form
      :model="formInfo.data"
      :rules="formInfo.rules"
      ref="form"
      :label-width="formInfo.labelWidth || '120px'">
      <el-form-item
        v-for="(item, index) in formInfo.fieldList"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :class="item.className">
        <!-- 普通输入框 -->
        <el-input
          v-if="item.type === 'input' || item.type === 'password'"
          :type="item.type"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          @focus="handleEvent(item.event)"
          v-model="formInfo.data[item.value]">
        </el-input>
        <!-- 文本输入框 -->
        <el-input
          v-if="item.type === 'textarea'"
          :type="item.type"
          :disabled="item.disabled"
          :placeholder="getPlaceholder(item)"
          :autosize="{minRows: 2, maxRows: 10}"
          @focus="handleEvent(item.event)"
          v-model.trim="formInfo.data[item.value]">
        </el-input>
        <!-- 选择框 -->
        <el-select
          v-if="item.type === 'select'"
          v-model="formInfo.data[item.value]"
          @change="handleEvent(item.event, formInfo.data[item.value])"
          :disabled="item.disabled"
          :clearable="item.clearable"
          :filterable="item.filterable"
          :placeholder="getPlaceholder(item)">
          <el-option v-for="(item ,index) in  listTypeInfo[item.list]" :key="index" :label="item.key" :value="item.value"></el-option>
        </el-select>
        <!-- 日期选择框 -->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="formInfo.data[item.value]"
          :type="item.dateType"
          :clearable="item.clearable"
          :disabled="item.disabled"
          @focus="handleEvent(item.event)"
          :placeholder="getPlaceholder(item)">
        </el-date-picker>
        <!-- 信息展示框 -->
        <el-tag v-if="item.type === 'tag'">
          {{$fn.getDataName({dataList: listTypeInfo[item.list], value: 'value', label: 'key', data: formInfo.data[item.value]})}}
        </el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="btList">
      <el-button
          v-for="(item, index) in btList"
          :key="index"
          :type="item.type"
          :icon="item.icon"
          v-waves
          @click="handleClickBt(item.event)"
          :disabled="item.disabled"
          :loading="item[item.type + 'Loading']">
          {{item.label}}
        </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PageDialog',
  props: {
    // 弹窗标题
    dialogTitle: {
      type: String
    },
    // 弹窗是否显示
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 弹窗宽度
    width: {
      type: String
    },
    // 弹窗class
    className: {
      type: String
    },
    // 表单配置
    formInfo: {
      type: Object,
      default: () => {
        return {data: {}}
      }
    },
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 操作栏配置
    btList: {
      type: Array
    }
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    visible (val) {
      if (val) return
      this.$emit('update:dialogVisible', val)
    },
    dialogVisible (val) {
      this.visible = this.dialogVisible
    }
  },
  mounted () {
    this.visible = this.dialogVisible
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
