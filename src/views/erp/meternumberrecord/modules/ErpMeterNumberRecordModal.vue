<template>
   <j-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    switchFullscreen
    :title='title'
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
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.orderNo" prop="orderId" placeholder="orderId" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.stockCode')" prop="stockCode" v-if="showFiled('stockCode')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.stockCode" prop="stockCode" placeholder="stockCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.length')" prop="length" v-if="showFiled('length')">
	                        <a-input-number :disabled="isDetail" v-model="model.length" :max=100 :min=0 :precision=0 placeholder="length" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.prifix')" prop="prifix" v-if="showFiled('prifix')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.prifix" prop="prifix" placeholder="prifix" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.roleCode')" prop="roleCode" v-if="showFiled('roleCode')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.roleCodeName" prop="roleCode" placeholder="roleCode" ></a-input>
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.serialNumberLength')" prop="serialNumberLength" v-if="showFiled('serialNumberLength')">
	                        <a-input-number :disabled="isDetail" v-model="model.serialNumberLength" :max=100 :min=0 :precision=0 placeholder="serialNumberLength" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.numberCount')" prop="numberCount" v-if="showFiled('numberCount')">
	                        <a-input-number :disabled="isDetail" v-model="model.numberCount" :max=100 :min=0 :precision=0 placeholder="numberCount" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.startNumber')" prop="startNumber" v-if="showFiled('startNumber')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.startNumber" prop="startNumber" placeholder="startNumber" ></a-input>
	                  </a-form-model-item>
<!--	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.start')" prop="start" v-if="showFiled('start')">-->
<!--	                        <a-input-number :disabled="isDetail" v-model="model.start" :max=100 :min=0 :precision=0 placeholder="start" style="width: 100%" />-->
<!--	                  </a-form-model-item>-->
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.endNumber')" prop="endNumber" v-if="showFiled('endNumber')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.endNumber" prop="endNumber" placeholder="endNumber" ></a-input>
	                  </a-form-model-item>
<!--	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.end')" prop="end" v-if="showFiled('end')">-->
<!--	                        <a-input-number :disabled="isDetail" v-model="model.end" :max=100 :min=0 :precision=0 placeholder="end" style="width: 100%" />-->
<!--	                  </a-form-model-item>-->
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.deptId')" prop="deptId" v-if="showFiled('deptId')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.deptName" prop="deptId" placeholder="deptId" ></a-input>
	                  </a-form-model-item>
<!--	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.delFlag')" prop="delFlag" v-if="showFiled('delFlag')">-->
<!--	                  		<a-switch :disabled="isDetail" :checked="model.delFlag" @change="(check) => { model.delFlag=check}" :checked-children="$t('common.enable')" :un-checked-children="$t('common.disable')" />-->
<!--	                  </a-form-model-item>-->
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.state')" prop="state" v-if="showFiled('state')">
	                        <a-input-number :disabled="isDetail" v-model="model.stateName" :max=100 :min=0 :precision=0 placeholder="state" style="width: 100%" />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.createTime')" prop="createTime" v-if="showFiled('createTime')">
	                        <j-date :disabled="isDetail " v-model="model.createTime"  :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"  />
	                  </a-form-model-item>
	              	  <a-form-model-item :label="$t('ErpMeterNumberRecord.fileUrl')" prop="fileUrl" v-if="showFiled('fileUrl')">
	                  		<a-input :disabled="isDetail" :maxLength=30 v-model="model.fileUrl" prop="fileUrl" placeholder="fileUrl" ></a-input>
	                  </a-form-model-item>
                  <a-form-model-item :label="$t('ErpMeterNumberRecord.remark')" prop='remark' v-if="showFiled('remark')">
                    <a-textarea :disabled="isDetail" :maxLength=30 v-model='model.remark' prop='remark'
                                :placeholder="$t('ErpMeterNumberRecord.inputRemark')"></a-textarea>
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
        title:'',
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
	                      callback(new Error(this.$t('ErpMeterNumberRecord.idError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          orderId:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.orderIdError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          stockCode:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.stockCodeError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          length:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.lengthError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          prifix:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.prifixError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          roleCode:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.roleCodeError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          serialNumberLength:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.serialNumberLengthError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          numberCount:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.numberCountError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          startNumber:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.startNumberError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          start:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.startError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          endNumber:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.endNumberError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          end:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.endError')));
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
	                      callback(new Error(this.$t('ErpMeterNumberRecord.deptIdError')));
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
	                      callback(new Error(this.$t('ErpMeterNumberRecord.delFlagError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }

			],

          state:[

				{

	              validator: (rule,value,callback) =>{
	                  let min =0
	                  let max =100
	                  let error=value==undefined||value==null||value>max||value<min
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.stateError')));
	                  }else{
	                      callback();
	                  }
	              },
	              trigger: 'blur'
	            }



			],

          createTime:[



			],

          fileUrl:[

				{
	              validator: (rule,value,callback) =>{
	                  let reg = /^[^\s].{0,98}[^\s]$/ig
	                  let error=value==undefined||value==null||!reg.test(value)
	                  if(error){
	                      callback(new Error(this.$t('ErpMeterNumberRecord.fileUrlError')));
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