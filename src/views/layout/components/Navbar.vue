<template>
  <div class="navbar-container">
    <div class="left">
      <i
        :class="sidebar.opened ? 'el-icon-more toggle open' : 'el-icon-more toggle close'"
        @click="handleToggle"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="right">
      <!-- 天气信息的容器 -->
      <div
        id="tp-weather-widget"
        style="padding: 10px"
      />
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userInfo.name }}
          <span
            class="avatar"
            :style="`background-image: url(${userInfo.avatar || 'https://www.lyh.red/file/%E9%A6%96%E9%A1%B5%E8%BD%AE%E6%92%AD_20190418155210_g6fk/20190418160520_a4e7.jpg'})`"
          />
          <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in dropdownList"
            :key="index"
            :command="item.command"
          >
            {{ item.key }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
      <page-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      >
        <!-- 自定义插槽的使用 -->
        <template v-slot:form-avatar>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="formInfo.data.avatar"
              style="height: 30px;"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('selectAvatar')"
            >
              {{ formInfo.data.avatar ? '更换头像' : '选择头像' }}
            </el-button>
          </div>
        </template>
      </page-form>
    </page-dialog>
    <!-- 选择文件组件 -->
    <select-file
      v-if="selectFileInfo.visible"
      v-model="formInfo.data.avatar"
      :type="selectFileInfo.type"
      :visible.sync="selectFileInfo.visible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateApi } from '@/api/sysMan/userMan'
import Breadcrumb from './Breadcrumb' // 导航
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import SelectFile from '@/components/SelectFile'

// 显示天气的方法， 要在这个位置初始化
(function (T, h, i, n, k, P, a, g, e) {
  g = function () {
    P = h.createElement(i)
    a = h.getElementsByTagName(i)[0]
    P.src = k
    P.charset = 'utf-8'
    P.async = 1
    a.parentNode.insertBefore(P, a)
  }
  T['ThinkPageWeatherWidgetObject'] = n
  T[n] || (T[n] = function () { (T[n].q = T[n].q || []).push(arguments) })
  T[n].l = +new Date()
  if (T.attachEvent) {
    T.attachEvent('onload', g)
  } else {
    T.addEventListener('load', g, false)
  }
}(window, document, 'script', 'tpwidget', '//widget.seniverse.com/widget/chameleon.js'))

export default {
  components: {
    Breadcrumb,
    PageDialog,
    PageForm,
    SelectFile
  },
  data () {
    return {
      dropdownList: [
        { key: 'GitHub地址', command: 'GitHub' },
        { key: '个人信息', command: 'userInfo' },
        { key: '修改密码', command: 'updatePassword' },
        { key: '退出登录', command: 'loginOut' }
      ],
      // 相关列表
      listTypeInfo: {
        sexList: [
          { key: '女', value: 1 },
          { key: '男', value: 0 }
        ],
        accountTypeList: [
          { key: '手机用户', value: 0 },
          { key: '论坛用户', value: 1 },
          { key: '平台用户', value: 2 }
        ],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ]
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          account: '', // *用户账号
          password: '', // *用户密码
          name: '', // *用户昵称
          type: 2, // *用户类型: 0: 手机注册 1: 论坛注册 2: 管理平台添加
          sex: 0, // *性别: 0:男 1:女
          avatar: '', // 头像
          phone: '', // 手机号码
          wechat: '', // 微信
          qq: '', // qq
          email: '', // 邮箱
          desc: '', // 描述
          status: 1 // *状态: 0：停用，1：启用(默认为1)',
          // create_user: '', // 创建人
          // create_time: '', // 创建时间
          // update_user: '', // 修改人
          // update_time: '' // 修改时间
        },
        fieldList: [
          { label: '账号', value: 'account', type: 'tag', required: true },
          // {label: '密码', value: 'password', type: 'tag', required: true},
          { label: '昵称', value: 'name', type: 'input', required: true },
          { label: '性别', value: 'sex', type: 'select', list: 'sexList', required: true },
          { label: '头像', value: 'avatar', type: 'slot', className: 'el-form-block' },
          { label: '手机号码', value: 'phone', type: 'input' },
          { label: '微信', value: 'wechat', type: 'input' },
          { label: 'QQ', value: 'qq', type: 'input' },
          { label: '邮箱', value: 'email', type: 'input' },
          { label: '描述', value: 'desc', type: 'textarea', className: 'el-form-block' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          userInfo: '个人信息',
          updatePassword: '修改密码'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '取消', type: '', icon: '', event: 'close', show: true },
          { label: '修改', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
      },
      // 选择文件组件相关参数
      selectFileInfo: {
        type: 2,
        visible: false,
        value: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  mounted () {
    this.initWeather()
    this.initRules()
  },
  methods: {
    // 初始化验证
    initRules () {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    // 使用天气
    initWeather () {
      // 方法存在开始加载
      if (typeof tpwidget === 'function') {
        tpwidget('init', {
          'flavor': 'slim',
          'location': 'WX4FBXXFKE4F',
          'geolocation': 'enabled',
          'language': 'auto',
          'unit': 'c',
          'theme': 'chameleon',
          'container': 'tp-weather-widget',
          'bubble': 'enabled',
          'alarmType': 'badge',
          'color': '#C6C6C6',
          'uid': 'UBBB8DBE07',
          'hash': '6dda6603c46080d47f2c51d061c86bba'
        })
        tpwidget('show')
      }
    },
    // 切换菜单
    handleToggle () {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand (command) {
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      switch (command) {
        case 'GitHub':
          this.$fn.openWindow('https://github.com/2017coding/BBS_admin')
          break
        case 'userInfo':
          dialogInfo.type = command
          dialogInfo.visible = true
          // 显示信息
          for (const key in this.userInfo) {
          // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = this.userInfo[key]
            }
          }
          break
        case 'updatePassword':
          break
        case 'loginOut':
          this.$store.dispatch('user/loginOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
          break
      }
    },
    // 按钮点击
    handleClick (event, data) {
      const dialogInfo = this.dialogInfo
      switch (event) {
      // 弹窗点击关闭
        case 'close':
          dialogInfo.visible = false
          break
        case 'save':
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const api = updateApi; const params = this.formInfo.data
              params.password = '123456'
              dialogInfo.btLoading = true
              this.$handleAPI('update', api, params).then(res => {
                if (res.success) {
                  dialogInfo.visible = false
                  // 设置userInfo
                  this.$store.commit('user/SET_USERINFO', JSON.parse(JSON.stringify(params)))
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        case 'selectAvatar':
          this.selectFileInfo.visible = true
          break
      }
    },
    // 触发事件
    handleEvent (event, data) {
      // switch (event) {
      // }
    }
  }
}
</script>

<style lang="scss">
.slot-avatar{
  height: 40px;
  display: flex;
  align-items: center;
  img{
    padding-right: 10px;
  }
}
</style>

<style scoped lang="scss">
@import '@/common/style/base.scss';
@import '@/common/style/mixin.scss';
  .navbar-container{
    position: relative;
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    height: 50px;
    background: white;
    &::after{
      @include border-1px();
    }
    .left, .right{
      display: flex;
      align-items: center;
    }
    .left{
      .toggle{
        transform: rotate(90deg);
        padding: 5px 10px;
        color: rgb(130, 130, 130);
        font-size: 24px;
        cursor: pointer;
        transition: transform .3s linear;
      }
      .open{
        transform: rotate(0deg);
      }
      .close{
        transform: rotate(90deg);
      }
    }
    .right{
      cursor: pointer;
      .tp-weather-widget{
        padding-right: 20px;
      }
      .el-dropdown-link{
        display: flex;
        align-items: center;
        color: $g_theme;
        padding-top: 3px;
        font-size: 13px;
      }
      .avatar{
        margin-left: 10px;
        cursor: pointer;
        display: inline-block;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
      }
    }
  }
</style>
