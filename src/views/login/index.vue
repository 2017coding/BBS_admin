<template>
  <div class="login-container">
    <div class="ground-glass"></div>
    <el-form ref="form" :model="formInfo.data" :rules="formInfo.rules" class="login-form">
      <div class="title">
        <!-- <p class="logo">
          <span class="LLL">LLL</span>
          <span class="yh">yh</span>
        </p> -->
        <p class="name">{{$config.SYSTEMNAME}}</p>
      </div>
      <el-form-item prop="account">
        <el-input
          type="text"
          prefix-icon="el-icon-people_fill"
          v-model.trim="formInfo.data.account"
          @keyup.enter.native="handleLogin()"
          placeholder="请输入账号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          prefix-icon="el-icon-lock_fill"
          v-model.trim="formInfo.data.password"
          @keyup.enter.native="handleLogin()"
          placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <div class="remember">
        <el-checkbox v-model="formInfo.remember" style="color: rgb(100, 100, 100)">记住密码</el-checkbox>
      </div>
      <el-form-item>
        <el-button :loading="buttonInfo.btLoading" type="primary" class="login-bt" @click="handleLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginApi } from '@/api/user'
export default {
  data () {
    return {
      formInfo: {
        remember: false, // 记住密码
        // 表单参数
        data: {
          account: 'test',
          password: '123456',
          type: 2 // 平台用户
        },
        // 验证规则
        rules: {
        }
      },
      buttonInfo: {
        btLoading: false
      }
    }
  },
  watch: {
    'formInfo.remember' (val) {
      console.log(val)
    }
  },
  created () {
    this.initRemember()
  },
  methods: {
    // 初始化记住选择
    initRemember (remember) {
      let formInfo = this.formInfo,
        data = formInfo.data
      // 登录成功进入这里
      if (remember === true) {
        localStorage.setItem('remember', formInfo.remember)
        localStorage.setItem('account', data.account)
        localStorage.setItem('password', data.password)
      } else if (remember === false) {
        localStorage.setItem('remember', formInfo.remember)
        localStorage.setItem('account', '')
        localStorage.setItem('password', '')
      }
      // 项目初始化进入这里
      if (localStorage.getItem('remember') === 'true') {
        formInfo.remember = true
        data.account = localStorage.getItem('account')
        data.password = localStorage.getItem('password')
      } else {
        // data.account = ''
        // data.password = ''
        localStorage.removeItem('remember')
        localStorage.removeItem('account')
        localStorage.removeItem('password')
      }
    },
    handleLogin () {
      this.$refs.form.validate(valid => {
        this.buttonInfo.btLoading = true
        loginApi(this.formInfo.data).then(res => {
          if (res.success) {
            // 登录成功后，对账号密码的操作
            this.initRemember(this.formInfo.remember)
            // 记住cookie
            this.$store.dispatch('user/setToken', res.token)
            // 记住用户信息
            this.$store.dispatch('user/setUserInfo', res.content.data).then(() => {
              this.$router.push('/')
            })
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: res.success ? 'success' : 'error',
              duration: 3500
            })
          }
          this.buttonInfo.btLoading = false
        }).catch(() => {
          this.buttonInfo.btLoading = false
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/common/style/base.scss';
@import '@/common/style/mixin.scss';
  .login-container{
    @include center('vertical', true);
    position: relative;
    z-index: 1;
    .ground-glass{
      background: url('./image/bg.jpg') no-repeat;
      background-size: cover;
      background-position: center center;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      // filter: blur(5px);
      z-index: -1;
    }
    .login-form{
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 30px 100px;
      width: 40%;
      min-width: 500px;
      background: rgba(255, 255, 255, .5);
      overflow: hidden;
      border-radius: 8px;
      &::after{
        content: '';
        background: url('./image/bg.jpg') no-repeat fixed;
        background-size: cover;
        background-position: center center;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        filter: blur(5px);
        z-index: -1;
      }
      .title{
        @include center('vertical', true);
        align-items: flex-end;
        margin-bottom: 60px;
        .logo{
          font-size: 0;
          cursor: pointer;
          padding-right: 2px;
          .LLL, .yh{
            font-weight: bold;
            font-size: 54px;
          }
          .LLL{
            color: rgb(100, 100, 100);
          }
          .yh{
            color: $g_theme;
          }
        }
        .name{
          font-size: 40px;
          // font-size: 30px;
          font-weight: bold;
          letter-spacing: 2px;
          color: $g_theme;
        }
      }
      .remember{
        margin-bottom: 20px;
      }
      .login-bt{
        width: 100%;
        // font-weight: bold;
        // letter-spacing: 10px;
      }
    }
  }
</style>
