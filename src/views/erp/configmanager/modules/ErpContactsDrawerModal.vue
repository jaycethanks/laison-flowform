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
	              	  <a-form-model-item :label="$t('ErpContacts.name')" prop="name" v-if="showFiled('name')">
	                  		<a-input :disabled="isDetail" v-model="model.name" prop="name" placeholder="请输入name" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.mobile')" prop="mobile" v-if="showFiled('mobile')">
	                  		<a-input :disabled="isDetail" v-model="model.mobile" prop="mobile" placeholder="请输入mobile" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.telephone')" prop="telephone" v-if="showFiled('telephone')">
	                  		<a-input :disabled="isDetail" v-model="model.telephone" prop="telephone" placeholder="请输入telephone" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.email')" prop="email" v-if="showFiled('email')">
	                  		<a-input :disabled="isDetail" v-model="model.email" prop="email" placeholder="请输入email" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.position')" prop="position" v-if="showFiled('position')">
	                  		<a-input :disabled="isDetail" v-model="model.position" prop="position" placeholder="请输入position" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.regionCode')" prop="regionCode" v-if="showFiled('regionCode')">
	                  		<a-input :disabled="isDetail" v-model="model.regionCode" prop="regionCode" placeholder="请输入regionCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.address')" prop="address" v-if="showFiled('address')">
	                  		<a-input :disabled="isDetail" v-model="model.address" prop="address" placeholder="请输入address" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.status')" prop="status" v-if="showFiled('status')">
	                  		<a-switch :disabled="isDetail" :checked="form.status" @change="(check) => { model.status=check}" checked-children="$t('status_true')" un-checked-children="$t('status_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="form.delFlag" @change="(check) => { model.delFlag=check}" checked-children="$t('delFlag_true')" un-checked-children="$t('delFlag_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.createBy')" prop="createBy" v-if="showFiled('createBy')">
	                  		<a-input :disabled="isDetail" v-model="model.createBy" prop="createBy" placeholder="请输入createBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
	                  		<a-input :disabled="isDetail" v-model="model.updateBy" prop="updateBy" placeholder="请输入updateBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.updateTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpContacts.deptId')" prop="deptId" v-if="showFiled('deptId')">
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
  import API   from '@/api/ErpContacts'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'ErpContactsModal',
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
          mobile:[{required: true, message: '请输入',trigger: 'blur'}],
          telephone:[{required: true, message: '请输入',trigger: 'blur'}],
          email:[{required: true, message: '请输入',trigger: 'blur'}],
          position:[{required: true, message: '请输入',trigger: 'blur'}],
          regionCode:[{required: true, message: '请输入',trigger: 'blur'}],
          address:[{required: true, message: '请输入',trigger: 'blur'}],
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
           let config = this.$store.getters.userInfo.sysDept.config.erpContactsAddFiled
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