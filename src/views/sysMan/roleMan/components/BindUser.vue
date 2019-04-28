<template>
  <div class="bind-user">
    <el-select
      v-model="bindUserList"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请输入用户名"
      :remote-method="handleSearchUser"
      :loading="loading"
    >
      <el-option
        v-for="item in userList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBindUserApi } from '@/api/sysMan/roleMan'
import { getAllApi } from '@/api/sysMan/userMan'

export default {
  props: {
    roleId: {
      type: Number
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      timerList: [],
      bindUserList: [],
      userList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    bindUserList (val) {
      this.$emit('update:params', { roleId: this.roleId, user: val })
    }
  },
  created () {
    this.initUserList().then(() => {
      this.getBindUser()
    })
  },
  methods: {
    initUserList () {
      return new Promise((resolve, reject) => {
        getAllApi().then(res => {
          if (res.success) {
            this.userList = res.content
            resolve()
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: res.success ? 'success' : 'error',
              duration: 2000
            })
            reject()
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    getBindUser () {
      getBindUserApi({ roleId: this.roleId }).then(res => {
        if (res.success) {
          this.bindUserList = res.content.map(item => {
            return item.id
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        }
      })
    },
    handleSearchUser (query) {
      if (query !== '') {
        this.loading = true
        // 防抖
        this.timerList.forEach(item => {
          clearTimeout(item)
        })
        this.timerList = []
        const timer = setTimeout(() => {
          this.loading = false
          getAllApi({ name: query, create_user: this.userInfo.id === 1 ? '' : this.userInfo.id }).then(res => {
            if (res.success) {
              this.userList = res.content
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: res.success ? 'success' : 'error',
                duration: 2000
              })
            }
          })
        }, 500)
        this.timerList.push(timer)
      } else {
        this.userList = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bind-user{
    .el-select{
      width: 100%;
      .el-tag{
        background: white;
      }
    }
  }
</style>
