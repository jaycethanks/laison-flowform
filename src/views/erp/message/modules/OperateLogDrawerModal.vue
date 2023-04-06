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
	              	  <a-form-model-item :label="$t('OperateLog.userId')" prop="userId" v-if="showFiled('userId')">
	                  		<a-input :disabled="isDetail" v-model="model.userId" prop="userId" placeholder="请输入userId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" v-model="model.deptId" prop="deptId" placeholder="请输入deptId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.ip')" prop="ip" v-if="showFiled('ip')">
	                  		<a-input :disabled="isDetail" v-model="model.ip" prop="ip" placeholder="请输入ip" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.time')" prop="time" v-if="showFiled('time')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.time"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.uri')" prop="uri" v-if="showFiled('uri')">
	                  		<a-input :disabled="isDetail" v-model="model.uri" prop="uri" placeholder="请输入uri" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.param')" prop="param" v-if="showFiled('param')">
	                  		<a-input :disabled="isDetail" v-model="model.param" prop="param" placeholder="请输入param" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.result')" prop="result" v-if="showFiled('result')">
	                  		<a-input :disabled="isDetail" v-model="model.result" prop="result" placeholder="请输入result" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('OperateLog.consumeTime')" prop="consumeTime" v-if="showFiled('consumeTime')">
	                        <a-input-number :disabled="isDetail" v-model="model.consumeTime" placeholder="请输入consumeTime" style="width: 100%" />
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
          id:[{required: true, message: '请输入',trigger: 'blur'}],
          userId:[{required: true, message: '请输入',trigger: 'blur'}],
          deptId:[{required: true, message: '请输入',trigger: 'blur'}],
          ip:[{required: true, message: '请输入',trigger: 'blur'}],
          time:[{required: true, message: '请输入',trigger: 'blur'}],
          uri:[{required: true, message: '请输入',trigger: 'blur'}],
          param:[{required: true, message: '请输入',trigger: 'blur'}],
          result:[{required: true, message: '请输入',trigger: 'blur'}],
          consumeTime:[{required: true, message: '请输入',trigger: 'blur'}],
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