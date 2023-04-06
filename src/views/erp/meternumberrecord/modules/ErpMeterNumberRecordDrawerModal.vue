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
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.orderId')" prop="orderId" v-if="showFiled('orderId')">
	                  		<a-input :disabled="isDetail" v-model="model.orderId" prop="orderId" placeholder="请输入orderId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.stockCode')" prop="stockCode" v-if="showFiled('stockCode')">
	                  		<a-input :disabled="isDetail" v-model="model.stockCode" prop="stockCode" placeholder="请输入stockCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.length')" prop="length" v-if="showFiled('length')">
	                        <a-input-number :disabled="isDetail" v-model="model.length" placeholder="请输入length" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.prifix')" prop="prifix" v-if="showFiled('prifix')">
	                  		<a-input :disabled="isDetail" v-model="model.prifix" prop="prifix" placeholder="请输入prifix" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.roleCode')" prop="roleCode" v-if="showFiled('roleCode')">
	                  		<a-input :disabled="isDetail" v-model="model.roleCode" prop="roleCode" placeholder="请输入roleCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.serialNumberLength')" prop="serialNumberLength" v-if="showFiled('serialNumberLength')">
	                        <a-input-number :disabled="isDetail" v-model="model.serialNumberLength" placeholder="请输入serialNumberLength" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.numberCount')" prop="numberCount" v-if="showFiled('numberCount')">
	                        <a-input-number :disabled="isDetail" v-model="model.numberCount" placeholder="请输入numberCount" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.startNumber')" prop="startNumber" v-if="showFiled('startNumber')">
	                  		<a-input :disabled="isDetail" v-model="model.startNumber" prop="startNumber" placeholder="请输入startNumber" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.start')" prop="start" v-if="showFiled('start')">
	                        <a-input-number :disabled="isDetail" v-model="model.start" placeholder="请输入start" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.endNumber')" prop="endNumber" v-if="showFiled('endNumber')">
	                  		<a-input :disabled="isDetail" v-model="model.endNumber" prop="endNumber" placeholder="请输入endNumber" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.end')" prop="end" v-if="showFiled('end')">
	                        <a-input-number :disabled="isDetail" v-model="model.end" placeholder="请输入end" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" v-model="model.deptId" prop="deptId" placeholder="请输入deptId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="form.delFlag" @change="(check) => { model.delFlag=check}" checked-children="$t('delFlag_true')" un-checked-children="$t('delFlag_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.state')" prop="state" v-if="showFiled('state')">
	                        <a-input-number :disabled="isDetail" v-model="model.state" placeholder="请输入state" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.fileUrl')" prop="fileUrl" v-if="showFiled('fileUrl')">
	                  		<a-input :disabled="isDetail" v-model="model.fileUrl" prop="fileUrl" placeholder="请输入fileUrl" ></a-input>
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
  import API   from '@/api/ErpMeterNumberRecord'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'ErpMeterNumberRecordModal',
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
          orderId:[{required: true, message: '请输入',trigger: 'blur'}],
          stockCode:[{required: true, message: '请输入',trigger: 'blur'}],
          length:[{required: true, message: '请输入',trigger: 'blur'}],
          prifix:[{required: true, message: '请输入',trigger: 'blur'}],
          roleCode:[{required: true, message: '请输入',trigger: 'blur'}],
          serialNumberLength:[{required: true, message: '请输入',trigger: 'blur'}],
          numberCount:[{required: true, message: '请输入',trigger: 'blur'}],
          startNumber:[{required: true, message: '请输入',trigger: 'blur'}],
          start:[{required: true, message: '请输入',trigger: 'blur'}],
          endNumber:[{required: true, message: '请输入',trigger: 'blur'}],
          end:[{required: true, message: '请输入',trigger: 'blur'}],
          deptId:[{required: true, message: '请输入',trigger: 'blur'}],
          delFlag:[{required: true, message: '请输入',trigger: 'blur'}],
          state:[{required: true, message: '请输入',trigger: 'blur'}],
          createTime:[{required: true, message: '请输入',trigger: 'blur'}],
          fileUrl:[{required: true, message: '请输入',trigger: 'blur'}],
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
           let config = this.$store.getters.userInfo.sysDept.config.erpMeterNumberRecordAddFiled
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