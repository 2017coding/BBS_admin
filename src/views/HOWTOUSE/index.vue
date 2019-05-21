<template>
  <div class="HOWTOUSE markdown" v-html="marked(init())" />
</template>

<script>
import marked from '@/common/js/marked'

export default {
  data () {
    return {
      marked
    }
  },
  mounted () {
    document.querySelector('.HOWTOUSE').addEventListener('click', e => {
      // 阻止默认事件
      e.preventDefault()
      // 定义a标签跳转规则
      if (e.target.nodeName === 'A') {
        this.$fn.openWindow(e.target.href)
      }
    })
  },
  methods: {
    init () {
      return `
# 关于 #
## shift + F11 开启全屏模式 ##
## github地址 ##

 - [管理平台][1] （建设中）
 - [论坛][2] （建设中）
 - [node服务][3] （建设中）

# 文件库 #
## 图片管理 ##
用户可设置相关文件夹，将相关图片按文件分类上传到服务器，用于管理系统其他模块图片配置
## 文件管理 ##
用户可设置相关文件夹，将相关文件按文件分类上传到服务器，用于管理系统其他模块文件配置
# 论坛设置 #
[去论坛看看][4] （建设中）
## 轮播管理 ##
论坛端主页的轮播管理
## 标签类型管理 ##
用于论坛端
## 标签管理 ##
用于论坛端
# 系统管理 #
## 用户管理页面 ##
### 查询 ###

 - 可以查询到当前用户所创建的用户
 - 可以查询到创建的用户创建的用户
 - 无限分级
### 创建用户 ###
创新新用户
### 编辑用户 ###
对用户进行编辑操作
### 删除用户 ###
 
 - 当前用户存在创建用户，删除时需要先将创建的用户转移给其他用户（非自己的子集用户）
 - 当前用户不存在创建用户，可直接删除
## 角色管理页面 ##
### 创建角色 ###
角色创建在当前选中角色的下级
### 编辑角色 ###
对角色基本信息进行编辑操作
### 删除角色 ###
删除当前角色
### 绑定用户 ###
将用户绑定在当前角色，用户将拥有当前角色的权限
## 分配权限 ##
 - 左边树状分配菜单权限，右边表格分配数据权限
 - 给角色分配权限的时候，只能在当前所属上级的角色所拥有的权限中进行分配
 - 测试角色只包含一些不影响页面功能的数据权限

## 菜单管理 ##
管理员可操作，用于配置菜单和数据权限
## 系统日志 ##
记录用户登陆和基本操作信息


  [1]: https://github.com/2017coding/BBS_admin
  [2]: https://github.com/2017coding/BBS
  [3]: https://github.com/2017coding/BBS_node
  [4]: https://lyh.red/bbs/
      `
    }
  }
}
</script>

<style lang="scss">
  .HOWTOUSE{
    padding: 20px;
  //   h1, h2, h3, h4{
  //     padding: 10px;
  //   }
  //   h1{
  //     margin: 20px 0;
  //     margin-bottom: 10px;
  //     font-size: 24px;
  //     border-bottom: 1px solid rgb(200, 200, 200);
  //   }
  //   h2{
  //     font-size: 18px;
  //   }
  //   h3{
  //     font-size: 16px;
  //   }
  //   p{
  //     padding: 5px;
  //     color: rgb(100, 100, 100);
  //   }
  //   a{
  //     color: red;
  //     text-decoration: underline;
  //   }
  }
</style>
