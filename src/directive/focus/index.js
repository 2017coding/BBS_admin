export default {
  install (Vue) {
    Vue.directive('focus', {
      inserted: el => {
        el.focus()
      }
    })
  }
}
