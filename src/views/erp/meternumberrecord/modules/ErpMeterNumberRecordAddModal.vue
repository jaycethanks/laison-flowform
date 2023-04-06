<template>
  <j-modal
    :width='800'
    :visible='visible'
    :maskClosable='false'
    :confirmLoading='confirmLoading'
    switchFullscreen
    :title='title'
    @ok='handleOk'
    @cancel='handleCancel'>
    <a-spin :spinning='confirmLoading'>

      <!--  <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
      <!--主表区域 -->
      <!--     <a-tab-pane tab="SysRole" key="SysRole" :forceRender="true">-->

      <a-form-model
        ref='ruleForm'
        :model='model'
        :rules='rules'
        :label-col='labelCol'
        :wrapper-col='wrapperCol'>
        <a-row>
          <a-form-model-item label='id' v-show=false>
            <a-input v-model='model.id'></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.orderId')" prop='handleOrderNo'
                             v-if="showFiled('orderId')">
            <a-input :maxLength=30 v-model='model.handleOrderNo' prop='handleOrderNo'
                     :placeholder="$t('ErpMeterNumberRecord.inputOrderId')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.stockCode')" prop='stockCode'
                             v-if="showFiled('stockCode')">
            <div :disabled='operateType ===1' @click='onCheckSelectGoodsListener'>
              <a-input class='input-style' :disabled='true' :maxLength=30 v-model='model.stockCode' prop='stockCode'
                       :placeholder="$t('ErpMeterNumberRecord.selectStockCode')"></a-input>
            </div>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.roleCode')" prop='roleCode' v-if="showFiled('roleCode')">
            <a-select :disabled='operateType ===1' :placeholder="$t('ErpMeterNumberRecord.selectRoleCode')"
                      v-model='model.roleCode'>
              <a-select-option v-for='(item, i) in meterRules' :key='i' :value='item.codeNumber'>
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.numberCount')" prop='numberCount'
                             v-if="showFiled('numberCount')">
            <a-input-number :disabled='operateType ===1' v-model='model.numberCount' :max=999999 :min=0 :precision=0
                            :placeholder="$t('ErpMeterNumberRecord.inputNumberCount')" style='width: 100%' />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.state')" prop='state'  v-if='operateType ===1'>
            <a-select :placeholder="$t('ErpMeterNumberRecord.selectState')" v-model='model.state' prop='state'
                      style='width: 100%'>
              <a-select-option v-for='(item, i) in recordStatus' :key='i' :value='item.state'>
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.remark')" prop='remark' v-if="showFiled('remark')">
            <a-textarea :maxLength=30 v-model='model.remark' prop='remark'
                        :placeholder="$t('ErpMeterNumberRecord.inputRemark')"></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.length')" prop='length' v-if='operateType ===1'>
            <a-input-number :disabled='operateType ===1' v-model='model.length' :max=100 :min=0 :precision=0
                            placeholder='length' style='width: 100%' />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.startNumber')" prop='startNumber' v-if='operateType ===1'>
            <a-input :disabled='operateType ===1' :maxLength=30 v-model='model.startNumber' prop='startNumber'
                     placeholder='startNumber'></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.endNumber')" prop='endNumber' v-if='operateType ===1'>
            <a-input :disabled='operateType ===1' :maxLength=30 v-model='model.endNumber' prop='endNumber'
                     placeholder='endNumber'></a-input>
          </a-form-model-item>

          <a-form-model-item :label="$t('ErpMeterNumberRecord.deptId')" prop='deptId' v-if='operateType ===1'>
            <a-input :disabled='operateType ===1' :maxLength=30 v-model='model.deptName' prop='deptId'
                     placeholder='deptId'></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.createTime')" prop='createTime' v-if='operateType ===1'>
            <j-date :disabled='operateType ===1 ' v-model='model.createTime' :show-time='true'
                    date-format='YYYY-MM-DD HH:mm:ss' style='width: 100%' />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpMeterNumberRecord.fileUrl')" prop='fileUrl' v-if='operateType ===1'>
            <a-input :disabled='operateType ===1' :maxLength=30 v-model='model.fileUrl' prop='fileUrl'
                     placeholder='fileUrl'></a-input>
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-spin>

    <GoodsCheckSelector @ok='onGoodsCheckSelectorOk' ref='GoodsCheckSelector' />
  </j-modal>
