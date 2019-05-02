import store from '@/store'

export default (code, list) => {
  for (const item of list) {
    if (store.getters.dataPerms.includes(`${code}:${item.event}`)) {
      item.show = true
    }
  }
}
