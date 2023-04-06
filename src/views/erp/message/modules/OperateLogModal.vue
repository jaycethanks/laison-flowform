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
	              	  <a-form-model-item :label="$t('OperateLog.userId')" prop="userId" v-if="showFiled('userId')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.userId" prop="userId" placeholder="userId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.deptId" prop="deptId" placeholder="deptId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.ip')" prop="ip" v-if="showFiled('ip')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.ip" prop="ip" placeholder="ip" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.time')" prop="time" v-if="showFiled('time')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.time"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.uri')" prop="uri" v-if="showFiled('uri')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.uri" prop="uri" placeholder="uri" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.param')" prop="param" v-if="showFiled('param')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.param" prop="param" placeholder="param" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.result')" prop="result" v-if="showFiled('result')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.result" prop="result" placeholder="result" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.consumeTime')" prop="consumeTime" v-if="showFiled('consumeTime')">
	                        <a-input-number :disabled="isDetail" v-model="model.consumeTime" :max=100 :min=0 :precision=0 placeholder="consumeTime" style="width: 100%" />
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
  import API   from '@/api/OperateLog'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'OperateLogModal',
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
	                      callback(new Error(this.$t('OperateLog.idError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          userId:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.userIdError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          deptId:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.deptIdError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          ip:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.ipError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          time:[
          
	       
	       
			],
			
          uri:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.uriError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          param:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.paramError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          result:[
          
				{
	              validator: (rule,value,callback) =>{  
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.resultError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }
	         
	       
	       
			],
			
          consumeTime:[
          
				{
              
	              validator: (rule,value,callback) =>{  
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('OperateLog.consumeTimeError')));
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
           let config = this.$store.getters.userInfo.sysDept.config.operateLogAddFiled
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