</template>

<script>
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import API from '@/api/ErpMeterNumberRecord'
import ErpConfig from '../../../../api/ErpConfig'
import JDate from '@/components/jeecg/JDate'
import GoodsCheckSelector from '@/components/laison/modules/GoodsCheckSelector.vue'

export default {
  name: 'ErpMeterNumberRecordModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    GoodsCheckSelector
  },
  data() {
    return {
      title: '',
      visible: false,
      operateType: 0,
      disableSubmit: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      type: 'add',
      recordStatus: [
        {
          id: 0,
          state: 1,
          name: '使用中'
        },
        {
          id: 1,
          state: 2,
          name: '已作废'
        },
        {
          id: 2,
          state: 0,
          name: '未使用'
        }
      ],
      meterRules: [],
      rules: {
        handleOrderNo: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/ig
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.inputOrderId')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],

        stockCode: [

          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/ig
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.selectStockCode')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],

        remark: [

          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,1027}[^\s]$/ig
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.inputRemark')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],

        roleCode: [

          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/ig
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.selectRoleCode')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],

        numberCount: [

          {

            validator: (rule, value, callback) => {
              let min = 0
              let max = 999999
              let error = value == undefined || value == null || value > max || value < min
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.inputNumberCount')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],


        state: [

          {

            validator: (rule, value, callback) => {
              let min = 0
              let max = 100
              let error = value == undefined || value == null || value > max || value < min
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.selectState')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }


        ],

        fileUrl: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/ig
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMeterNumberRecord.fileUrlError')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]

      }
    }
  },
  methods: {
    async initMeterRule() {
      let res = await ErpConfig.findByCode('bhgz')
      if (res && res.configJson) {
        this.meterRules = JSON.parse(res.configJson)
      }
    },

    onCheckSelectGoodsListener() {
      if (this.operateType === 1) return
      this.$refs.GoodsCheckSelector.show()
    },
    onGoodsCheckSelectorOk(goods) {
      if (goods && goods.length > 0) {
        // this.model.stockCode = goods[0].stockCode
        //强制更新dom中的数值
        this.$set(this.model, 'stockCode', goods[0].stockCode)
      }
    },

    getAllTable() {

    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {


    },
    async show(operateType, record) {
      if (this.$store.getters.userInfo.sysDept.config.modalLayoutType != undefined && this.$store.getters.userInfo.sysDept.config.modalLayoutType) {//读取配置   如果时左右显示的
        this.labelCol = {
          xs: { span: 24 },
          sm: { span: 6 }
        },
          this.wrapperCol = {
            xs: { span: 24 },
            sm: { span: 16 }
          }
      } else {//上下显示的
        this.labelCol = {
          xxl: 24, // ≥1600px 响应式栅格
          xl: 24, // ≥1200px 响应式栅格
          lg: 10, // ≥992px 响应式栅格
          md: 12, // ≥768px 响应式栅格
          style: localStorage.getItem('language') == 'ar_EG' ? 'text-align:right' : ''//针对阿拉伯的样式绑定，解决行列布局覆盖labelAlign:'right'的问题

          // xs: { span: 24 }, 
          // sm: { span: 6 }
        },
          this.wrapperCol = {
            xxl: 24, // ≥1600px 响应式栅格
            xl: 24, // ≥1200px 响应式栅格
            lg: 10, // ≥992px 响应式栅格
            md: 12 // ≥768px 响应式栅格
            // xs: { span: 24 },
            // sm: { span: 16 }
          }
      }
      //清除form的验证
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.initMeterRule()
      this.operateType = operateType
      this.model = Object.assign({}, record)
      this.visible = true
    },

    /** 确定按钮点击事件 */
    handleOk(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.model.handleOrderNo) {
            this.model.handleOrderNo = this.model.orderNo
            this.model.orderNo = null
          }
          let fn = this.getFn()//获取方法
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
        return API.handleGenerate
      } else {
        return API.update
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.erpMeterNumberRecordAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    }

  }
}
</script>

<style scoped lang='less'>
/deep/ .input-style {
  background-color: #fff;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.65);
}
</style>