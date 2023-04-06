<template>
  <j-modal
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!--  <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
      <!--主表区域 -->
      <!--     <a-tab-pane tab="SysRole" key="SysRole" :forceRender="true">-->

      <a-form-model
        ref="ruleForm"
        :model="model"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-form-model-item
            :label="$t('OrderStats.orderNo')"
            prop="orderId"
            v-if="showFiled('orderId')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="32"
              v-model="model.orderId"
              prop="orderId"
              :placeholder="$t('OrderStats.orderNo')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.stockName')"
            prop="stockCode"
            v-if="showFiled('stockCode')"
          >
            <StockSelect :disabled="isDetail" prop="stockCode" :maxLength="30" v-model="model.stockCode" />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.orderNumber')"
            prop="orderNumber"
            v-if="showFiled('orderNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.orderNumber"
              :max="10000000"
              :min="0"
              :precision="0"
              :placeholder="$t('ErpFactoryIncomingInspection.orderNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.inspectTime')"
            prop="inspectTime"
            v-if="showFiled('inspectTime')"
          >
            <j-date
              :disabled="isDetail || isEdit"
              v-model="model.inspectTime"
              :show-time="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.submittedInspectNumber')"
            prop="submittedInspectNumber"
            v-if="showFiled('submittedInspectNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.submittedInspectNumber"
              :max="model.orderNumber"
              :min="0"
              :precision="0"
              :placeholder="$t('ErpFactoryIncomingInspection.submittedInspectNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.inspectNumber')"
            prop="inspectNumber"
            v-if="showFiled('inspectNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.inspectNumber"
              @change="calculate"
              :max="model.submittedInspectNumber"
              :min="0"
              :precision="0"
              :placeholder="$t('ErpFactoryIncomingInspection.inspectNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.qualifiedNumber')"
            prop="qualifiedNumber"
            v-if="showFiled('qualifiedNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              @change="calculate"
              v-model="model.qualifiedNumber"
              :max="model.submittedInspectNumber"
              :min="0"
              :precision="0"
              :placeholder="$t('ErpFactoryIncomingInspection.qualifiedNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.unitCode')"
            prop="unitCode"
            v-if="showFiled('unitCode')"
          >
            <LaisonErpConfig
              :disabled="isDetail"
              :conditions="{ configCode: 'chdw' }"
              v-model="model.unitCode"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.passPercent')"
            prop="passPercent"
            v-if="showFiled('passPercent')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.passPercent"
              :formatter="(value) => `${value}%`"
              :parser="(value) => value.replace('%', '')"
              :max="100"
              :min="0"
              :precision="3"
              :placeholder="$t('ErpFactoryIncomingInspection.passPercent')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.inspectResult')"
            prop="inspectResult"
            v-if="showFiled('inspectResult')"
          >
            <a-select v-model="model.inspectResult" :disabled="true">
              <!--  合格   -->
              <a-select-option :value="3">{{ $t('ErpMaterialIncomingInspection.hg') }}</a-select-option>
              <!--  待改进   -->
              <a-select-option :value="2">{{ $t('ErpMaterialIncomingInspection.dgj') }}</a-select-option>
              <!--  不合格  -->
              <a-select-option :value="0">{{ $t('ErpMaterialIncomingInspection.bhg') }}</a-select-option>

              <!--  其它  -->
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.unqualifiedReviewConclusion')"
            prop="unqualifiedReviewConclusion"
            v-if="model.inspectResult == 0"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.unqualifiedReviewConclusion"
              prop="unqualifiedReviewConclusion"
              :placeholder="$t('ErpFactoryIncomingInspection.unqualifiedReviewConclusion')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.badCategory')"
            prop="badCategory"
            v-if="showFiled('badCategory')"
          >
            <LaisonErpConfig
              :conditions="{ configCode: 'bllb' }"
              :disabled="isDetail"
              v-model="model.badCategory"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.badDescription')"
            prop="badDescription"
            v-if="showFiled('badDescription')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="300"
              v-model="model.badDescription"
              prop="badDescription"
              :placeholder="$t('ErpFactoryIncomingInspection.badDescription')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpFactoryIncomingInspection.inspectDescription')"
            prop="inspectDescription"
            v-if="showFiled('inspectDescription')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="300"
              v-model="model.inspectDescription"
              prop="inspectDescription"
              :placeholder="$t('ErpFactoryIncomingInspection.inspectDescription')"
            ></a-input>
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
import API from '@/api/ErpFactoryIncomingInspection'
import JDate from '@/components/jeecg/JDate'
import StockSelect from '@/components/laison/InputSelect/LaisonErpStockInputSelect'
import LaisonErpConfig from '@/components/laison/LaisonErpConfig'
export default {
  name: 'ErpFactoryIncomingInspectionModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    StockSelect,
    LaisonErpConfig,
  },
  data() {
    return {
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
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.idError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        orderId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.orderIdError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        stockCode: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.stockCodeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        orderNumber: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.orderNumberError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        inspectTime: [],

        submittedInspectNumber: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.submittedInspectNumberError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        inspectNumber: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.inspectNumberError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        qualifiedNumber: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.qualifiedNumberError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        unitCode: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.unitCodeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        passPercent: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.passPercentError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        inspectResult: [
          {
            validator: (rule, value, callback) => {
              let min = 0
              let max = 100
              let error = value == undefined || value == null || value > max || value < min
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.inspectResultError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        unqualifiedReviewConclusion: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(
                  new Error(this.$t('ErpFactoryIncomingInspection.unqualifiedReviewConclusionError'))
                )
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        badCategory: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.badCategoryError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        badDescription: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.badDescriptionError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        inspectDescription: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.inspectDescriptionError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        deptId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.deptIdError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        operatorId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpFactoryIncomingInspection.operatorIdError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        importTime: [],
      },
    }
  },
  methods: {
    getAllTable() {},
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {},
    async show(record) {
      if (
        this.$store.getters.userInfo.sysDept.config.modalLayoutType != undefined &&
        this.$store.getters.userInfo.sysDept.config.modalLayoutType
      ) {
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

      this.model = Object.assign({}, record)
      this.calculate()
      this.visible = true
    },
    calculate() {
      console.log('开始计算')
      this.model.passPercent = (this.model.qualifiedNumber / this.model.inspectNumber).toFixed(5)
      this.model.passPercent *= 100
      //this.model.passPercent = Number.parseFloat(this.model.passPercent.toFixed(3))
      if (this.model.passPercent >= 99) {
        this.model.inspectResult = 3
      } else if (this.model.passPercent >= 98) {
        this.model.inspectResult = 2
      } else {
        this.model.inspectResult = 0
      }
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
      let config = this.$store.getters.userInfo.sysDept.config.erpFactoryIncomingInspectionAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
  },
}
</script>

<style scoped></style>
