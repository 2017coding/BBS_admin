<template>
  <div id="app">
    <div class="amap-wrapper">
      <div class="maplegend">
        <div><img src="../image/Aaddress1.png" alt=""><span>在建</span></div>
        <div><img src="../image/Baddress1.png" alt=""><span>运营</span></div>
        <div><img src="../image/red.png" alt=""><span>停运</span></div>
      </div>
      <div class="legendbg"></div>
      <el-amap class="amap-box"
               ref="map"
               :plugin="plugin"
               :center="center"
               :mapStyle="mapStyle"
               :zoom="zoom"
               :events="events"
               :vid="'amap-vue'">
        <el-amap-marker
          v-for="(marker,index) of markers"
          :position="marker.position"
          :events="marker.events"
          :visible="marker.visible"
          :vid="index"
          :icon="marker.icon"
          :key="index"
          :label="marker.label"
        >
        </el-amap-marker>
        <el-amap-info-window
          v-if="window"
          :position="window.position"
          :visible="window.visible"
        >

          <el-card class="box-card" :body-style="{background:'#00374F'}">
            <div slot="header" class="clearfix">
              <span>{{window.title}} </span>
              <el-tag v-if="window.proj_status===3" type="warning" size="mini">在建</el-tag>
              <el-tag v-else-if="window.proj_status===4" type="success" size="mini">运营</el-tag>
              <el-tag v-else-if="window.proj_status===5" type="danger" size="mini">停运</el-tag>
            </div>
            <div style="display: flex;justify-content: space-between;align-items: center;">
              <table>
                <tbody>
                <tr>
                  <td><span>当日用电量:&nbsp;</span><span>{{window.day_electricity>10000?Math.abs(window.day_electricity/10000).toFixed(2)+'万度':Math.abs(window.day_electricity).toFixed(2)+'度'}}</span></td>
                </tr>
                <tr>
                  <td><span>当月用电量:&nbsp;</span><span>{{window.month_electricity>10000?Math.abs(window.month_electricity/10000).toFixed(2)+'万度':Math.abs(window.month_electricity).toFixed(2)+'度'}}</span></td>
                </tr>
                <tr>
                  <td><span>当年用电量:&nbsp;</span><span>{{window.years_electricity>10000?Math.abs(window.years_electricity/10000).toFixed(2)+'万度':Math.abs(window.years_electricity).toFixed(2)+'度'}}</span></td>
                </tr>
               <!-- <tr>
                  <td><span>累计用电量:</span><span>{{window.addup_electricity>1000?(window.addup_electricity/1000).toFixed(2)+'MW':window.addup_electricity.toFixed(2)+'KW'}}</span></td>
                </tr>-->
                <tr>
                  <td><span>地区:&nbsp;</span><span>{{window.site}}</span></td>
                </tr>
                <tr><td style="visibility: hidden"> 累计用电量</td></tr>
                </tbody>
              </table>
              <div style="padding-left: 55px"><img style="width: 180px;height: 127px;" id="imagerFile"
                                                   :src="window.imgurl" alt="img"></div>
            </div>
            <div style="display: flex">
              <el-button
                style="float: right;background-color: #409eff;border-color: #409eff;"
                size="small"
                type="primary"
                icon="el-icon-d-arrow-right"
                @click="handleGo(window)">进入项目
              </el-button>
            </div>
          </el-card>
        </el-amap-info-window>
      </el-amap>
    </div>
  </div>
