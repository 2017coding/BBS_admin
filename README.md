# vue

> ,

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


├── build                      // 构建相关  
├── config                     // 配置相关
├── node_module                // npm加载所需的项目依赖模块
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体 图片等静态资源
│   ├── common                 // 全局公用配置
│   │   ├── config             // 配置全局路由权限和错误捕获
│   │   ├── js                 // 编写公有的方法
│   │   └── style              // 编写公有的样式
│   ├── components             // 全局公用组件
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   └── HT                     // HT组件的配置
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── index.html                 // html模板
└── package.json               // package.json