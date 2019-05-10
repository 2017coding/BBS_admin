
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
function getProxy (path, type) {
  if (path === '/api') {
    switch (type) {
      case 'localhost':
        return 'http://localhost:1313'
      case 'service':
        return 'https://www.lyh.red'
    }
  }
}
module.exports = {
  publicPath: './',
  outputDir: 'admin',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    host: 'localhost',
    port: 2020,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: getProxy('/api', process.env.VUE_APP_TYPE),
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  chainWebpack: config => {
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', resolve('src'))
      .end()
    // 图片压缩
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  }
}
