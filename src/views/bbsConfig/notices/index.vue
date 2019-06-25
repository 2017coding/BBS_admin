<template>
  <div class="app-container">
    <div class="mac">
      <div class="mac-header">
        <div class="mac-left">
          <i class="dot1" />
          <i class="dot2" />
          <i class="dot3" />
        </div>
        <div
          v-if="!edit && dataPerms.includes('notices:set')"
          class="mac-right"
          @click="handleClick('update')"
        >
          <i class="el-icon-edit" />编辑
        </div>
      </div>
      <div class="mac-body">
        <p v-if="!edit" class="notices">{{ formInfo.data.content || '暂无通知' }}</p>
        <template v-else>
          <page-form
            :ref-obj.sync="formInfo.ref"
            :data="formInfo.data"
            :field-list="formInfo.fieldList"
            :rules="formInfo.rules"
            :label-width="formInfo.labelWidth"
          />
          <div class="bt">
            <el-button @click="handleClick('canel')">取消</el-button>
            <el-button type="primary" @click="handleClick('save')">保存</el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setNoticesApi, getNoticesApi } from '@/api/bbsConfig/notices'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageForm
  },
  data () {
    return {
      edit: false,
      btLoading: false,
      formInfo: {
        ref: null,
        data: {
          href: '',
          content: '',
          status: 1
        },
        fieldList: [
          { label: '跳转地址', value: 'href', type: 'input', className: 'el-form-block', validator: '' },
          { label: '内容', value: 'content', type: 'textarea', className: 'el-form-block' }
        ],
        rules: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'dataPerms'
    ])
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      getNoticesApi().then(res => {
        if (res.success) {
          this.formInfo.data = res.content[0]
        }
      })
    },
    // 绑定点击
    handleClick (type) {
      switch (type) {
        case 'update':
        case 'canel':
          this.edit = !this.edit
          break
        case 'save':
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.btLoading = true
              const params = this.formInfo.data
              this.$handleAPI('create', setNoticesApi, params).then(res => {
                if (res.success) {
                  this.edit = false
                }
                this.btLoading = false
              }).catch(e => {
                this.btLoading = false
              })
            }
          })
          break
      }
    },
    // 初始化表单
    resetForm () {
      this.formInfo.data = {
        href: '',
        content: ''
      }
    }
  }
}
</script>

<style lang="scss">
.mac-body{
  .el-form{
    height: 90%;
  }
  .el-form-item:last-child{
    height: calc(100% - 40px - 20px);
  }
  .el-form-item__content, .el-textarea, textarea{
    height: 100%!important;
    resize: none!important;
  }
}
</style>

<style scoped lang="scss">
.app-container{
  .mac{
    height: 100%;
    .mac-header{
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      border-radius: 8px 8px 0 0;
      background-color: #E3E3E3;
      overflow: auto;
      .mac-left{
        display: flex;
        .dot1, .dot2, .dot3{
          margin: 0 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .dot1{
          background-color: #FF5F57;
        }
        .dot2{
          background-color: #FFBD2E;
        }
        .dot3{
          background-color: #28CA42;
        }
      }
      .mac-right{
        cursor: pointer;
        color: #999;
      }
    }
    .mac-body{
      padding: 40px;
      height: calc(100% - 32px);
      background-color: #EEEEEE;
      border-radius: 0 0 6px 6px;
      .notices{
        color: #666666;
      }
      .set-item{
        margin-bottom: 20px;
      }
      .bt{
        margin-top: 3%;
        text-align: right;
      }
    }
  }
}
</style>
