<template>
  <div class="app-container S0402A">
    <el-tabs tab-position="left" v-model="activeName">
      <el-tab-pane v-for="(item, index) in entpList" :key="index" :name="index + ''">
        <span slot="label">
          <img :src="item.entp_icon" style="height: 42px; margin-top: 5px; border-radius: 7px;" alt="icon">
          <!-- <i class="icon iconfont el-icon-flashlight"></i> -->
        </span>
        <ChildrenPage :entpId="item.entp_id" :entpCode="item.entp_code" v-if="tabShowList[index]"></ChildrenPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChildrenPage from './components/childrenPage'
export default {
  name: 'S0402A',
  components: {
    ChildrenPage
  },
  data () {
    return {
      activeName: '',
      tabShowList: [],
      entpList: []
    }
  },
  computed: {
    ...mapGetters([
      'projectInfo'
    ])
  },
  mounted () {
    this.initlistTypeInfo()
  },
  watch: {
    activeName (val) {
      // 让组件有一个懒加载
      this.tabShowList[+val] = true
    }
  },
  methods: {
    // 初始化查询相关数据
    initlistTypeInfo () {
      this.tabShowList = []
      // 得到所有的能耗类型列表
      this.$api.getEntpApi({proj_id: this.projectInfo.proj_id}).then(response => {
        this.entpList = response.content.data
        this.entpList.forEach(item => {
          item.value = item.entp_id
          item.key = item.entp_name

          // 初始化组件的懒加载
          this.tabShowList.push(false)
        })
      })
      .catch(() => {
        console.log('获取能耗类型失败')
      })
    }
  }
}
</script>

<style lang="scss">
  .S0402A{
    position: relative;
    padding: 20px 0px;
    padding-right: 30px;
    .el-tabs, .el-tabs__content, .el-tab-pane{
      height: 100%!important;
    }
  }
</style>
