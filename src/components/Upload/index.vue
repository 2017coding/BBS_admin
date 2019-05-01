<template>
  <el-upload
    ref="upload"
    :action="url"
    :headers="headersData"
    :multiple="true"
    :auto-upload="autoUpload"
    :data="uploadData"
    :before-upload="uploadBefore"
    :on-remove="uploadRemove"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :file-list="fileList"
    :list-type="listType"
  >
    <el-button
      slot="trigger"
      size="small"
      type="primary"
    >
      {{ autoUpload ? '点击上传' : '读取文件' }}
    </el-button>
    <el-button
      v-if="!autoUpload"
      style="margin-left: 10px;"
      size="small"
      type="success"
      @click="submitUpload"
    >
      开始上传
    </el-button>
    <div
      slot="tip"
      style="margin-top:-5px; padding: 10px 0; color:#ff4949"
    >
      {{ uploadMessage }} <i
        v-if="uploadMessage == '正在上传'"
        class="el-icon-loading"
      />
    </div>
  </el-upload>
</template>

<script>
import { _getSessionStore } from '@/common/js/storage'
export default {
  props: {
    // 上传的地址
    url: {
      type: String,
      default: `https://www.lyh.red/api/file/upload`
    },
    // 显示上传的内容
    fileData: {
      type: Array
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    // 上传参数
    uploadData: {
      type: Object
    },
    // 上传的文件类型
    uploadType: {
      type: String,
      default: 'image'
    },
    // 上传的文件个数
    uploadNums: {
      type: Number,
      default: -1
    },
    // 列表类型
    listType: {
      type: String,
      default: 'picture'
    }
  },
  data () {
    return {
      // listType: 'text', // 文件列表的类型
      checkType: true, // 检查文件类型
      headersData: {}, // 上传的文件数据
      fileList: [], // 上传成功的文件列表
      uploadMessage: '' // 上传的说明
    }
  },
  watch: {
    uploadType () {
      this.init()
    },
    fileList () {
      // 将内容派发到父组件
      this.$emit('cdHandleUpload', { fileList: this.fileList })
    },
    uploadMessage () {
      // 将内容派发到父组件
      this.$emit('cdHandleUpload', { uploadMessage: this.uploadMessage })
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 组件初始化
    init () {
      // 设置token
      this.headersData = { Authorization: _getSessionStore('token') }
      if (this.listType === 'picture') {
        // 设置上传的类型
        if (this.uploadType === 'image') {
          this.$emit('update:listType', 'picture')
        } else {
          this.$emit('update:listType', 'text')
        }
      }

      // 显示已上传的文件
      if (this.fileData) {
        this.fileList = JSON.parse(JSON.stringify(this.fileData))
      }
    },
    // 检查文件类型
    checkFileType (check) {
      let result = true
      switch (this.uploadType) {
        case 'image':
          if (check !== 'jpg' && check !== 'gif' && check !== 'png' && check !== 'bmp' && check !== 'raw' && check !== 'jpeg') {
            this.uploadMessage = '请选择图片文件'
            result = false
          }
          break
        case 'json':
          if (check !== 'json') {
            this.uploadMessage = '请选择json文件'
            result = false
          }
          break
        case 'file':
          break
        default:
          this.uploadMessage = '请选择正确的文件格式'
          result = false
          break
      }
      this.checkType = result

      return result
    },
    // 手动触发上传
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 文件上传之前
    uploadBefore (file) {
      const fileType = file.name.split('.'); const len = fileType.length - 1
      // 判断上传文件的后缀名, 将后缀名都转换成小写做比较
      if (!this.checkFileType(fileType[len].toLowerCase())) {
        this.$refs.upload.abort(file)
        return
      }
      this.uploadMessage = '正在上传'
    },
    // 文件上传中
    uploadProgress (event, file, fileList) {
      // 如果类型检查失败不往下执行
      if (!this.checkType) {
        // 取消上传
        this.$refs.upload.abort(file)
        // 删除当前文件
        fileList.forEach((item, index) => {
          if (JSON.stringify(item) === JSON.stringify(file)) {
            fileList.splice(index, 1)
          }
        })
      }
    },
    // 文件上传成功
    uploadSuccess (res, file, fileList) {
      // 上传结果处理
      if (res.success) {
        this.uploadMessage = ''
        // this.fileList = fileList
        // 根据设置的文件个数做处理 -1为无限大
        if (this.uploadNums === -1 || fileList.length < this.uploadNums) {
          this.fileList = fileList
        } else if (fileList.length > this.uploadNums) {
          const Arr = []
          for (let i = 0, len = this.uploadNums; i < len; i++) {
            Arr.push(fileList[fileList.length - (i + 1)])
          }
          this.fileList = Arr
        }
      } else {
        // 删除当前文件
        fileList.forEach((item, index) => {
          if (JSON.stringify(item) === JSON.stringify(file)) {
            fileList.splice(index, 1)
          }
        })
        this.uploadMessage = '上传失败'
      }
      this.$message({
        showClose: true,
        message: res.success ? '上传成功' : '上传失败',
        type: res.success ? 'success' : 'error',
        duration: 2000
      })

      this.$emit('handleEvent', 'upload', res.success)
    },
    // 文件上传失败
    uploadError (error, file, fileList) {
      if (error) {
        return
      }
      // 删除当前文件
      fileList.forEach((item, index) => {
        if (JSON.stringify(item) === JSON.stringify(file)) {
          fileList.splice(index, 1)
        }
      })
      this.uploadMessage = '上传失败'
      this.$message({
        showClose: true,
        message: '上传失败',
        type: 'error',
        duration: 2000
      })
    },
    // 文件移除时
    uploadRemove (file, fileList) {
    }
  }
}
</script>

<style scoped>

</style>
