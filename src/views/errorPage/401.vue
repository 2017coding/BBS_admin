<template>
  <div class="errPage-container">
    <el-button
      icon="arrow-left"
      class="pan-back-btn"
      @click="back"
    >
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous text-line">
          Oops!
        </h1>
        <h2 class="text-line">
          你没有权限去该页面
        </h2>
        <h6 class="text-line">
          如有问题请联系管理员
        </h6>
        <ul class="list-unstyled text-line">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/">
              回首页
            </router-link>
          </li>
          <li class="link-type">
            <a href="https://www.taobao.com/">逛逛淘宝</a>
          </li>
          <li class="link-type">
            <a href="https://github.com/">刷刷github</a>
          </li>
          <li>
            <a
              href="#"
              @click.prevent="dialogVisible=true"
            >点我看图</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        >
      </el-col>
    </el-row>
    <el-dialog
      title="随便看"
      :visible.sync="dialogVisible"
    >
      <img
        class="pan-img"
        :src="ewizardClap"
      >
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/views/errorPage/img/401.gif'

export default {
  name: 'Page401',
  data () {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back () {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-2)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .text-line{
      padding: 5px 0px;
      li{
        padding: 5px 0px;
      }
    }
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
