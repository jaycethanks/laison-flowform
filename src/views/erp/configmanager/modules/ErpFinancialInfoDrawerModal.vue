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
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">

<!--  <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
      <!--主表区域 -->
<!--     <a-tab-pane tab="SysRole" key="SysRole" :forceRender="true">-->
     
            <a-form-model 
				ref="ruleForm"
              :model="model"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol">
                <a-row>
	                  <a-form-model-item label="id"  v-show=false>
	                      <a-input v-model="model.id"></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.openAccountName')" prop="openAccountName" v-if="showFiled('openAccountName')">
	                  		<a-input :disabled="isDetail" v-model="model.openAccountName" prop="openAccountName" placeholder="请输入openAccountName" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.openAccountBank')" prop="openAccountBank" v-if="showFiled('openAccountBank')">
	                  		<a-input :disabled="isDetail" v-model="model.openAccountBank" prop="openAccountBank" placeholder="请输入openAccountBank" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.bankAccount')" prop="bankAccount" v-if="showFiled('bankAccount')">
	                  		<a-input :disabled="isDetail" v-model="model.bankAccount" prop="bankAccount" placeholder="请输入bankAccount" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.invoiceHeader')" prop="invoiceHeader" v-if="showFiled('invoiceHeader')">
	                  		<a-input :disabled="isDetail" v-model="model.invoiceHeader" prop="invoiceHeader" placeholder="请输入invoiceHeader" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.taxpayerIdNumber')" prop="taxpayerIdNumber" v-if="showFiled('taxpayerIdNumber')">
	                  		<a-input :disabled="isDetail" v-model="model.taxpayerIdNumber" prop="taxpayerIdNumber" placeholder="请输入taxpayerIdNumber" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.status')" prop="status" v-if="showFiled('status')">
	                  		<a-switch :disabled="isDetail" :checked="form.status" @change="(check) => { model.status=check}" checked-children="$t('status_true')" un-checked-children="$t('status_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="form.delFlag" @change="(check) => { model.delFlag=check}" checked-children="$t('delFlag_true')" un-checked-children="$t('delFlag_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.createBy')" prop="createBy" v-if="showFiled('createBy')">
	                  		<a-input :disabled="isDetail" v-model="model.createBy" prop="createBy" placeholder="请输入createBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
	                  		<a-input :disabled="isDetail" v-model="model.updateBy" prop="updateBy" placeholder="请输入updateBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.updateTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" v-model="model.deptId" prop="deptId" placeholder="请输入deptId" ></a-input>
	                  </a-form-model-item>

                </a-row>
            </a-form-model>
       <!--        </a-tab-pane>-->
<!--      </a-tabs>-->
    </a-spin>
  </a-drawer>
</template>

<script>
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import API   from '@/api/ErpFinancialInfo'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'ErpFinancialInfoModal',
    mixins: [JEditableTableMixin],
    components: {
      JDate,
    },
    data() {
      return {
        visible: false,
        disableSubmit:false,
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
        rules:{
          id:[{required: true, message: '请输入',trigger: 'blur'}],
          openAccountName:[{required: true, message: '请输入',trigger: 'blur'}],
          openAccountBank:[{required: true, message: '请输入',trigger: 'blur'}],
          bankAccount:[{required: true, message: '请输入',trigger: 'blur'}],
          invoiceHeader:[{required: true, message: '请输入',trigger: 'blur'}],
          taxpayerIdNumber:[{required: true, message: '请输入',trigger: 'blur'}],
          status:[{required: true, message: '请输入',trigger: 'blur'}],
          delFlag:[{required: true, message: '请输入',trigger: 'blur'}],
          createBy:[{required: true, message: '请输入',trigger: 'blur'}],
          createTime:[{required: true, message: '请输入',trigger: 'blur'}],
          updateBy:[{required: true, message: '请输入',trigger: 'blur'}],
          updateTime:[{required: true, message: '请输入',trigger: 'blur'}],
          deptId:[{required: true, message: '请输入',trigger: 'blur'}],
        }
      }
    },
    methods: {
        getAllTable() {
            
        },
        /** 调用完edit()方法之后会自动调用此方法 */
        editAfter() {
            
        
        },
      
       /** 确定按钮点击事件 */
        handleOk(e) {
           e.preventDefault();
           let fn=this.getFn();//获取方法
           
           fn(this.model).then((res) => {
             if (res.code === 0) {
               this.$message.success(res.msg);
             } else {
               this.$message.warning(res.errors);
             }
             this.$emit('ok');
             this.visible=false
           })
        },
        getFn(){
           if(this.isAdd){ return API.add;}else if(this.isEdit){return API.update;}
        },
        validateError(msg){
            this.$message.error(msg)
        },
        showFiled(filedName){
           let config = this.$store.getters.userInfo.sysDept.config.erpFinancialInfoAddFiled
           config=config ==undefined ?0:config
           let indexOfFiled=API.filedList.indexOf(filedName)
           let flag=1<<indexOfFiled;
           return !(config&flag)
        }

    }
  }
</script>

<style scoped>
</style>