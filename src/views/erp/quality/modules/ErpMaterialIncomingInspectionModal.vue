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
          <a-form-model-item label="id" v-show="false">
            <a-input v-model="model.id" ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.stockCode')"
            prop="stockCode"
            v-if="showFiled('stockCode')"
          >
            <StockSelect :disabled="isDetail" prop="stockCode" :maxLength="30" v-model="model.stockCode" />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.supplierId')"
            prop="supplierId"
            v-if="showFiled('supplierId')"
          >
            <SupplierSelect
              :disabled="isDetail"
              prop="supplierId"
              :maxLength="303"
              v-model="model.supplierId"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.incomingBatches')"
            prop="incomingBatches"
            v-if="showFiled('incomingBatches')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.incomingBatches"
              prop="incomingBatches"
              :placeholder="$t('ErpMaterialIncomingInspection.incomingBatches')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.incomingTime')"
            prop="incomingTime"
            v-if="showFiled('incomingTime')"
          >
            <j-date
              :disabled="isDetail || isEdit"
              v-model="model.incomingTime"
              :show-time="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.inspectTime')"
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
            :label="$t('ErpMaterialIncomingInspection.incomingNumber')"
            prop="incomingNumber"
            v-if="showFiled('incomingNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.incomingNumber"
              :max="1000000000"
              :min="0.001"
              :precision="3"
              :placeholder="$t('ErpMaterialIncomingInspection.incomingNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.inspectNumber')"
            prop="inspectNumber"
            v-if="showFiled('inspectNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              @change="calculate"
              v-model="model.inspectNumber"
              :max="model.incomingNumber"
              :min="0.001"
              :precision="3"
              :placeholder="$t('ErpMaterialIncomingInspection.inspectNumber')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.qualifiedNumber')"
            prop="qualifiedNumber"
            v-if="showFiled('qualifiedNumber')"
          >
            <a-input-number
              :disabled="isDetail"
              v-model="model.qualifiedNumber"
              @change="calculate"
              :max="model.inspectNumber"
              :min="0.001"
              :precision="3"
              :placeholder="$t('ErpMaterialIncomingInspection.qualifiedNumber')"
              style="width: 100%"
            />
          </a-form-model-item>

          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.unitCode')"
            prop="unitCode"
            v-if="showFiled('unitCode')"
          >
            <LaisonErpConfig
              :conditions="{ configCode: 'chdw' }"
              :disabled="isDetail"
              v-model="model.unitCode"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.passPercent')"
            prop="passPercent"
            v-if="showFiled('passPercent')"
          >
            <a-input-number
              :disabled="true"
              v-model="model.passPercent"
              :max="100"
              :min="0"
              :precision="3"
              :placeholder="$t('ErpMaterialIncomingInspection.passPercent')"
              :formatter="(value) => `${value}%`"
              :parser="(value) => value.replace('%', '')"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.inspectResult')"
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
            :label="$t('ErpMaterialIncomingInspection.unqualifiedReviewConclusion')"
            prop="unqualifiedReviewConclusion"
            v-if="model.inspectResult == 0"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.unqualifiedReviewConclusion"
              prop="unqualifiedReviewConclusion"
              :placeholder="$t('ErpMaterialIncomingInspection.unqualifiedReviewConclusion')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.badCategory')"
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
            :label="$t('ErpMaterialIncomingInspection.badDescription')"
            prop="badDescription"
            v-if="showFiled('badDescription')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.badDescription"
              prop="badDescription"
              :placeholder="$t('ErpMaterialIncomingInspection.badDescription')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('ErpMaterialIncomingInspection.inspectDescription')"
            prop="inspectDescription"
            v-if="showFiled('inspectDescription')"
          >
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.inspectDescription"
              prop="inspectDescription"
              :placeholder="$t('ErpMaterialIncomingInspection.inspectDescription')"
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
import API from '@/api/ErpMaterialIncomingInspection'
import JDate from '@/components/jeecg/JDate'
import StockSelect from '@/components/laison/InputSelect/LaisonErpStockInputSelect'
import SupplierSelect from '@/components/laison/InputSelect/LaisonErpSupplierInputSelect'
import LaisonErpConfig from '@/components/laison/LaisonErpConfig'
import moment from 'moment'
export default {
  name: 'ErpMaterialIncomingInspectionModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    StockSelect,
    SupplierSelect,
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.idError')))
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.stockCodeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        supplierId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.supplierIdError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        incomingBatches: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.incomingBatchesError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        incomingTime: [],

        inspectTime: [],

        incomingNumber: [
          {
            validator: (rule, value, callback) => {
              let min = 0
              let max = 1000000000
              let error = value == undefined || value == null || value > max || value < min
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.incomingNumberError')))
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
              let min = 0
              let max = 1000000000
              let error =
                value == undefined ||
                value == null ||
                value > max ||
                value < min ||
                value > this.model.incomingNumber
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.inspectNumberError')))
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
              let min = 0
              let max = 1000000000
              let error =
                value == undefined ||
                value == null ||
                value > max ||
                value < min ||
                value > this.model.inspectNumber
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.qualifiedNumberError')))
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
              let min = 0
              let max = 1000000000
              let error = value == undefined || value == null || value > max || value < min
              if (error) {
                callback(new Error(this.$t('ErpMaterialIncomingInspection.passPercentError')))
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.inspectResultError')))
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
                  new Error(this.$t('ErpMaterialIncomingInspection.unqualifiedReviewConclusionError'))
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.badCategoryError')))
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.badDescriptionError')))
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
                callback(new Error(this.$t('ErpMaterialIncomingInspection.inspectDescriptionError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    //this.model = {}
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
      // if (!this.model.incomingTime) {
      //   this.model.incomingTime = moment().locale('en_US').format('YYYY-MM-DD HH:mm:ss')
      // }
      // if (!this.model.inspectTime) {
      //   this.model.inspectTime = moment().locale('en_US').format('YYYY-MM-DD HH:mm:ss')
      // }
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
      let config = this.$store.getters.userInfo.sysDept.config.erpMaterialIncomingInspectionAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
  },
}
</script>

<style scoped>
>>> .ant-input-number-disabled {
  background-color: transparent;
  cursor: pointer;
  opacity: 1;
  color: #000;
}

>>> .ant-select-disabled {
  background-color: transparent;
  cursor: pointer;
  opacity: 1;
  color: #000;
}
</style>
