<template>
  <a-modal :title="title" :width="drawerWidth" @cancel="handleCancel" :visible="visible" @ok="handleOk"
           :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="model" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :rules="rules">
        <a-row>
          <a-form-model-item label="分类名称" prop="name">
            <a-input v-model="model.name"></a-input>
          </a-form-model-item>

          <a-form-model-item label="分类备注" prop="remarks">
            <a-textarea :disabled="isDetail" v-model="model.remarks"></a-textarea>
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-spin>
    <!-- <a-row :style="{ textAlign: 'right' }">
      <a-button :style="{ marginRight: '8px' }" @click="handleCancel">{{ $t('common.close') }}</a-button>
      <a-button :disabled="disableSubmit" @click="handleOk" type="primary">{{ $t('common.confirm') }}</a-button>
    </a-row> -->
  </a-modal>
</template>

<script>
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import API from '@/api/BreakdownCategories'

import JDate from '@/components/jeecg/JDate'

export default {
  name: 'SysMenuModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
  },
  data() {
    return {
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      type: 'add',
      rules: {
        name: [{ required: true, message: '分类标题不可为空', trigger: 'blur' }],
        remarks: [{ required: true, message: '分类描述不可为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    selectIcons() {
      this.iconChooseVisible = true
    },
    /** 确定按钮点击事件 */
    handleOk(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          e.preventDefault()
          let fn = this.getFn() //获取方法
          fn(this.model).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              //更新自己
              this.$store.dispatch('GetPermissionList')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.errors)
            }
          })
        }
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    getFn() {
      if (this.isAdd) {
        return API.add
      } else if (this.isEdit) {
        return API.update
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    handleIconChoose(value) {
      console.log(value)
      this.model.icon = value
      this.form.icon = value
      this.iconChooseVisible = false
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
  },
}
</script>

<style scoped>
</style>