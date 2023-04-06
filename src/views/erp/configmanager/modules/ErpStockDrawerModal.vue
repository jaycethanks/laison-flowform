<template>
  <a-drawer
    :title="title"
    :width="600"
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
	              	  <a-form-model-item :label="$t('ErpStock.stockCode')" prop="stockCode" v-if="showFiled('stockCode')">
	                  		<a-input :disabled="isDetail" v-model="model.stockCode" prop="stockCode" placeholder="请输入stockCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.specificationMode')" prop="specificationMode" v-if="showFiled('specificationMode')">
	                  		<a-input :disabled="isDetail" v-model="model.specificationMode" prop="specificationMode" placeholder="请输入specificationMode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.stockName')" prop="stockName" v-if="showFiled('stockName')">
	                  		<a-input :disabled="isDetail" v-model="model.stockName" prop="stockName" placeholder="请输入stockName" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.specificationIntro')" prop="specificationIntro" v-if="showFiled('specificationIntro')">
	                  		<a-input :disabled="isDetail" v-model="model.specificationIntro" prop="specificationIntro" placeholder="请输入specificationIntro" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.meterInfo')" prop="meterInfo" v-if="showFiled('meterInfo')">
	                  		<a-input :disabled="isDetail" v-model="model.meterInfo" prop="meterInfo" placeholder="请输入meterInfo" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.elecMoudle')" prop="elecMoudle" v-if="showFiled('elecMoudle')">
	                  		<a-input :disabled="isDetail" v-model="model.elecMoudle" prop="elecMoudle" placeholder="请输入elecMoudle" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.flow')" prop="flow" v-if="showFiled('flow')">
	                  		<a-input :disabled="isDetail" v-model="model.flow" prop="flow" placeholder="请输入flow" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.pulse')" prop="pulse" v-if="showFiled('pulse')">
	                  		<a-input :disabled="isDetail" v-model="model.pulse" prop="pulse" placeholder="请输入pulse" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.nameEn')" prop="nameEn" v-if="showFiled('nameEn')">
	                  		<a-input :disabled="isDetail" v-model="model.nameEn" prop="nameEn" placeholder="请输入nameEn" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.deliveryFactory')" prop="deliveryFactory" v-if="showFiled('deliveryFactory')">
	                  		<a-input :disabled="isDetail" v-model="model.deliveryFactory" prop="deliveryFactory" placeholder="请输入deliveryFactory" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.drawingNo')" prop="drawingNo" v-if="showFiled('drawingNo')">
	                  		<a-input :disabled="isDetail" v-model="model.drawingNo" prop="drawingNo" placeholder="请输入drawingNo" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.warehouse')" prop="warehouse" v-if="showFiled('warehouse')">
	                  		<a-input :disabled="isDetail" v-model="model.warehouse" prop="warehouse" placeholder="请输入warehouse" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.paramIntro')" prop="paramIntro" v-if="showFiled('paramIntro')">
	                  		<a-input :disabled="isDetail" v-model="model.paramIntro" prop="paramIntro" placeholder="请输入paramIntro" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.extParam')" prop="extParam" v-if="showFiled('extParam')">
	                  		<a-input :disabled="isDetail" v-model="model.extParam" prop="extParam" placeholder="请输入extParam" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.classifyId')" prop="classifyId" v-if="showFiled('classifyId')">
	                  		<a-input :disabled="isDetail" v-model="model.classifyId" prop="classifyId" placeholder="请输入classifyId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.measureGroupUnit')" prop="measureGroupUnit" v-if="showFiled('measureGroupUnit')">
	                  		<a-input :disabled="isDetail" v-model="model.measureGroupUnit" prop="measureGroupUnit" placeholder="请输入measureGroupUnit" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.measureGroupUnitClassify')" prop="measureGroupUnitClassify" v-if="showFiled('measureGroupUnitClassify')">
	                  		<a-input :disabled="isDetail" v-model="model.measureGroupUnitClassify" prop="measureGroupUnitClassify" placeholder="请输入measureGroupUnitClassify" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.measureUnit')" prop="measureUnit" v-if="showFiled('measureUnit')">
	                  		<a-input :disabled="isDetail" v-model="model.measureUnit" prop="measureUnit" placeholder="请输入measureUnit" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.inventoryAttrIds')" prop="inventoryAttrIds" v-if="showFiled('inventoryAttrIds')">
	                  		<a-input :disabled="isDetail" v-model="model.inventoryAttrIds" prop="inventoryAttrIds" placeholder="请输入inventoryAttrIds" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.inventoryAttrJson')" prop="inventoryAttrJson" v-if="showFiled('inventoryAttrJson')">
	                  		<a-input :disabled="isDetail" v-model="model.inventoryAttrJson" prop="inventoryAttrJson" placeholder="请输入inventoryAttrJson" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.buyer')" prop="buyer" v-if="showFiled('buyer')">
	                  		<a-input :disabled="isDetail" v-model="model.buyer" prop="buyer" placeholder="请输入buyer" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.productionDept')" prop="productionDept" v-if="showFiled('productionDept')">
	                  		<a-input :disabled="isDetail" v-model="model.productionDept" prop="productionDept" placeholder="请输入productionDept" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.purchasePrice')" prop="purchasePrice" v-if="showFiled('purchasePrice')">
	                        <a-input-number :disabled="isDetail" v-model="model.purchasePrice" placeholder="请输入purchasePrice" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.sellingPrice')" prop="sellingPrice" v-if="showFiled('sellingPrice')">
	                        <a-input-number :disabled="isDetail" v-model="model.sellingPrice" placeholder="请输入sellingPrice" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.status')" prop="status" v-if="showFiled('status')">
	                  		<a-switch :disabled="isDetail" :checked="form.status" @change="(check) => { model.status=check}" checked-children="$t('status_true')" un-checked-children="$t('status_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">
	                  		<a-switch :disabled="isDetail" :checked="form.delFlag" @change="(check) => { model.delFlag=check}" checked-children="$t('delFlag_true')" un-checked-children="$t('delFlag_false')" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.createBy')" prop="createBy" v-if="showFiled('createBy')">
	                  		<a-input :disabled="isDetail" v-model="model.createBy" prop="createBy" placeholder="请输入createBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.updateBy')" prop="updateBy" v-if="showFiled('updateBy')">
	                  		<a-input :disabled="isDetail" v-model="model.updateBy" prop="updateBy" placeholder="请输入updateBy" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.updateTime')" prop="updateTime" v-if="showFiled('updateTime')">
	                        <j-date :disabled="isDetail || isEdit" v-model="model.updateTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />	
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpStock.deptId')" prop="deptId" v-if="showFiled('deptId')">
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
  import API   from '@/api/ErpStock'
  import JDate from '@/components/jeecg/JDate'
  
  export default {
    name: 'ErpStockModal',
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
          stockCode:[{required: true, message: '请输入',trigger: 'blur'}],
          specificationMode:[{required: true, message: '请输入',trigger: 'blur'}],
          stockName:[{required: true, message: '请输入',trigger: 'blur'}],
          specificationIntro:[{required: true, message: '请输入',trigger: 'blur'}],
          meterInfo:[{required: true, message: '请输入',trigger: 'blur'}],
          elecMoudle:[{required: true, message: '请输入',trigger: 'blur'}],
          flow:[{required: true, message: '请输入',trigger: 'blur'}],
          pulse:[{required: true, message: '请输入',trigger: 'blur'}],
          nameEn:[{required: true, message: '请输入',trigger: 'blur'}],
          deliveryFactory:[{required: true, message: '请输入',trigger: 'blur'}],
          drawingNo:[{required: true, message: '请输入',trigger: 'blur'}],
          warehouse:[{required: true, message: '请输入',trigger: 'blur'}],
          paramIntro:[{required: true, message: '请输入',trigger: 'blur'}],
          extParam:[{required: true, message: '请输入',trigger: 'blur'}],
          classifyId:[{required: true, message: '请输入',trigger: 'blur'}],
          measureGroupUnit:[{required: true, message: '请输入',trigger: 'blur'}],
          measureGroupUnitClassify:[{required: true, message: '请输入',trigger: 'blur'}],
          measureUnit:[{required: true, message: '请输入',trigger: 'blur'}],
          inventoryAttrIds:[{required: true, message: '请输入',trigger: 'blur'}],
          inventoryAttrJson:[{required: true, message: '请输入',trigger: 'blur'}],
          buyer:[{required: true, message: '请输入',trigger: 'blur'}],
          productionDept:[{required: true, message: '请输入',trigger: 'blur'}],
          purchasePrice:[{required: true, message: '请输入',trigger: 'blur'}],
          sellingPrice:[{required: true, message: '请输入',trigger: 'blur'}],
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
           let config = this.$store.getters.userInfo.sysDept.config.erpStockAddFiled
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