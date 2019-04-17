<template>
  <div class="mavon-editor">
    <div class="header"></div>
    <mavon-editor class="editor" v-model="editorValue" :fontSize="'13px'" :placeholder="placeholder" :toolbars="toolbars" :subfield="true"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editorValue: '',
      placeholder: '那些值得记录或者分享的...',
      errPlaceholder: `1. 描述你的问题
                    2. 贴上相关代码 (请勿用图片代替代码)
                    3. 贴上报错信息
                    4 已经尝试过哪些方法仍然没解决 (附上相关链接)`,
      toolbars: {}
    }
  },
  mounted () {
    this.initToolbars()
  },
  methods: {
    initToolbars () {
      this.toolbars = {
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

<style scoped lang="scss">
  .mavon-editor{
    height: 100%;
    .editor{
      height: 100%;
    }
  }
</style>
