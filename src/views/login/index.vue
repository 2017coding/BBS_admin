<template>
  <div class="app-container">
    <div class="ground-glass"></div>
    <div class="content">
      <el-form ref="form" :model="formInfo.data" :rules="formInfo.rules" class="login-form">
        <div class="title">
          <p class="logo">
            <span class="LLL">LLL</span>
            <span class="yh">yh</span>
          </p>
          <p class="name">{{$config.SYSTEMNAME}}</p>
        </div>
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-people_fill"
            v-model.trim="formInfo.data.username"
            @keyup.enter.native="_handleLogin()"
            placeholder="请输入账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock_fill"
            v-model.trim="formInfo.data.password"
            @keyup.enter.native="_handleLogin()"
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <div class="remember">
          <el-checkbox v-model="formInfo.remember" style="color: rgb(100, 100, 100)">记住密码</el-checkbox>
        </div>
        <el-form-item>
          <el-button :loading="buttonInfo.loading" type="primary" class="login-bt" @click="_handleLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formInfo: {
          remember: false, // 记住密码
          // 表单参数
          data: {
            username: '',
            password: ''
          },
          // 验证规则
          rules: {
          }
        },
        buttonInfo: {
          loading: false
        }
      }
    },
    methods: {
      // 初始化记住选择
      _initRemember (remember) {
        let form = this.formInfo.data
        // 登录成功进入这里
        if (remember === true) {
          localStorage.setItem('remember', this.remember)
          localStorage.setItem('username', form.username)
          localStorage.setItem('password', form.password)
        } else if (remember === false) {
          localStorage.setItem('remember', this.remember)
          localStorage.setItem('username', '')
          localStorage.setItem('password', '')
        }
        // 项目初始化进入这里
        if (localStorage.getItem('remember') === 'true') {
          this.formInfo.remember = true
          form.username = localStorage.getItem('username')
          form.password = localStorage.getItem('password')
        } else {
          form.username = ''
          form.password = ''
          localStorage.removeItem('remember')
          localStorage.removeItem('username')
          localStorage.removeItem('password')
        }
      },
      _handleLogin () {
      }
    }
  }
</script>

<style scoped lang="scss">
@import '@/common/style/base.scss';
@import '@/common/style/mixin.scss';
  .app-container{
    @include center('vertical', true);
    justify-content: flex-end;
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
    .content{
      @include center('vertical', true);
      position: relative;
      padding: 50px;
      width: 30%;
      min-width: 500px;
      height: 100%;
      background: rgba(255, 255, 255, .5);
      overflow: hidden;
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
    }
    .login-form{
      width: 100%;
      // margin-bottom: 40px;
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
          font-size: 30px;
          // font-weight: bold;
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
        letter-spacing: 10px;
      }
    }
  }
</style>