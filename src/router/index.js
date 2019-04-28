import Vue from 'vue'
import Router from 'vue-router'

// 布局组件
// import Layout from '@/views/layout/index'

Vue.use(Router)

/**
 * 路由对象的key
 * path 路径
 * component 映射页面
 * name 路由名字 (唯一，不可重复，相当于唯一标识)
 * hidden 设置为true则加载菜单的时候不渲染这个路由
 * meta: { // 自定义参数，这里用来做菜单渲染
 *    title 菜单渲染显示的名字
 *    icon  菜单图标
 * }
 */

/**
 * 基础路由, 不被权限控制的
 */
export const baseRouter = [
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: '登录',
    hidden: true,
    meta: { title: '登录', icon: '' }
  },
  {
    path: '/retrieve',
    component: () => import('@/views/retrieve/index'),
    name: '找回密码',
    hidden: true,
    meta: { title: '找回密码', icon: '' }
  },
  // {
  //   id: 0,
  //   pid: -1,
  //   path: '',
  //   component: Layout,
  //   redirect: '/',
  //   meta: {title: '首页', icon: ''},
  //   children: [
  //     {
  //       path: '/',
  //       component: () => import('@/views/home/index'),
  //       name: 'home',
  //       meta: {title: '首页', icon: 'el-icon-homepage'},
  //       children: []
  //     }
  //   ]
  // },
  // 运维中心
  // {
  //   path: '/opsCenter',
  //   component: Layout,
  //   redirect: '/opsCenter/questionMan',
  //   meta: {title: '运维中心', icon: 'el-icon-addressbook'},
  //   children: [
  //     {
  //       path: '/questionMan',
  //       component: () => import('@/views/opsCenter/questionMan/index'),
  //       name: 'questionMan',
  //       meta: {title: '问答管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/blogMan',
  //       component: () => import('@/views/opsCenter/blogMan/index'),
  //       name: 'blogMan',
  //       meta: {title: '专栏管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/articleMan',
  //       component: () => import('@/views/opsCenter/articleMan/index'),
  //       name: 'articleMan',
  //       meta: {title: '文章管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/liveMan',
  //       component: () => import('@/views/opsCenter/liveMan/index'),
  //       name: 'liveMan',
  //       meta: {title: '讲堂管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/activityMan',
  //       component: () => import('@/views/opsCenter/activityMan/index'),
  //       name: 'activityMan',
  //       meta: {title: '活动管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/advertisingMan',
  //       component: () => import('@/views/opsCenter/advertisingMan/index'),
  //       name: 'advertisingMan',
  //       meta: {title: '广告位管理', icon: ''},
  //       children: []
  //     },
  //   ]
  // },
  // // 文件库
  // {
  //   path: '/library',
  //   component: Layout,
  //   redirect: '/library/imgMan',
  //   meta: {title: '文件库', icon: 'el-icon-workbench'},
  //   children: [
  //     {
  //       path: '/imgMan',
  //       component: () => import('@/views/library/imgMan/index'),
  //       name: 'imgMan',
  //       meta: {title: '图片管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/fileMan',
  //       component: () => import('@/views/library/fileMan/index'),
  //       name: 'fileMan',
  //       meta: {title: '文件管理', icon: ''},
  //       children: []
  //     }
  //   ]
  // },
  // // 论坛配置
  // {
  //   path: '/bbsConfig',
  //   component: Layout,
  //   redirect: '/bbsConfig/carousel',
  //   meta: {title: '论坛配置', icon: 'el-icon-label'},
  //   children: [
  //     {
  //       path: '/carousel',
  //       component: () => import('@/views/bbsConfig/carousel/index'),
  //       name: 'carousel',
  //       meta: {title: '首页轮播', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/techSquare',
  //       component: () => import('@/views/bbsConfig/techSquare/index'),
  //       name: 'techSquare',
  //       meta: {title: '技术频道', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/notices',
  //       component: () => import('@/views/bbsConfig/notices/index'),
  //       name: 'notices',
  //       meta: {title: '通知', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/tagTypeMan',
  //       component: () => import('@/views/bbsConfig/tagTypeMan/index'),
  //       name: 'tagTypeMan',
  //       meta: {title: '标签类型管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/tagMan',
  //       component: () => import('@/views/bbsConfig/tagMan/index'),
  //       name: 'tagMan',
  //       meta: {title: '标签管理', icon: ''},
  //       children: []
  //     }
  //   ]
  // },
  // // 系统管理
  // {
  //   path: '/sysMan',
  //   component: Layout,
  //   redirect: '/sysMan/userMan',
  //   meta: {title: '系统管理', icon: 'el-icon-setup'},
  //   children: [
  //     {
  //       path: '/userMan',
  //       component: () => import('@/views/sysMan/userMan/index'),
  //       name: 'userMan',
  //       meta: {title: '用户管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/roleMan',
  //       component: () => import('@/views/sysMan/roleMan/index'),
  //       name: 'roleMan',
  //       meta: {title: '角色管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/menuMan',
  //       component: () => import('@/views/sysMan/menuMan/index'),
  //       name: 'menuMan',
  //       meta: {title: '菜单管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/areaMan',
  //       component: () => import('@/views/sysMan/areaMan/index'),
  //       name: 'areaMan',
  //       meta: {title: '区域管理', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/chartConfig',
  //       component: () => import('@/views/sysMan/chartConfig/index'),
  //       name: 'chartConfig',
  //       meta: {title: '图表配置', icon: ''},
  //       children: []
  //     },
  //     {
  //       path: '/log',
  //       component: () => import('@/views/sysMan/log/index'),
  //       name: 'log',
  //       meta: {title: '系统日志', icon: ''},
  //       children: []
  //     }
  //   ]
  // },
  // 错误页面定义
  {
    path: '/401',
    name: '401',
    hidden: true,
    meta: { title: '401', icon: '' },
    component: () => import('@/views/errorPage/401')
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    meta: { title: '404', icon: '' },
    component: () => import('@/views/errorPage/404')
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: baseRouter
})
