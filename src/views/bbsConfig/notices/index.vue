<template>
  <div class="app-container">
    <div class="mac">
      <div class="mac-header">
        <div class="mac-left">
          <i class="dot1" />
          <i class="dot2" />
          <i class="dot3" />
        </div>
        <div v-if="!edit" class="mac-right" @click="handleClick('update')"><i class="el-icon-edit" />编辑</div>
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
          content: ''
        },
        fieldList: [
          { label: '跳转地址', value: 'href', type: 'input', className: 'el-form-block', validator: '' },
          { label: '内容', value: 'content', type: 'textarea', autosize: { minRows: 8, maxRows: 10 }, className: 'el-form-block' }
        ],
        rules: {}
      }
    }
  },
  methods: {
    handleClick (type) {
      switch (type) {
        case 'update':
        case 'canel':
          this.edit = !this.edit
          break
      }
    }
  }
}
</script>

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
      background-color: #E3E3E3;
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
      min-height: calc(100% - 32px);
      background-color: #EEEEEE;
      .notices{
        color: #666666;
      }
      .set-item{
        margin-bottom: 20px;
      }
      .bt{
        text-align: right;
      }
    }
  }
}
</style>
