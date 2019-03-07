<template>
  <div>
    <transition
      name="fade"
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <div v-if="show" style="position: fixed;top: 137px;left: 0;height: 100%;">
        <el-card class="box-card" v-loading="card_loading">
          <div slot="header" class="clearfix">
            <el-col :span="6">
              <!--所属地区-->
              <!--<el-select v-model="query.dist_id" clearable placeholder="地区" size="small">
                <el-option
                  v-for="item in options_district"
                  :key="item.dist_id"
                  :label="item.dist_name"
                  :value="item.dist_id">
                </el-option>
              </el-select>-->
              <el-cascader
                size="small"
                placeholder="地区"
                expand-trigger="hover"
                :options="distidOptions"
                :show-all-levels="false"
                v-model="query.dist_id"
                clearable
                >
              </el-cascader>
            </el-col>
            <el-col :span="13" class="el-custom-left">
              <!--远程搜索-->
              <el-input
                size="small"
                placeholder="请输入项目"
                v-model="query.proj_name"
                clearable>
              </el-input>
            </el-col>
            <el-button class="el-custom-left" type="primary" icon="el-icon-search" size="small" @click="getList"></el-button>
          </div>

          <!--项目列表-->
          <ul>
            <li class="item border-bottom" v-for="item of list" :key="item.proj_id" @click="handleClick(item)">
              <!--<div class="item-img-wrapper">-->
              <img :src="item.proj_pic||'http://img1.qunarzz.com/sight/p0/1609/7a/7ae8ee7831836095a3.water.jpg_200x200_36727f69.jpg'" class="item-img">
              <!-- </div>-->
              <div class="item-info">
                <p class="item-title">
                  <el-tag v-if="item.proj_status===3" type="warning" size="mini">在建</el-tag>
                  <el-tag v-else-if="item.proj_status===4" type="success" size="mini">运营</el-tag>
                  <el-tag v-else-if="item.proj_status===5" type="danger" size="mini">停运</el-tag>
                  <el-button type="text" icon="el-icon-location">{{item.city}}</el-button>
                </p>
                <p class="item-desc">{{item.proj_name}}</p>
                <p class="item-content">{{item.proj_desc}}</p>
              </div>
            </li>
            <div style="height: 200px;"></div>
          </ul>
        </el-card>
      </div>
    </transition>

    <transition
      name="fade"
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutLeft"
    >
      <div v-if="!show">
        <div class="toogle_s_close" @mouseover="toggleSearch" icon="el-icon-arrow-right">
        </div>
      </div>
      <div v-else>
        <div class="toogle_s_open" @mouseover="toggleSearch" icon="el-icon-arrow-left">
        </div>
      </div>
    </transition>


  </div>

</template>
<script>
  // 引入接口
  import {GetDataListByCdAPI} from '@/api/platform/map'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        distidOptions: [],
        user_id:'',
        card_loading:false,
        options_district: [],
        query:{
          dist_id: [],
          proj_name: '',
          user_id: ''
        },
        list: [],
        show: false,
      }
    },
    mounted () {
      // 参数处理
      this.query.user_id = this.userInfo.user_id
      this.getArea()
      this.getList()
    },
    computed:{
      ...mapGetters([
      'userInfo'
      ])
    },
    methods: {
      getArea () {
        this.$api.getAreaTreeApi().then(res=>{
          if (res.success){
          // res.content.data.unshift({dist_id:0,dist_name:'全国'})
          this.distidOptions = res.content.data
          }
        })
      },
      handleClick (data) {
        this.$store.dispatch('app/setprojectInfo', data).then(() => {
          this.$router.push('/sHome')
        })
      },
      toggleSearch () {
        this.close = !this.close
        this.show = !this.show
      },
      // 获取项目列表
      getList () {
        this.card_loading = true
        let param = JSON.parse(JSON.stringify(this.query))
        // 选择了区域时，添加区域搜索条件
        param.dist_id = param.dist_id[1]
        GetDataListByCdAPI(param).then(res=>{
          this.card_loading = false
          if (res.success) {
          this.list = res.content.data
          } else {
            this.list = []
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
          }
        }).catch(()=>{
          this.card_loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .toogle_s_close {
    position: fixed;
    top: 137px;
    left: -9px;
    transition: all 1s;
    width: 40px;
    height: 100%;
    background: url(../image/extend-btn_close.png) no-repeat right top;
    background-size: 100% 100%;
  }

  .toogle_s_open {
    position: fixed;
    top: 137px;
    left: 375px;
    transition: all 1s;
    width: 40px;
    height: 100%;
    background: url(../image/extend-btn_open.png) no-repeat right top;
    background-size: 100% 100%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgb(200 , 200, 200);
  }
  .item:hover {
    margin-bottom: 18px;
    border-radius: 5px;
    box-shadow: 0 0 10px #00374F;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 375px;
    height: 100%;
    overflow: auto;
  }

  .title {
    margin-top: .2rem;
    line-height: .4rem;
    background: #eee;
    text-indent: .2rem
  }

  .item {
    display: flex;
    overflow: hidden;
    height: 100px;
    cursor: default;
  }

  .item-img {
    width: 100px;
    height: 100px;
    padding: .1rem;
    margin-right: 1.1rem;

  }

  .item-info {
    flex: 1;
    padding: .1rem;
    min-width: 0;
  }

  .item-title {
    line-height: 25px;
    font-size: .32rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-desc {
    line-height: 1.4rem;
    color: #000000;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-content {
    line-height: 1.4rem;

    color: #ccc;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .el-custom-left {
    margin-left: 10px;

  }
</style>
