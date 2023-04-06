<template>
  <j-modal
    title="新增存货档案"
    width="75vw"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :body-style="{ height: '80vh', overflowY: 'scroll' }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!--  <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
      <!--主表区域 -->
      <!--     <a-tab-pane tab="SysRole" key="SysRole" :forceRender="true">-->

      <a-form-model ref="ruleForm" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-form-model-item :label="$t('ErpStock.stockCode')" prop="stockCode" v-if="showFiled('stockCode') && isDetail">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.stockCode" prop="stockCode" :placeholder="$t('ErpStock.stockCodeError')"></a-input>
          </a-form-model-item>

          <a-form-model-item :label="$t('ErpStock.stockCode')" prop="stockCodeEdit" v-if="showFiled('stockCode') && !isDetail">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.stockCodeEdit" prop="stockCodeEdit" :placeholder="$t('ErpStock.stockCodeError')"></a-input>
          </a-form-model-item>

          <a-form-model-item :label="$t('ErpStock.specificationMode')" prop="specificationMode" v-if="showFiled('specificationMode')">
            <a-textarea auto-size :disabled="isDetail" :maxLength="300" v-model="model.specificationMode" prop="specificationMode" :placeholder="$t('ErpStock.specificationModeError')"></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.stockName')" prop="stockName" v-if="showFiled('stockName')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.stockName" prop="stockName" :placeholder="$t('ErpStock.stockNameError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.specificationIntro')" prop="specificationIntro" v-if="showFiled('specificationIntro')">
            <a-textarea auto-size :disabled="isDetail" :maxLength="500" v-model="model.specificationIntro" prop="specificationIntro" :placeholder="$t('ErpStock.specificationIntroError')"></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.elecMoudle')" v-if="showFiled('elecMoudle')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.elecMoudle" :placeholder="$t('ErpStock.elecMoudleError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.meterInfo')" v-if="showFiled('meterInfo')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.meterInfo" :placeholder="$t('ErpStock.meterInfoError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.enclosureAccessories')" v-if="showFiled('enclosureAccessories')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.enclosureAccessories" :placeholder="$t('ErpStock.enclosureAccessoriesError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.flow')" v-if="showFiled('flow')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.flow" :placeholder="$t('ErpStock.flowError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.pulse')" v-if="showFiled('pulse')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.pulse" :placeholder="$t('ErpStock.pulseError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.nameEn')" prop="nameEn" v-if="showFiled('nameEn')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.nameEn" prop="nameEn" :placeholder="$t('ErpStock.nameEnError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.deliveryFactory')" prop="deliveryFactory" v-if="showFiled('deliveryFactory')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.deliveryFactory" prop="deliveryFactory" :placeholder="$t('ErpStock.deliveryFactoryError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.drawingNo')" v-if="showFiled('drawingNo')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.drawingNo" :placeholder="$t('ErpStock.drawingNoError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.warehouse')" v-if="showFiled('warehouse')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.warehouse" prop="warehouse" :placeholder="$t('ErpStock.warehouseError')"></a-input>
          </a-form-model-item>
          <!--	              	  <a-form-model-item :label="$t('ErpStock.paramIntro')" prop="paramIntro" v-if="showFiled('paramIntro')">-->
          <!--	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.paramIntro" prop="paramIntro" placeholder="paramIntro" ></a-input>-->
          <!--	                  </a-form-model-item>-->
          <!--	              	  <a-form-model-item :label="$t('ErpStock.extParam')"  v-if="showFiled('extParam')">-->
          <!--	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.extParam" prop="extParam" placeholder="extParam" ></a-input>-->
          <!--	                  </a-form-model-item>-->
          <a-form-model-item :label="$t('ErpStock.classifyId')" prop="classifyId" v-if="showFiled('classifyId')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.classifyId" prop="classifyId" :placeholder="$t('ErpStock.classifyIdError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.measureGroupUnit')" prop="measureGroupUnit" v-if="showFiled('measureGroupUnit')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.measureGroupUnit" prop="measureGroupUnit" :placeholder="$t('ErpStock.measureGroupUnitError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.measureGroupUnitClassify')" prop="measureGroupUnitClassify" v-if="showFiled('measureGroupUnitClassify')">
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.measureGroupUnitClassify"
              prop="measureGroupUnitClassify"
              :placeholder="$t('ErpStock.measureGroupUnitClassifyError')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.measureUnit')" prop="measureUnit" v-if="showFiled('measureUnit')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.measureUnit" prop="measureUnit" :placeholder="$t('ErpStock.measureUnitError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.inventoryAttrIds')" prop="inventoryAttrIds" v-if="showFiled('inventoryAttrIds')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.inventoryAttrIds" prop="inventoryAttrIds"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.inventoryAttrJson')" prop="inventoryAttrJson" v-if="showFiled('inventoryAttrJson')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.inventoryAttrJson" prop="inventoryAttrJson"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.buyer')" prop="buyer" v-if="showFiled('buyer')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.buyer" prop="buyer" :placeholder="$t('ErpStock.buyerError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.productionDept')" prop="productionDept" v-if="showFiled('productionDept')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.productionDept" prop="productionDept" :placeholder="$t('ErpStock.productionDeptError')"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.purchasePrice')" v-if="showFiled('purchasePrice')">
            <a-input-number :disabled="isDetail" v-model="model.purchasePrice" :max="100000000" :min="0"  :precision="2" :placeholder="$t('ErpStock.purchasePriceError')" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.sellingPrice')" v-if="showFiled('sellingPrice')">
            <a-input-number :disabled="isDetail" v-model="model.sellingPrice" :max="100000000" :min="0"  :precision="2" :placeholder="$t('ErpStock.sellingPriceError')" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.status')" prop="status" v-if="showFiled('status')">
            <a-switch
              :disabled="isDetail"
              :checked="model.status"
              @change="
                (check) => {
                  model.status = check
                }
              "
              :un-checked-children="$t('common.disable')"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
            <a-switch
              :disabled="isDetail"
              :checked="model.delFlag"
              @change="
                (check) => {
                  model.delFlag = check
                }
              "
              :un-checked-children="$t('common.disable')"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.createBy')" prop="createBy" v-if="showFiled('createBy')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.createBy" prop="createBy"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.createTime')" prop="createTime" v-if="showFiled('createTime')">
            <j-date :disabled="isDetail || isEdit" v-model="model.createTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.updateBy" prop="updateBy"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
            <j-date :disabled="isDetail || isEdit" v-model="model.updateTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpStock.deptId')" prop="deptId" v-if="showFiled('deptId')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.deptId" prop="deptId"></a-input>
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
import API from '@/api/ErpStock'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'ErpStockModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
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
        stockCode: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.stockCodeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        stockCodeEdit: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.stockCodeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        specificationMode: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.specificationModeError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        stockName: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.stockNameError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        specificationIntro: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,500}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.specificationIntroError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        // meterInfo: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.meterInfoError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // elecMoudle: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.elecMoudleError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // flow: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.flowError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // pulse: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.pulseError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // nameEn: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.nameEnError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // deliveryFactory: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.deliveryFactoryError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // drawingNo: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.drawingNoError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // warehouse: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.warehouseError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // paramIntro: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.paramIntroError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // extParam: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.extParamError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // classifyId: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.classifyIdError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // measureGroupUnit: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.measureGroupUnitError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // measureGroupUnitClassify: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.measureGroupUnitClassifyError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        measureUnit: [
          {
            validator: (rule, value, callback) => {
              let reg = /[^\s]{1,}$/g
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.measureUnitError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        // inventoryAttrIds: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.inventoryAttrIdsError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // inventoryAttrJson: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.inventoryAttrJsonError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // buyer: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.buyerError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        // productionDept: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value == undefined || value == null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.productionDeptError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // purchasePrice: [
        //
        //   {
        //
        //     validator: (rule, value, callback) => {
        //       let min = 0
        //       let max = 100
        //       let error = value == undefined || value == null || value > max || value < min
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.purchasePriceError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],
        //
        // sellingPrice: [
        //
        //   {
        //
        //     validator: (rule, value, callback) => {
        //       let min = 0
        //       let max = 100
        //       let error = value == undefined || value == null || value > max || value < min
        //       if (error) {
        //         callback(new Error(this.$t('ErpStock.sellingPriceError')))
        //       } else {
        //         callback()
        //       }
        //     },
        //     trigger: 'blur'
        //   }
        //
        //
        // ],

        status: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error || value < 0) {
                callback(new Error(this.$t('ErpStock.statusError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        delFlag: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null
              if (error || value < 0) {
                callback(new Error(this.$t('ErpStock.delFlagError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        createBy: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.createByError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        createTime: [],

        updateBy: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.updateByError')))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],

        updateTime: [],

        deptId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi
              let error = value == undefined || value == null || !reg.test(value)
              if (error) {
                callback(new Error(this.$t('ErpStock.deptIdError')))
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
  methods: {
    getAllTable() {},
    /** 调用完edi$t()方法之后会自动调用此方法 */
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

      //todo 清除form的验证
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }

      this.model = Object.assign({}, record)
      console.log("edit",this.model)
      this.visible = true
    },

    /** 确定按钮点击事件 */
    handleOk(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('ok', this.model)
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
      let config = this.$store.getters.userInfo.sysDept.config.erpStockAddFiled
      config = config == undefined ? 0 : config
      let indexOfFiled = API.filedList.indexOf(filedName)
      let flag = 1 << indexOfFiled
      return !(config & flag)
    },
  },
}
</script>

<style scoped></style>

