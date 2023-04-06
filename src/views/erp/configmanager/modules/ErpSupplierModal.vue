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

      <a-form-model ref="ruleForm" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-form-model-item label="id" v-show="false">
            <a-input v-model="model.id"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.name')" prop="name" v-if="showFiled('name')">
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.name"
              prop="name"
              :placeholder="$t('ErpSupplier.name')"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.briefIntro')" prop="briefIntro" v-if="showFiled('briefIntro')">
            <a-textarea
              :disabled="isDetail"
              :maxLength="500"
              v-model="model.briefIntro"
              prop="briefIntro"
              :placeholder="$t('ErpSupplier.briefIntro')"
            ></a-textarea>
          </a-form-model-item>
          <!--	              	  <a-form-model-item :label="$t('ErpSupplier.regionCode')" prop="regionCode" v-if="showFiled('regionCode')">-->
          <!--	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.regionCode" prop="regionCode" placeholder="regionCode" ></a-input>-->
          <!--	                  </a-form-model-item>-->
          <!--区域-->
          <a-form-model-item :disabled="isDetail" :label="$t('ErpSupplier.regionCode')" v-if="showFiled('regionCode')">
            <!--            <a-cascader :placeholder="$t('user.deptName')" v-model='selectRegions' :options='sysRegions'-->
            <!--                        :fieldNames='fieldNames' expandTrigger='hover' :changeOnSelect='changeOnRegionSelect'-->
            <!--                        :disabled='isDetail' @change='regionChange' />-->

            <LSelectRegion
              :disabled="isDetail"
              :value="model.regionCode"
              @regionSelect="onRegionSelect"
            ></LSelectRegion>
          </a-form-model-item>

          <a-form-model-item :label="$t('ErpSupplier.address')" prop="address" v-if="showFiled('address')">
            <a-textarea
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.address"
              prop="address"
              :placeholder="$t('ErpSupplier.address')"
            ></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.levelId')" prop="level" v-if="showFiled('level')">
            <a-select
              :disabled="isDetail"
              v-model="model.level"
              show-search
              :placeholder="$t('ErpSupplier.levelId')"
              option-filter-prop="children"
            >
              <a-select-option v-for="item in levels" :value="item.name" :key="item.codeNumber">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.contactId')" v-if="showFiled('contactId')">
            <a-select
              :disabled="isDetail"
              v-model="model.contactId"
              show-search
              :placeholder="$t('ErpSupplier.contactIdError')"
              option-filter-prop="children"
            >
              <a-select-option v-for="item in contacts" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
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
          <a-form-model-item
            :label="$t('ErpSupplier.isManufacturer')"
            prop="isManufacturer"
            v-if="showFiled('isManufacturer')"
          >
            <a-switch
              :disabled="isDetail"
              :checked="model.isManufacturer"
              @change="
                (check) => {
                  model.isManufacturer = check;
                }
              "
              :checked-children="$t('common.enable')"
              :un-checked-children="$t('common.disable')"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.status')" prop="status" v-if="showFiled('status')">
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
          <a-form-model-item :label="$t('ErpSupplier.delFlag')" v-if="showFiled('delFlag')">
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
          <a-form-model-item :label="$t('ErpSupplier.createBy')" v-if="showFiled('createBy')">
            <a-input
              :disabled="isDetail"
              :maxLength="30"
              v-model="model.createBy"
              prop="createBy"
              placeholder="createBy"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.createTime')" v-if="showFiled('createTime')">
            <j-date
              :disabled="isDetail || isEdit"
              v-model="model.createTime"
              :show-time="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.updateBy')" v-if="showFiled('updateBy')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.updateBy" placeholder="updateBy"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.updateTime')" v-if="showFiled('updateTime')">
            <j-date
              :disabled="isDetail || isEdit"
              v-model="model.updateTime"
              :show-time="true"
              date-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpSupplier.deptId')" v-if="showFiled('deptId')">
            <a-input :disabled="isDetail" :maxLength="30" v-model="model.deptId" placeholder="deptId"></a-input>
          </a-form-model-item>
        </a-row>
      </a-form-model>

      <!--        </a-tab-pane>-->
      <!--      </a-tabs>-->
    </a-spin>
  </j-modal>
</template>

<script>
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil';
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin';
import API from '@/api/ErpSupplier';
import ErpConfig from '@/api/ErpConfig';
import JDate from '@/components/jeecg/JDate';
import RegionInfo from '@/api/RegionInfo';
import ErpContacts from '@/api/ErpContacts';
import ErpFinancialInfo from '@/api/ErpFinancialInfo';
import LSelectRegion from '@comp/laison/laisondefault/LSelectRegion';

export default {
  name: 'ErpSupplierModal',
  mixins: [JEditableTableMixin],
  components: {
    JDate,
    LSelectRegion,
  },
  data() {
    return {
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      fieldNames: {
        value: 'id',
        label: 'regionName',
        children: 'children',
      },
      levels: [],
      sysRegions: [],
      selectRegions: [],
      contacts: [],
      financials: [],
      changeOnRegionSelect: true,
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
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.idError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        name: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.nameError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        briefIntro: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.briefIntroError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        regionCode: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.regionCodeError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        address: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.addressError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        level: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.levelIdError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        contactId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.contactIdError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        financeId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.financeIdError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        isManufacturer: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null;
              if (error || value < 0) {
                callback(new Error(this.$t('ErpSupplier.isManufacturerError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        status: [
          {
            validator: (rule, value, callback) => {
              let error = value == undefined || value == null;
              if (error || value < 0) {
                callback(new Error(this.$t('ErpSupplier.statusError')));
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
              let error = value == undefined || value == null;
              if (error || value < 0) {
                callback(new Error(this.$t('ErpSupplier.delFlagError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        createBy: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.createByError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        createTime: [],

        updateBy: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.updateByError')));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],

        updateTime: [],

        deptId: [
          {
            validator: (rule, value, callback) => {
              let reg = /^[^\s].{0,98}[^\s]$/gi;
              let error = value == undefined || value == null || !reg.test(value);
              if (error) {
                callback(new Error(this.$t('ErpSupplier.deptIdError')));
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
    this.loadDefaultData();
  },
  methods: {
    async loadDefaultData() {
      let contacts = await ErpContacts.findByAll({ condition: {} });
      this.contacts = contacts;
      let financials = await ErpFinancialInfo.findByAll({ condition: {} });
      this.financials = financials;
      let regions = await RegionInfo.findDeptRegions();
      if (regions.success) {
        this.sysRegions = regions.data;
      }
      let level_ = await ErpConfig.findByCode('gysjb');
      if (level_) {
        this.levels = JSON.parse(level_.configJson);
      }
      console.log('levels', this.levels);
    },
    onRegionSelect(regions) {
      this.model.regionCode = regions;
    },
    getAllTable() {},
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {},
    async show(record) {
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

      //清除form的验证
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }

      this.model = Object.assign({}, record);

      this.visible = true;
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
      let config = this.$store.getters.userInfo.sysDept.config.erpSupplierAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
  },
};
</script>

<style scoped></style>
