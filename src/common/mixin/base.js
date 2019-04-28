import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'dataPerms'
    ])
  },
  methods: {
    // 初始化数据权限
    _initDataPerms (code, list) {
      for (const item of list) {
        if (this.dataPerms.includes(`${code}:${item.event}`)) {
          item.show = true
        }
      }
    }
  }
}
