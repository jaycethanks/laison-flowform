<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
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
          <a-form-model-item :label="$t('ErpConfig.configName')" prop="configName" v-if="showFiled('configName')">
            <a-input
              :disabled="isDetail"
              v-model="model.configName"
              prop="configName"
              placeholder="请输入configName"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpConfig.configCode')" prop="configCode" v-if="showFiled('configCode')">
            <a-input
              :disabled="isDetail"
              v-model="model.configCode"
              prop="configCode"
              placeholder="请输入configCode"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpConfig.configJson')" prop="configJson" v-if="showFiled('configJson')">
            <a-input
              :disabled="isDetail"
              v-model="model.configJson"
              prop="configJson"
              placeholder="请输入configJson"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpConfig.deptId')" prop="deptId" v-if="showFiled('deptId')">
            <a-input :disabled="isDetail" v-model="model.deptId" prop="deptId" placeholder="请输入deptId"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpConfig.remark')" prop="remark" v-if="showFiled('remark')">
            <a-input :disabled="isDetail" v-model="model.remark" prop="remark" placeholder="请输入remark"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('ErpConfig.columns')" prop="columns" v-if="showFiled('columns')">
            <a-input :disabled="isDetail" v-model="model.columns" prop="columns" placeholder="请输入columns"></a-input>
          </a-form-model-item>
        </a-row>
      </a-form-model>
      <!--        </a-tab-pane>-->
      <!--      </a-tabs>-->
    </a-spin>
  </a-drawer>
</template>

<script>
import { FormTypes, getRefPromise } from '@/utils/JEditableTableUtil';
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin';
import API from '@/api/ErpConfig';

export default {
  name: 'ErpConfigModal',
  mixins: [JEditableTableMixin],
  components: {},
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
        id: [{ required: true, message: '请输入', trigger: 'blur' }],
        configName: [{ required: true, message: '请输入', trigger: 'blur' }],
        configCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        configJson: [{ required: true, message: '请输入', trigger: 'blur' }],
        deptId: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
        columns: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    };
  },
  methods: {
    getAllTable() {},
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {},

    /** 确定按钮点击事件 */
    handleOk(e) {
      e.preventDefault();
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
      let config = this.$store.getters.userInfo.sysDept.config.erpConfigAddFiled;
      config = config == undefined ? 0 : config;
      let indexOfFiled = API.filedList.indexOf(filedName);
      let flag = 1 << indexOfFiled;
      return !(config & flag);
    },
  },
};
</script>

<style scoped></style>
