import { Message, MessageBox } from 'element-ui'

export default (type, api, data) => {
  switch (type) {
    case 'create':
    case 'update':
      return new Promise((resolve, reject) => {
        api(data).then(res => {
          if (!res) return
          Message({
            showClose: true,
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    case 'delete':
      return new Promise((resolve, reject) => {
        MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api(data).then(res => {
            Message({
              showClose: true,
              message: res.message,
              type: res.success ? 'success' : 'error',
              duration: 2000
            })
            resolve(res)
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      })
    default:
      console.log('未设置的API操作类型')
      return new Promise((resolve, reject) => {
        reject('找不到的类型设置')
      })
  }
}
