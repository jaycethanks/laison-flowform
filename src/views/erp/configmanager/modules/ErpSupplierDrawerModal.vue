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
	              	  <a-form-model-item :label="$t('ErpSupplier.name')" prop="name" v-if="showFiled('name')">
	                  		<a-input :disabled="isDetail" v-model="model.name" prop="name" placeholder="请输入name" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.briefIntro')" prop="briefIntro" v-if="showFiled('briefIntro')">
	                  		<a-input :disabled="isDetail" v-model="model.briefIntro" prop="briefIntro" placeholder="请输入briefIntro" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.regionCode')" prop="regionCode" v-if="showFiled('regionCode')">
	                  		<a-input :disabled="isDetail" v-model="model.regionCode" prop="regionCode" placeholder="请输入regionCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.address')" prop="address" v-if="showFiled('address')">
	                  		<a-input :disabled="isDetail" v-model="model.address" prop="address" placeholder="请输入address" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.levelId')" prop="levelId" v-if="showFiled('levelId')">
	                  		<a-input :disabled="isDetail" v-model="model.levelId" prop="levelId" placeholder="请输入levelId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.contactId')" prop="contactId" v-if="showFiled('contactId')">
	                  		<a-input :disabled="isDetail" v-model="model.contactId" prop="contactId" placeholder="请输入contactId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.financeId')" prop="financeId" v-if="showFiled('financeId')">
	                  		<a-input :disabled="isDetail" v-model="model.financeId" prop="financeId" placeholder="请输入financeId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.isManufacturer')" prop="isManufacturer" v-if="showFiled('isManufacturer')">
	                  		<a-switch :disabled="isDetail" :checked="form.isManufacturer" @change="(check) => { model.isManufacturer=check}" checked-children="$t('isManufacturer_true')" un-checked-children="$t('isManufacturer_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.status')" prop="status" v-if="showFiled('status')">
	                  		<a-switch :disabled="isDetail" :checked="form.status" @change="(check) => { model.status=check}" checked-children="$t('status_true')" un-checked-children="$t('status_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="form.delFlag" @change="(check) => { model.delFlag=check}" checked-children="$t('delFlag_true')" un-checked-children="$t('delFlag_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.createBy')" prop="createBy" v-if="showFiled('createBy')">
	                  		<a-input :disabled="isDetail" v-model="model.createBy" prop="createBy" placeholder="请输入createBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
	                  		<a-input :disabled="isDetail" v-model="model.updateBy" prop="updateBy" placeholder="请输入updateBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.updateTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpSupplier.deptId')" prop="deptId" v-if="showFiled('deptId')">
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
  import API   from '@/api/ErpSupplier'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'ErpSupplierModal',
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
          name:[{required: true, message: '请输入',trigger: 'blur'}],
          briefIntro:[{required: true, message: '请输入',trigger: 'blur'}],
          regionCode:[{required: true, message: '请输入',trigger: 'blur'}],
          address:[{required: true, message: '请输入',trigger: 'blur'}],
          levelId:[{required: true, message: '请输入',trigger: 'blur'}],
          contactId:[{required: true, message: '请输入',trigger: 'blur'}],
          financeId:[{required: true, message: '请输入',trigger: 'blur'}],
          isManufacturer:[{required: true, message: '请输入',trigger: 'blur'}],
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
           let config = this.$store.getters.userInfo.sysDept.config.erpSupplierAddFiled
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