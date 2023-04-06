<template>
  <div>
    <j-modal
      :width="600"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      :body-style="{ maxHeight: '75vh', overflowY: 'auto' }"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="ruleForm" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-form-model-item label="id" v-show="false">
              <a-input v-model="model.id"></a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.customerNo')" prop="customerNo" v-if="showFiled('customerNo')">
              <a-input
                :disabled="isDetail"
                :maxLength="60"
                v-model="model.customerNo"
                prop="customerNo"
                :placeholder="$t('ErpCustomer.customerNoError')"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.name')" prop="name" v-if="showFiled('name')">
              <a-input
                :disabled="isDetail"
                :maxLength="30"
                v-model="model.name"
                prop="name"
                :placeholder="$t('ErpCustomer.nameError')"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.briefIntro')" prop="briefIntro" v-if="showFiled('briefIntro')">
              <a-textarea
                :disabled="isDetail"
                v-model="model.briefIntro"
                prop="briefIntro"
                :placeholder="$t('ErpCustomer.briefIntroError')"
              ></a-textarea>
            </a-form-model-item>

            <a-form-model-item :label="$t('ErpCustomer.levelId')" prop="level" v-if="showFiled('level')">
              <a-select
                prop="level"
                :disabled="isDetail"
                v-model="model.level"
                show-search
                :placeholder="$t('ErpCustomer.levelIdError')"
                option-filter-prop="children"
              >
                <a-select-option v-for="item in levelList" :value="item.name" :key="item.codeNumber">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <!--            <a-form-model-item :label="$t('ErpCustomer.signingStartTime')" v-if="showFiled('signingStartTime')">-->
            <!--              <j-date :disabled='isDetail ' v-model='model.signingStartTime' :show-time='true'-->
            <!--                      date-format='YYYY-MM-DD HH:mm:ss' style='width: 100%' />-->
            <!--            </a-form-model-item>-->
            <!--            <a-form-model-item :label="$t('ErpCustomer.signingEndTime')" v-if="showFiled('signingEndTime')">-->
            <!--              <j-date :disabled='isDetail ' v-model='model.signingEndTime' :show-time='true'-->
            <!--                      date-format='YYYY-MM-DD HH:mm:ss' style='width: 100%' />-->
            <!--            </a-form-model-item>-->
            <a-form-model-item
              :label="$t('ErpCustomer.currencySymbol')"
              prop="currencySymbol"
              v-if="showFiled('currencySymbol')"
            >
              <a-select
                prop="currencySymbol"
                :disabled="isDetail"
                v-model="model.currencySymbol"
                show-search
                :placeholder="$t('ErpCustomer.currencySymbolError')"
                option-filter-prop="children"
              >
                <a-select-option v-for="item in currencyList" :value="item.codeNumber" :key="item.codeNumber">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              :label="$t('ErpContacts.regionCode')"
              prop="regionCode"
              ref="regionCode"
              v-if="showFiled('regionCode')"
            >
              <LSelectRegion :disabled="isDetail" v-model="model.regionCode" @regionSelect="onRegionSelect">
              </LSelectRegion>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpContacts.address')" prop="address" v-if="showFiled('address')">
              <a-textarea
                :disabled="isDetail"
                v-model="model.address"
                prop="address"
                :placeholder="$t('ErpContacts.address')"
              ></a-textarea>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.personalInfoId')" v-if="showFiled('personalInfoId')">
              <JSelectContactsByRegion
                :multi="false"
                :disabled="isDetail"
                :contacts-id="model.personalInfoId"
                @onContactsSelect="onContactsSelectEvent"
              >
              </JSelectContactsByRegion>
            </a-form-model-item>
            <!--业务员-->
            <a-form-model-item :label="$t('ErpCustomer.salesmanId')" v-if="showFiled('salesmanId')">
              <!--            <a-input :disabled='isDetail' :maxLength=30 v-model='model.salesmanId' prop='salesmanId'-->
              <!--                     :placeholder="($t('ErpCustomer.salesmanIdError'))"></a-input>-->
              <a-input
                :disabled="isDetail"
                v-model="showSalesman"
                :placeholder="$t('ErpCustomer.salesmanIdError')"
                @click="
                  visible = false;
                  saleVisible = true;
                "
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpSupplier.financeId')" v-if="showFiled('financeId')">
              <a-select
                :disabled="isDetail"
                v-model="model.financeId"
                show-search
                :placeholder="$t('ErpSupplier.financeIdError')"
                option-filter-prop="children"
              >
                <a-select-option v-for="item in financials" :value="item.id" :key="item.id">
                  {{ item.openAccountName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item :label="$t('ErpCustomer.status')" prop="status" v-if="showFiled('status')">
              <a-switch
                :disabled="isDetail"
                :checked="model.status"
                @change="
                  (check) => {
                    model.status = check;
                  }
                "
                :checked-children="$t('common.enable')"
                :un-checked-children="$t('common.disable')"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
              <a-switch
                :disabled="isDetail"
                :checked="model.delFlag"
                @change="
                  (check) => {
                    model.delFlag = check;
                  }
                "
                :checked-children="$t('common.enable')"
                :un-checked-children="$t('common.disable')"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.createBy')" v-if="showFiled('createBy')">
              <a-input
                :disabled="isDetail"
                :maxLength="30"
                v-model="model.createBy"
                :placeholder="$t('ErpCustomer.createByError')"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.createTime')" v-if="showFiled('createTime')">
              <j-date
                :disabled="isDetail || isEdit"
                v-model="model.createTime"
                :show-time="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.updateBy')" v-if="showFiled('updateBy')">
              <a-input
                :disabled="isDetail"
                :maxLength="30"
                v-model="model.updateBy"
                :placeholder="$t('ErpCustomer.updateByError')"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.updateTime')" v-if="showFiled('updateTime')">
              <j-date
                :disabled="isDetail || isEdit"
                v-model="model.updateTime"
                :show-time="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('ErpCustomer.deptId')" v-if="showFiled('deptId')">
              <a-input
                :disabled="isDetail"
                :maxLength="30"
                v-model="model.deptId"
                :placeholder="$t('ErpCustomer.deptIdError')"
              ></a-input>
            </a-form-model-item>
          </a-row>
        </a-form-model>
      </a-spin>
    </j-modal>
    <OrgaView v-model="saleVisible" disable-dept disable-role :maxPerson="1" @ok="handleOrga" />
  </div>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin';
import API from '@/api/ErpCustomer';
import ErpConfig from '@/api/ErpConfig';
import JDate from '@/components/jeecg/JDate';
import JSelectContactsByRegion from '@comp/jeecgbiz/JSelectContactsByRegion';
import JSelectFinancialInfo from '@comp/jeecgbiz/JSelectFinancialInfo';
import ErpFinancialInfo from '@/api/ErpFinancialInfo';
import OrgaView from '@/components/laison/OrgaStructureModal';
import LSelectRegion from '@comp/laison/laisondefault/LSelectRegion';
// API.existByCode
export default {
  name: 'ErpCustomerModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    JSelectContactsByRegion,
    JSelectFinancialInfo,
    OrgaView,
    LSelectRegion,
  },
  watch: {
    saleVisible: {
      handler: function (val) {
        this.visible = !val;
      },
    },
  },
  data() {
    return {
      visible: false,
      saleVisible: false,
      disableSubmit: false,
      confirmLoading: false,
      showSalesman: '',
      levelList: [],
      financials: [],
      currencyList: [],
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
        regionCode: [
          { required: true, message: this.$t('ErpContacts.regionCodeError'), trigger: 'blur' },
          { message: this.$t('ErpContacts.regionCodeError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     // debugger
          //     let reg = /^[^\s].{0,1024}[^\s]$/gi
          //     let error = value == undefined || value == null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpContacts.regionCodeError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],
        address: [
          { required: true, message: this.$t('ErpContacts.addressError'), trigger: 'blur' },
          { max: 100, message: this.$t('ErpContacts.addressError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     // debugger

          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value == undefined || value == null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpContacts.addressError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],
        id: [
          { required: true, message: this.$t('ErpCustomer.idError'), trigger: 'blur' },
          { message: this.$t('ErpCustomer.idError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.idError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],
        customerNo: [
          { required: true, message: this.$t('ErpCustomer.customerNoError'), trigger: 'blur' },
          { message: this.$t('ErpCustomer.customerNoError'), trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              if (value.trim() === '') {
                callback();
                return;
              }
              if (this.type === 'add') {
                let exist = (await API.existByCode(value.trim())).data;
                exist ? callback(new Error(this.$t('ErpCustomer.customerExisted'))) : callback();
              } else {
                callback();
              }
            },
            trigger: ['change', 'blur'],
          },
        ],

        name: [
          { required: true, message: this.$t('ErpCustomer.nameError'), trigger: 'blur' },
          { max: 50, message: this.$t('ErpCustomer.nameError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.nameError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        briefIntro: [
          { required: true, message: this.$t('ErpCustomer.briefIntroError'), trigger: 'blur' },
          { max: 200, message: this.$t('ErpCustomer.briefIntroError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.briefIntroError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        level: [
          { required: true, message: this.$t('ErpCustomer.levelIdError'), trigger: 'blur' },
          { max: 50, message: this.$t('ErpCustomer.levelIdError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.levelIdError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        personalInfoId: [
          { required: true, message: this.$t('ErpCustomer.personalInfoIdError'), trigger: 'blur' },
          { message: this.$t('ErpCustomer.personalInfoIdError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.personalInfoIdError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        financeId: [
          { required: true, message: this.$t('ErpCustomer.financeIdError'), trigger: 'blur' },
          { message: this.$t('ErpCustomer.financeIdError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.financeIdError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        salesmanId: [
          { required: true, message: this.$t('ErpCustomer.salesmanIdError'), trigger: 'blur' },
          { message: this.$t('ErpCustomer.salesmanIdError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.salesmanIdError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],
        currencySymbol: [
          { required: true, message: this.$t('ErpCustomer.currencySymbolError'), trigger: 'blur' },
          { max: 50, message: this.$t('ErpCustomer.currencySymbolError'), trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     let reg = /^[^\s].{0,98}[^\s]$/gi
          //     let error = value === undefined || value === null || !reg.test(value)
          //     if (error) {
          //       callback(new Error(this.$t('ErpCustomer.currencySymbolError')))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur',
          // },
        ],

        // belongDeptId: [
        //
        //   {
        //     validator: (rule, value, callback) => {
        //       let reg = /^[^\s].{0,98}[^\s]$/ig
        //       let error = value === undefined || value === null || !reg.test(value)
        //       if (error) {
        //         callback(new Error(this.$t('ErpCustomer.belongDeptIdError')))
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
              let error = value === undefined || value === null;
              if (error || value < 0) {
                callback(new Error(this.$t('ErpCustomer.statusError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        delFlag: [
          {
            validator: (rule, value, callback) => {
              let error = value === undefined || value === null;
              if (error || value < 0) {
                callback(new Error(this.$t('ErpCustomer.delFlagError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.loadFinancials();
  },
  methods: {
    onRegionSelect(region) {
      this.model.regionCode = region;
    },
    buildSalesmanName() {
      let res;
      let slId = this.model.salesmanId;
      if (slId && slId.indexOf('_') > -1) {
        res = slId.split('_')[1];
      } else {
        res = slId;
      }
      this.showSalesman = res;
    },

    handleOrga(orgas) {
      let res = orgas.find((it) => it.type === 'person');
      let persons = res.taglist;
      if (persons && persons.length > 0) {
        this.model.salesmanId = persons[0].id + '_' + persons[0].showName;
        this.buildSalesmanName();
      }
    },

    async loadFinancials() {
      let financials = await ErpFinancialInfo.findByAll({ condition: {} });
      this.financials = financials;

      let currencySymbol = await ErpConfig.findByCode('hbfh');
      if (currencySymbol) {
        this.currencyList = JSON.parse(currencySymbol.configJson);
      }

      let levels = await ErpConfig.findByCode('khjb');
      if (levels) {
        this.levelList = JSON.parse(levels.configJson);
      }
    },

    onContactsSelectEvent(contacts) {
      this.model.personalInfoId = '';
      if (contacts) {
        this.model.personalInfoId = contacts[0].id;
      }
    },
    async show(record) {
      console.log(record, '--line550');
      if (
        this.$store.getters.userInfo.sysDept.config.modalLayoutType != undefined &&
        this.$store.getters.userInfo.sysDept.config.modalLayoutType
      ) {
        //读取配置   如果时左右显示的
        (this.labelCol = {
          xs: { span: 24 },
          sm: { span: 6 },
        }),
          (this.wrapperCol = {
            xs: { span: 24 },
            sm: { span: 16 },
          });
      } else {
        //上下显示的

        (this.labelCol = {
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
          });
      }

      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      // this.$forceUpdate()
      // this.model = JSON.parse(JSON.stringify(record))
      this.model = Object.assign({}, record);
      if (!this.model.regionCode) {
        this.$set(this.model, 'regionCode', null);
      }

      this.buildSalesmanName();
      this.visible = true;

      //清除form的验证
    },

    /** 确定按钮点击事件 */
    handleOk(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let fn = this.getFn(); //获取方法

          fn(this.model).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
            } else {
              this.$message.warning(res.errors);
            }
            this.$emit('ok');
            this.visible = false;
          });
        }
      });
    },
    getFn() {
      if (this.isAdd) {
        return API.add;
      } else if (this.isEdit) {
        return API.update;
      }
    },
    validateError(msg) {
      this.$message.error(msg);
    },
    showFiled(filedName) {
      let config = this.$store.getters.userInfo.sysDept.config.erpCustomerAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
  },
};
</script>

<style scoped></style>
