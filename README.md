
## 代码结构
```
├── admin                      // 打包产出文件
├── node_module                // npm加载所需的项目依赖模块
├── public                     // 静态入口
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体 图片等静态资源
│   ├── common                 // 全局公用配置
│   │   ├── config             // 配置全局路由权限和错误捕获
│   │   ├── mixin              // 一些vue公用的mixin
│   │   ├── js                 // 编写公有的方法
│   │   └── style              // 编写公有的样式
│   ├── components             // 全局公用组件
│   ├── directive              // 自定义指令
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── vue.config.js              // vue-cli@3.0+ 配置文件
└── package.json               // package.json
```


## 功能相关介绍
|模块|功能|页面编码|描述|
|:---|:--|:------|:---|
|登录|登录|login|菜单中不显示|
|401|401|401|角色无访问权限时进入这个页面|
|404|404|404|访问菜单不存在时进入这个页面|
|首页|首页|home||
|运维中心||opsCenter||
|-|问答管理|questionMan||
|-|专栏管理|blogMan||
|-|文章管理|articleMan||
|-|讲堂管理|liveMan||
|-|活动管理|activityMan||
|-|广告位|advertising||
|工作流||workflow||
|-|流程设计|processDesign||
|-|业务管理|businessMan||
|-|已办事项|finishedItems||
|-|未办事项|unfinishedItems||
|文件库||library||
|-|图片管理|imgMan||
|-|文件管理|fileMan||
|论坛配置||bbsConfig||
|-|轮播|carousel||
|-|技术频道|techSquare||
|-|通知|notices||
|-|标签类型管理|tagTypeMan||
|-|标签管理|tagMan||
|系统管理||sysMan||
|-|用户管理|userMan||
|-|角色管理|roleMan||
|-|菜单管理|menuMan||
|-|区域管理|areaMan||
|-|图表配置|chartConfig||
|-|系统日志|log||

## 基本业务分析