</template>
<script>
  // 引入接口
  import {GetDataByUidApi, GetquantityAPI} from '@/api/platform/map'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      let self = this;
      return {
        mapStyle: 'amap://styles/9a22cd3835e77b9a7cbf201ef9febe6e',
        zoom: 6,
        center: this.$config.MapCenter,
        events: {
          init (o) {
            setTimeout(() => {
              let cluster = new AMap.MarkerClusterer(o, self.markerRefs);
            }, 1000);
          }
        },
        plugin: [{
          pName: 'ToolBar',
          position: 'RT'
        }],
        markers: [],
        windows: [],
        window: '',
        markerRefs: []
      };
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted () {
      let markers = []
      let windows = []
      let self = this
      let data = {
        user_id: this.userInfo.user_id
      }
      // 根据用户类型获取地图上的点数据
      GetDataByUidApi(data).then(res => {
        if (res.success) {
          let num = res.content.data
          for (let i = 0; i < num.length; i++) {
            let item = num[i]
            item.visible = true
            let position = [item.proj_longitude, item.proj_latitude] // 经纬度
            let status = item.proj_status
            if (status == '3') {
              item.icon = 'Aaddress1'
            } else if (status == '4') {
              item.icon = 'Baddress1'
            } else if (status == '5') {
              item.icon = 'red'
            }
            markers.push({ // 点渲染
              position: position,
              icon: require('../image/' + item.icon + '.png'),
              events: {
                init (o) {
                  self.markerRefs.push(o)
                },
                click: () => {
                  self.windows.forEach(window => {
                    window.visible = false;
                  });
                  self.window = self.windows[i];
                  GetquantityAPI({proj_id:self.window.id}).then(res=>{
                    if (res.success){
                    let i=res.content.data[0]
                    let data={
                      day_electricity: i.r0P1_day||0,
                      month_electricity: i.r0P1_month||0,
                      years_electricity: i.r0P1_year||0,
                    }
                      Object.assign(self.window,data)
                      self.$nextTick(() => {
                        self.window.visible = true;
                      });
                    }
                  })
                }
              },
              visible: item.visible,
              label: {
                content: item.proj_name,
                offset: [15, 35]
              }
            })
            windows.push({  // 弹窗
              projectItemData:item,
              position: position,
              visible: false,
              title: item.proj_name,
              id: item.proj_id,
              /*day_electricity: item.r0P1_day||0,
              month_electricity: item.r0P1_month||0,
              years_electricity: item.r0P1_year||0,
              addup_electricity: item.r0P1_count||0,*/
              site: item.city,
              proj_status: item.proj_status,
              imgurl: item.proj_pic ||'http://img1.qunarzz.com/sight/p0/1609/7a/7ae8ee7831836095a3.water.jpg_200x200_36727f69.jpg'
             /* imgurl: "http://img1.qunarzz.com/sight/p0/1609/7a/7ae8ee7831836095a3.water.jpg_200x200_36727f69.jpg"*/
            })
          }
          this.markers = markers
          this.windows = windows
        }
      })


    },
    methods: {
      handleGo (data) {
        // 设置当前点击数据
        this.$store.dispatch('app/setprojectInfo', data.projectItemData).then(() => {
          this.$router.push('/sHome')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .BMap_pop {
    position: relative;
    z-index: 999;
    padding: 0;
    width: 420px;
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    text-align: left;
    color: #3786e2;
  }

  .BMap_pop .tit {
    margin: 0 0 12px 10px;
    height: 18px;
    line-height: 18px;
    border-left: 5px solid #3786e2;
    font-size: 16px;
    color: #3786e2;
    padding: 0;
  }

  .BMap_pop .tit span {
    padding-left: 10px;
  }

  .BMap_pop table tr td {
    border: 1px solid #207699;
    height: 36px;
    background: #00374F;
    padding: 0 10px;
    vertical-align: middle;
  }

  .BMap_pop table tr td:first-child {
    width: 150px;
  }

  .BMap_pop .cont {
    /* border-top: 1px solid #999; */
    overflow: hidden;
    margin-bottom: 5px;
  }

  .BMap_pop:after {
    content: '';
    display: table;
    clear: both;
    visibility: hidden;
    height: 0;
  }

  .BMap_pop .tanchu_txt {
    float: left;
    padding: 10px;
    width: 230px;
    margin-top: 20px;
  }

  .tanchu_txt a.BMap-detail {
    margin-top: 18px;
    height: 37px;
    line-height: 37px;
    padding-left: 50px;
    padding-right: 10px;
    display: inline-block;
    border: 1px solid #3786e2;
    color: #3786e2;
    font-size: 16px;
    background: url(../image/bt_big_xiangqing.png) no-repeat 15px center transparent;
    text-decoration: none;
    outline: none;
    cursor: pointer;
  }

  .BMap_pop .tanchu_txt {
    float: left;
    padding: 10px;
    width: 230px;
    margin-top: 20px;
  }

  .BMap_pop .dc_map {
    float: left;
    margin: 13px 0 0 5px;
    width: 140px;
    height: 90px;
    padding: 5px;
    /* border: 1px solid #999; */
  }

  .BMap_pop .dc_map img {
    width: 140px;
    height: 90px;
  }

  .amap-container img {
    max-width: none !important;
    max-height: none !important;
    vertical-align: middle;
    border: 0;
    margin-bottom: 10px;
  }

  .amap-wrapper {
    height: 1000px
  }

  .maplegend {
    position: absolute;
    top: 165px;
    right: 80px;
    width: 300px;
    height: 30px;
    z-index: 6;
  }

  .maplegend div {
    width: 90px;
    margin-left: 10px;
    float: left;
    color: #5ed5ff;
    font-weight: bold;
  }

  .maplegend img {
    height: 30px;
    vertical-align: middle;
    border: 0;
  }

  .legendbg {
    position: absolute;
    top: 160px;
    right: 92px;
    width: 300px;
    height: 40px;
    background: rgb(56, 128, 173);
    /*filter: alpha(Opacity=40);
    -moz-opacity: 0.4;*/
    opacity: 0.4;
    z-index: 5;
    -webkit-border-radius: 30px;
    /*-moz-border-radius: 30px;*/
  }

  .el-card {
    color: #ffffff;
    border: none;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
</style>
<style lang="scss">
  .amap-marker-label {
    font-size: 16px;
    border: 1px solid #26336D;
    background-color: #0E74A0;
    border-radius: 10px;
    color: #F4EA2A;
  }

  .amap-info-content {
    width: 428px;
    height: 297px;
    overflow: hidden;
    padding: 0;
    line-height: 2.3;
    background-color: #00374F;
    border: none;
  }

  .amap-info-sharp {
    background-image: url(../image/sharp.png);
  }



  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;

  }

  .box-card {
    width: 100%;
  }

  .el-card__header {
    color: #ffffff;
    background: #00374F;
    border-bottom: none;
  }
</style>
