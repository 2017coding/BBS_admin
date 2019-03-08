import Vue from 'vue'
import Router from 'vue-router'

// 布局组件
import Layout from '@/views/layout/index'

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
 * 静态路由，不需要权限，所有人都有
 */
export const constantRouterMap = [
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: '登录',
    hidden: true,
    meta: {title: '登录', icon: ''}
  },
  // 首页
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: {title: '首页', icon: ''}
      }
    ]
  },
  // 运维中心
  {
    path: '/B04',
    component: Layout,
    redirect: '/B04/B0401',
    children: [
      {
        path: '/B0401',
        component: () => import('@/views/B04/B0401/index'),
        name: 'B0401',
        meta: {title: '问答管理', icon: ''}
      },
      {
        path: '/B0402',
        component: () => import('@/views/B04/B0402/index'),
        name: 'B0402',
        meta: {title: '专栏管理', icon: ''}
      },
      {
        path: '/B0403',
        component: () => import('@/views/B04/B0403/index'),
        name: 'B0403',
        meta: {title: '文章管理', icon: ''}
      },
      {
        path: '/B0404',
        component: () => import('@/views/B04/B0404/index'),
        name: 'B0404',
        meta: {title: '讲堂管理', icon: ''}
      },
      {
        path: '/B0405',
        component: () => import('@/views/B04/B0405/index'),
        name: 'B0405',
        meta: {title: '活动管理', icon: ''}
      }
    ]
  },
  // 文件库
  {
    path: '/B03',
    component: Layout,
    redirect: '/B03/B0301',
    children: [
      {
        path: '/B0301',
        component: () => import('@/views/B03/B0301/index'),
        name: 'B0301',
        meta: {title: '图片管理', icon: ''}
      },
      {
        path: '/B0302',
        component: () => import('@/views/B03/B0302/index'),
        name: 'B0302',
        meta: {title: '文件管理', icon: ''}
      }
    ]
  },
  // 论坛配置
  {
    path: '/B02',
    component: Layout,
    redirect: '/B02/B0201',
    children: [
      {
        path: '/B0201',
        component: () => import('@/views/B02/B0201/index'),
        name: 'B0201',
        meta: {title: '首页轮播', icon: ''}
      },
      {
        path: '/B0202',
        component: () => import('@/views/B02/B0202/index'),
        name: 'B0202',
        meta: {title: '技术频道', icon: ''}
      },
      {
        path: '/B0203',
        component: () => import('@/views/B02/B0203/index'),
        name: 'B0203',
        meta: {title: '提示语', icon: ''}
      },
      {
        path: '/B0204',
        component: () => import('@/views/B02/B0204/index'),
        name: 'B0204',
        meta: {title: '广告位', icon: ''}
      },
      {
        path: '/B0205',
        component: () => import('@/views/B02/B0205/index'),
        name: 'B0205',
        meta: {title: '讲座推荐', icon: ''}
      },
      {
        path: '/B0206',
        component: () => import('@/views/B02/B0206/index'),
        name: 'B0206',
        meta: {title: '活动推荐', icon: ''}
      },
      {
        path: '/B0207',
        component: () => import('@/views/B02/B0207/index'),
        name: 'B0207',
        meta: {title: '标签类型管理', icon: ''}
      },
      {
        path: '/B0208',
        component: () => import('@/views/B02/B0208/index'),
        name: 'B0208',
        meta: {title: '标签管理', icon: ''}
      }
    ]
  },
  // 系统管理
  {
    path: '/B01',
    component: Layout,
    redirect: '/B01/B0101',
    children: [
      {
        path: '/B0101',
        component: () => import('@/views/B01/B0101/index'),
        name: 'B0101',
        meta: {title: '用户管理', icon: ''}
      },
      {
        path: '/B0102',
        component: () => import('@/views/B01/B0102/index'),
        name: 'B0102',
        meta: {title: '角色管理', icon: ''}
      },
      {
        path: '/B0103',
        component: () => import('@/views/B01/B0103/index'),
        name: 'B0103',
        meta: {title: '菜单管理', icon: ''}
      },
      {
        path: '/B0104',
        component: () => import('@/views/B01/B0104/index'),
        name: 'B0104',
        meta: {title: '区域管理', icon: ''}
      },
      {
        path: '/B0105',
        component: () => import('@/views/B01/B0105/index'),
        name: 'B0105',
        meta: {title: '字典管理', icon: ''}
      },
      {
        path: '/B0106',
        component: () => import('@/views/B01/B0106/index'),
        name: 'B0106',
        meta: {title: '系统日志', icon: ''}
      }
    ]
  },
  // 错误页面定义
  {
    path: '/401',
    name: '401',
    hidden: true,
    meta: {title: '401', icon: ''},
    component: () => import('@/views/errorPage/401')
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    meta: {title: '404', icon: ''},
    component: () => import('@/views/errorPage/404')
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
