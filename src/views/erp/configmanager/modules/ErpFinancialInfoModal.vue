<template>
   <j-modal
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
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
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.openAccountName" prop="openAccountName" placeholder="openAccountName" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.openAccountBank')" prop="openAccountBank" v-if="showFiled('openAccountBank')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.openAccountBank" prop="openAccountBank" placeholder="openAccountBank" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.bankAccount')" prop="bankAccount" v-if="showFiled('bankAccount')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.bankAccount" prop="bankAccount" placeholder="bankAccount" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.invoiceHeader')" prop="invoiceHeader" v-if="showFiled('invoiceHeader')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.invoiceHeader" prop="invoiceHeader" placeholder="invoiceHeader" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.taxpayerIdNumber')" prop="taxpayerIdNumber" v-if="showFiled('taxpayerIdNumber')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.taxpayerIdNumber" prop="taxpayerIdNumber" placeholder="taxpayerIdNumber" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.status')" prop="status" v-if="showFiled('status')">
	                  		<a-switch :disabled="isDetail" :checked="model.status" @change="(check) => { model.status=check}" :checked-children="$t('common.enable')" :un-checked-children="$t('common.disable')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="model.delFlag" @change="(check) => { model.delFlag=check}" :checked-children="$t('common.enable')" :un-checked-children="$t('common.disable')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.createBy')" prop="createBy" v-if="showFiled('createBy')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.createBy" prop="createBy" placeholder="createBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.updateBy" prop="updateBy" placeholder="updateBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.updateTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpFinancialInfo.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.deptId" prop="deptId" placeholder="deptId" ></a-input>
	                  </a-form-model-item>

                </a-row>
            </a-form-model>
             
        
       <!--        </a-tab-pane>-->
<!--      </a-tabs>-->
    </a-spin>
  </j-modal>
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
          id:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.idError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          openAccountName:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.openAccountNameError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          openAccountBank:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.openAccountBankError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          bankAccount:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.bankAccountError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          invoiceHeader:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.invoiceHeaderError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          taxpayerIdNumber:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.taxpayerIdNumberError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          status:[
          
	       
	       
				{
              
	              validator: (rule,value,callback) =>{  
	                  
	                  let error=value==undefined||value==null
	                  if(error||value<0){
	                      callback(new Error(this.$t('ErpFinancialInfo.statusError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            } 
	         
			],
			
          delFlag:[
          
	       
	       
				{
              
	              validator: (rule,value,callback) =>{  
	                  
	                  let error=value==undefined||value==null
	                  if(error||value<0){
	                      callback(new Error(this.$t('ErpFinancialInfo.delFlagError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            } 
	         
			],
			
          createBy:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.createByError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          createTime:[
          
	       
	       
			],
			
          updateBy:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.updateByError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          updateTime:[
          
	       
	       
			],
			
          deptId:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpFinancialInfo.deptIdError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
        }
      }
    },
    methods: {
        getAllTable() {
            
        },
        /** 调用完edit()方法之后会自动调用此方法 */
        editAfter() {
            
        
        },
        async show(record){
      if (this.$store.getters.userInfo.sysDept.config.modalLayoutType != undefined && this.$store.getters.userInfo.sysDept.config.modalLayoutType) {//读取配置   如果时左右显示的
        this.labelCol = {
          xs: { span: 24 },
          sm: { span: 6 },
        },
          this.wrapperCol = {
            xs: { span: 24 },
            sm: { span: 16 },
          }
      } else {//上下显示的

        this.labelCol = {
          xxl: 24, // ≥1600px 响应式栅格
          xl: 24, // ≥1200px 响应式栅格
          lg: 10, // ≥992px 响应式栅格
          md: 12, // ≥768px 响应式栅格
          style:localStorage.getItem('language') == 'ar_EG' ? 'text-align:right' : ''//针对阿拉伯的样式绑定，解决行列布局覆盖labelAlign:'right'的问题

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
		  if(this.$refs.ruleForm){
			  this.$refs.ruleForm.resetFields()
		  }
          
          this.model = Object.assign({}, record)
          
          
          this.visible = true
        },
      
       /** 确定按钮点击事件 */
        handleOk(e) {
           e.preventDefault();
           this.$refs.ruleForm.validate(valid => {
              if (valid) {
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
		       } 
            });
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