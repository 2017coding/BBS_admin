<template>
  <div class="app-container" v-html="cnfg_companyinfo" style="height: 100%;width: 100%;"></div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {GetDataByIDApi} from '@/api/project/S0101A'
  export default {
    name: "index",
    data () {
      return {
        cnfg_companyinfo: ''
      }
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    mounted () {
      this.$api.getCompanyInfoApi({proj_id:this.projectInfo.proj_id}).then(res=>{
        if (res.success) {
          this.cnfg_companyinfo = this.$fn.useWhichData(res.content.data[0], 'cnfg_companyinfo', '')
        }
      })
    }
  }
</script>

<style scoped>

</style>
