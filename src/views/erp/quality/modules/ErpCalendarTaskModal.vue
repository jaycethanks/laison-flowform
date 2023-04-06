<template>
  <j-modal width="50vw" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" switchFullscreen @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <!--  <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
      <!--主表区域 -->
      <!--     <a-tab-pane tab="SysRole" key="SysRole" :forceRender="true">-->

      <a-form-model ref="ruleForm" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-form-model-item label="id" v-show="false"></a-form-model-item>

          <a-form-model-item label="标题" prop="title" v-if="showFiled('title')">
            <a-input :disabled="isDetail" :maxLength="256" v-model="model.title" prop="title"></a-input>
          </a-form-model-item>
          <a-form-model-item label="内容" prop="content" v-if="showFiled('content')">
            <a-textarea :disabled="isDetail" :maxLength="1025" v-model="model.content" prop="content"></a-textarea>
          </a-form-model-item>

          <a-form-model-item label="任务优先级" prop="level" v-if="showFiled('level')">
            <a-select :disabled="isDetail" v-model="model.level" prop="interval" default-value="普通" style="width: 100%">
              <a-select-option
                v-for="i in [
                  { value: '低', name: '低' },
                  { value: '普通', name: '普通' },
                  { value: '紧急', name: '紧急' },
                  { value: '非常紧急', name: '非常紧急' },
                ]"
                :key="i.value"
              >
                {{ i.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="执行时间" prop="promptTime" v-if="showFiled('promptTime')">
            <j-date :disabled="isDetail || isEdit" v-model="model.promptTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-model-item>

          <a-form-model-item label="时间间隔类型" prop="promptType" v-if="showFiled('promptType')">
            <a-select :disabled="isDetail" v-model="model.promptType" prop="interval" :default-value="0" style="width: 100%">
              <a-select-option
                v-for="i in [
                  { value: 0, name: '秒' },
                  { value: 1, name: '分' },
                  { value: 2, name: '时' },
                  { value: 3, name: '天' },
                ]"
                :key="i.value"
              >
                {{ i.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="时间间隔时长" prop="promptInterval" v-if="showFiled('promptInterval')">
            <a-input-number :disabled="isDetail" v-model="model.promptInterval" :min="1" :precision="0" style="width: 100%" />
            <!-- :default-value="1" -->
          </a-form-model-item>

          <a-form-model-item label="最多提醒次数" prop="maxPromptTimes" v-if="showFiled('maxPromptTimes')">
            <a-input-number :disabled="isDetail" v-model="model.maxPromptTimes" :min="1" :precision="0" style="width: 100%" />
            <!-- :default-value="3" -->
          </a-form-model-item>
          <a-form-model-item label="提醒成员" prop="members" v-if="showFiled('members')">
            <MemberSelectModal :disabled="isDetail" v-model="model.members" :selected="data" />
          </a-form-model-item>
          <!-- 
          <a-form-model-item label='提醒自己' prop='applyer' v-if="showFiled('applyer')">
            <a-checkbox :disabled='isDetail' v-model='model.applyer' prop='applyer'></a-checkbox>
          </a-form-model-item> -->

          <a-form-model-item label="当前提醒次数" prop="curPromptTimes" v-if="isDetail">
            <a-input-number :disabled="true" v-model="model.curPromptTimes" :min="0" :precision="0" style="width: 100%" />
            <!-- :default-value="3" -->
          </a-form-model-item>

          <a-form-model-item label="启用状态" prop="enable" v-if="showFiled('enable')">
            <a-switch :disabled="isDetail" v-model="model.enable" checked-children="启用" un-checked-children="禁用" />
          </a-form-model-item>

          <a-form-model-item label="附件" prop="enclosure" v-if="showFiled('enclosure')">
            <LaisonMultiImgUploadModel :disabled="isDetail" v-model="model.enclosure" :conditions="{ listType: 'text', count: 1, size: 500, onlyImg: false }" />
          </a-form-model-item>
        </a-row>
      </a-form-model>

      <!--        </a-tab-pane>-->
      <!--      </a-tabs>-->
    </a-spin>
  </j-modal>
</template>

<script>
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import MemberSelectModal from '@/views/erp/quality/modules/comps/MemberSelectModal.vue'
import LaisonMultiImgUploadModel from '@/components/laison/LaisonMultiImgUploadModel.vue'

import API from '@/api/ErpCalendarTask'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'ErpCalendarTaskModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    MemberSelectModal,
    LaisonMultiImgUploadModel,
  },
  data() {
    return {
      data: [],
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      type: 'add',
      rules: {
        id: [
          // { required: true, message: '不能为空',trigger: 'blur' },
          // validator: (rule, value, callback) => {
          //   let reg = /^[^\s].{0,98}[^\s]$/gi
          //   let error = value == undefined || value == null || !reg.test(value)
          //   if (error) {
          //     callback(new Error(this.$t('ErpCalendarTask.idError')))
          //   } else {
          //     callback()
          //   }
          // },
          // trigger: 'blur',
        ],
        title: [{ required: true, message: '标题不可为空', trigger: 'change' }],
        content: [{ required: true, message: '内容不可为空', trigger: 'change' }],
        promptTime: [{ required: true, message: '执行时间不可为空', trigger: 'change' }],
        level: [{ required: true, message: '优先级不可为空', trigger: 'blur' }],
        maxPromptTimes: [
          { required: true, message: '最多提醒次数不可为空', trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let min = 0
          //     let max = 100
          //     let error = value == undefined || value == null || value > max || value < min
          //     if (error) {
          //       callback(new Error(this.$t('ErpCalendarTask.maxPromptTimeError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],
        promptInterval: [{ required: true, message: '时间间隔时长不可为空', trigger: 'blur' }],
        promptType: [{ required: true, message: '时间间隔类型不可为空', trigger: 'blur' }],
      },
    }
  },

  methods: {
    getAllTable() {},
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {},
    async show(record) {
      if (this.$store.getters.userInfo.sysDept.config.modalLayoutType != undefined && this.$store.getters.userInfo.sysDept.config.modalLayoutType) {
        //读取配置   如果时左右显示的
        ;(this.labelCol = {
          xs: { span: 24 },
          sm: { span: 6 },
        }),
          (this.wrapperCol = {
            xs: { span: 24 },
            sm: { span: 16 },
          })
      } else {
        //上下显示的

        ;(this.labelCol = {
          xxl: 24, // ≥1600px 响应式栅格
          xl: 24, // ≥1200px 响应式栅格
          lg: 10, // ≥992px 响应式栅格
          md: 12, // ≥768px 响应式栅格
          style: localStorage.getItem('language') == 'ar_EG' ? 'text-align:right' : '', //针对阿拉伯的样式绑定，解决行列布局覆盖labelAlign:'right'的问题

          // xs: { span: 24 },
          // sm: { span: 6 }
        }),
          (this.wrapperCol = {
            xxl: 24, // ≥1600px 响应式栅格
            xl: 24, // ≥1200px 响应式栅格
            lg: 10, // ≥992px 响应式栅格
            md: 12, // ≥768px 响应式栅格
            // xs: { span: 24 },
            // sm: { span: 16 }
          })
      }

      //清除form的验证
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }

      this.model = Object.assign(
        //@jayce 22/07/04-13:37:00 :  默认值， https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#%E5%90%88%E5%B9%B6%E5%85%B7%E6%9C%89%E7%9B%B8%E5%90%8C%E5%B1%9E%E6%80%A7%E7%9A%84%E5%AF%B9%E8%B1%A1
        //@jayce 22/07/04-13:37:15 : https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#%E6%8F%8F%E8%BF%B0
        {
          promptInterval: 1,
          maxPromptTimes: 3,
          level: '普通',
          promptType: 2,
          enable: true,
        },
        record
      )
      console.log(this.model, record, '--line226')

      this.visible = true
    },

    /** 确定按钮点击事件 */
    handleOk(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let fn = this.getFn() //获取方法

          fn(this.model).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg)
            } else {
              this.$message.warning(res.errors)
            }
            this.$emit('ok')
            this.visible = false
          })
        }
      })
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
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.erpCalendarTaskAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
  },
}
</script>

<style scoped>
</style>