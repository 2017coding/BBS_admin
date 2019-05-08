<template>
  <div class="mavon-editor">
    <div class="header" />
    <mavon-editor
      v-model="editorValue"
      class="editor"
      :style="`max-height: ${maxHeight}`"
      :font-size="'13px'"
      :placeholder="placeholder"
      :toolbars="initToolbars()"
      :subfield="true"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: '那些值得记录或者分享的...'
    },
    maxHeight: {
      type: String,
      default: '500px'
    }
  },
  data () {
    return {
      flag: 'inner', // 内 inner  外outside
      editorValue: '',
      errPlaceholder: `1. 描述你的问题
                    2. 贴上相关代码 (请勿用图片代替代码)
                    3. 贴上报错信息
                    4 已经尝试过哪些方法仍然没解决 (附上相关链接)`
    }
  },
  watch: {
    editorValue (val) {
      // 传入参数修改，不派发
      if (this.flag === 'outside') {
        this.flag = 'inner'
        return
      }
      this.$emit('update:value', val)
    },
    value: {
      handler: function (val) {
        this.flag = 'outside' // 标识为传入参数修改
        this.editorValue = val
      },
      immediate: true
    }
  },
  methods: {
    initToolbars () {
      return {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        // underline: true, // 下划线
        // strikethrough: true, // 中划线
        // mark: true, // 标记
        // superscript: true, // 上角标
        // subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        // htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        // undo: true, // 上一步
        // redo: true, // 下一步
        // trash: true, // 清空
        // save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        // navigation: true, // 导航目录
        /* 2.1.8 */
        // alignleft: true, // 左对齐
        // aligncenter: true, // 居中
        // alignright: true, // 右对齐
        /* 2.2.1 */
        // subfield: true, // 单双栏模式
        preview: true // 预览
      }
    }
  }
}
</script>

<style lang="scss">
.v-note-wrapper{
  .shadow{
    border: 1px solid rgb(224, 224, 224)!important;
    box-shadow: none!important;
  }
  .v-note-op{
    // height: 30px!important;
    // min-height: 30px!important;
    .v-left-item, .v-right-item{
      // height: 30px!important;
      // min-height: 30px!important;
      .op-icon{
        // width: 20px!important;
        // height: 20px!important;
        color: rgb(150, 150, 150)!important;
      }
    }
  }
}
.v-note-help-wrapper{
  z-index: 9999!important;
}
</style>

<style scoped lang="scss">
  .mavon-editor{
    height: 100%;
    .editor{
      height: 100%;
    }
  }
</style>
