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
      editorValue: ''
    }
  },
  watch: {
    editorValue (val) {
      // 内部数据和外部不一样, 修改外部数据
      if (val !== this.value) {
        this.$emit('update:value', val)
        return
      }
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
      }
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
$theme: red;
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
.v-note-show .v-show-content{
  font-size: 15px;
  color:#333;
  background:#fff;
  font-family: Helvetica, Arial, "PingFang SC", "Microsoft YaHei", "WenQuanYi Micro Hei", "tohoma,sans-serif";
  h1 {
    font-size: 2.2em;
    font-weight: 700;
    line-height: 1.1;
    padding-top: 16px;
    margin-bottom: 4px;
  }
  h2, h3, h4, h5, h6 {
    line-height: 1.5em;
    margin-top: 2.2em;
    margin-bottom: 4px;
  }
  h2 {
    font-size: 1.4em;
    margin: 40px 10px 20px 0;
    font-weight: 700;
    line-height: 1.4;
  }
  h3 {
    font-weight: 700;
    font-size: 1.2em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px;
  }
  h4 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px
  }
  h5, h6 {
    font-size: .9em;
  }
  h5 {
    font-weight: bold;
    text-transform: uppercase;
  }
  h6 {
    font-weight: normal;
    color: #AAA;
  }
  img {
    width: 100%;
    border-radius: 5px;
    display: block;
    margin-bottom: 15px;
    height: auto;
  }
  dl, ol, ul {
    margin-top: 12px;
    margin-bottom: 20px;
    padding-left: 5%;
    line-height: 1.8;
  }
  p {
    padding: 0;
    line-height: 1.8;
  }
  a {
    color: $theme;
    text-decoration: underline;
    opacity: .8;
  }
  a:hover {
    color: $theme;
    opacity: 1;
  }
  a:focus {
    outline-offset: -2px;
  }
  blockquote {
    font-size: 1em;
    font-style: normal;
    padding: 10px 10px;
    margin: 0 0 15px;
    position: relative;
    line-height: 1.8;
    text-indent: 0;
    border: none;
    background: #F6F6F6;
    color: #555;
    border-left: 2px solid $theme;
  }
  strong, dfn {
    font-weight: 700;
  }
  em, dfn {
    font-style: italic;
    font-weight: 400;
  }
  del {
    text-decoration: line-through;
  }
  pre {
    max-height: 600px;
    overflow: auto;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857;
    word-break: break-all;
    word-wrap: break-word;
    border-radius: 4px;
    white-space: pre-wrap;
    display: block;
    background: #f8f8f8;
    padding: 10px 20px;
    border: none;
    margin-bottom: 25px;
    color: #666;
    font-family: Courier, sans-serif;
  }
  code {
    // color: $theme;
    border-radius: 4px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    padding: 2px 4px;
    font-size: 90%;
  }
  p > code {
    color: $theme;
    font-size: .95em;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
  }
  figure {
    margin: 1em 0;
  }
  figcaption {
    font-size: 0.75em;
    padding:0.5em 2em;
    margin-bottom: 2em;
  }
  figure img {
    margin-bottom: 0px;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  ol p, ul p {
    margin-bottom: 0px;
  }
  li {
    margin-bottom: 0.75em;
    margin-top: 0.75em;
    list-style: inherit;
  }
  ol#footnotes {
    font-size: 0.95em;
    padding-top: 1em;
    margin-top: 1em;
    margin-left: 0;
    border-top: 1px solid #eaeaea;
    counter-reset: footer-counter;
    list-style: none;
    color: #555;
    padding-left: 5%;
    margin: 20px 0;
  }
  ol#footnotes li {
    margin-bottom: 10px;
    margin-left: 16px;
    font-weight: 400;
    line-height: 2;
    list-style-type: none;
  }
  ol#footnotes li:before {
    content: counter(footer-counter)". ";
    counter-increment: footer-counter;
    font-weight: 800;
    font-size: .95em;
  }
  @keyframes highfade {
    0% {
        background-color: none;
    }
    20% {
        background-color: yellow;
    }
    100% {
        background-color: none;
    }
  }
  @-webkit-keyframes highfade {
    0% {
        background-color: none;
    }
    20% {
        background-color: yellow;
    }
    100% {
        background-color: none;
    }
  }
  a:target, ol#footnotes li:target, sup a:target {
    animation-name: highfade;
    animation-duration: 2s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
    -webkit-animation-name: highfade;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-timing-function: ease-in-out;
  }
  a:target {
    border:0;
    outline: 0;
    animation-iteration-count: 1;
    -webkit-animation-timing-function: ease-in-out;
  }
  a:target {
    border:0;
    outline: 0;
    // tion-iteration-count: 1;
    -webkit-animation-timing-function: ease-in-out;
  }
  a:target {
    border:0;
    outline: 0;
  }
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
