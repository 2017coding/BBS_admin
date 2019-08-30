<script>
export default {
  beforeCreate () {
    const { params, query } = this.$route
    const path = params.path || ''
    this.$router.replace({ path: '/' + path, query })
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
