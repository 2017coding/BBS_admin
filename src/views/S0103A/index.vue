<template>
  <iframe :src="pdfUrl" frameborder="0" style="height: 100%;width: 100%;"></iframe>
  <!--<pdf src="http://image.cache.timepack.cn/nodejs.pdf"></pdf>-->
</template>

<script>
  /*import pdf from 'vue-pdf'*/
  import {mapGetters} from 'vuex'
import {GetDataByIDApi} from '@/api/project/S0103A'
  export default {
    /* components: {pdf},*/
    name: "index",
    data () {
      return {
        pdfUrl: ''
      }
    },
    computed: {
      ...mapGetters([
        'projectInfo'
      ])
    },
    mounted () {
      this.$api.getProjectBaseConfigApi({proj_id:this.projectInfo.proj_id}).then(res=>{
        if (res.success) {
          this.pdfUrl = this.$fn.useWhichData(res.content.data[0], 'cnfg_energyrule', '')
        }
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>
