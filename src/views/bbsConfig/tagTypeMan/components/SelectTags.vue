<template>
  <el-select
    v-model="tags"
    multiple
    :size="size"
    :multiple-limit="limit"
    filterable
    :placeholder="placeholder"
  >
    <el-option
      v-for="item in tagData"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { getAllApi } from '@/api/bbsConfig/tagMan'
export default {
  name: 'SelectTags',
  props: {
    bindTags: {
      type: Array,
      default: () => {
        return []
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    limit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: '请选择标签'
    }
  },
  data () {
    return {
      flag: 'inner', // 内 inner  外outside
      tags: [],
      reqStatus: false,
      tagData: []
    }
  },
  watch: {
    bindTags: {
      handler: function (val) {
        this.flag = 'outside' // 标识为传入参数修改
        this.tags = val
      },
      deep: true, // 深度监听
      immediate: true
    },
    tags: {
      handler: function (val) {
        // 内部数据和外部不一样, 修改外部数据
        if (JSON.stringify(val) !== JSON.stringify(this.bindTags)) {
          this.$emit('update:bindTags', val)
          return
        }
        // 传入参数修改，不派发
        if (this.flag === 'outside') {
          this.flag = 'inner'
          return
        }
        // 修改传入进来的参数
        this.$emit('update:bindTags', val)
      },
      deep: true // 深度监听
    }
  },
  mounted () {
    this.getTags()
  },
  methods: {
    getTags () {
      if (this.reqStatus) return
      getAllApi().then(res => {
        if (res.success) {
          this.reqStatus = true
          this.tagData = res.content
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
