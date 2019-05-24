import marked from 'marked'

export default (value) => {
  if (!value) return
  const rendererMD = new marked.Renderer()
  // 基本设置
  marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  })
  return marked(value)
}
