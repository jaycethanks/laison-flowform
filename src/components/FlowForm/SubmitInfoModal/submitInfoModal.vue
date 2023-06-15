<template>
  <a-modal
    :cancelText="$t('common.cancelText')"
    :okText="$t('common.okText')"
    v-model="visible"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancle"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-form-model-item ref="comment" prop="comment">
        <span slot="label" class="label-slot">{{$t('submitInfoModal.comment')}}</span>
        <a-textarea allowClear :autoSize="{ minRows: 6, maxRows: 6 }" v-model="form.comment" />
      </a-form-model-item>
      <section class="recommendations">
        <span>{{$t('submitInfoModal.recommendations')}}:</span>
        <a-button size="small" @click="handleTextClick(text)" v-for="text in recommendations" :key="text">
          {{ text }}
        </a-button>
      </section>
      <a-divider style="margin: 1em 0" />
      <a-form-model-item ref="enclosurePaths" prop="enclosurePaths">
        <span slot="label" class="label-slot">{{$t('submitInfoModal.enclosure')}}</span>
        <ffUploader multiple v-model="form.enclosurePaths" />
      </a-form-model-item>

      <a-form-model-item v-if="fields.includes('delegator')" ref="delegator" prop="delegator">
        <span slot="label" class="label-slot">{{$t('submitInfoModal.delegator')}}</span>
        <OrgSelectionModal :maxPerson="1" approvalType="people" v-model="form.delegator" :minHeight="100" />
      </a-form-model-item>

      <a-form-model-item v-if="fields.includes('backTask')" ref="backNodeId" prop="backNodeId">
        <span slot="label" class="label-slot">{{$t('submitInfoModal.delegateTo')}}</span>
        <a-select @change="onBackNodesSelectChange" v-model="form.backNodeId" :options="backNodesOptions" />
      </a-form-model-item>

      <a-form-model-item v-if="fields.includes('backTask')" ref="backUsers" prop="backUsers">
        <span slot="label" class="label-slot">{{$t('submitInfoModal.selectDealPerson')}}</span>
        <a-select mode="multiple" v-model="form.backUsers" :options="backUsersOptions" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import ffUploader from "@/components/FlowForm/ffUploader/index.vue"
import TitleRow from "@/components/base/TitleRow/index.vue"
import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
import { getBackList, getNodeCandidates } from "@/api/platform/processOpenAPI.js"
import { SubmitInfoType } from "@/constants/SubmitInfoType.js"
const FieldsMap = {
  [SubmitInfoType.APPLY]: [],
  [SubmitInfoType.PASS]: [],
  [SubmitInfoType.DELEGATE]: ['delegator'],
  [SubmitInfoType.BACKTASK]: ['backTask'],
  [SubmitInfoType.CANCELTASK]: ['cancelTask']
}
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
    },
    businessId: {
      type: String
    },
    curTaskId: {
      type: String
    },
    uniTenantId: {
      type: String
    },
    bizToken: {
      type: String
    },
  },
  components: {
    ffUploader,
    TitleRow,
    OrgSelectionModal

  },
  computed: {
    fields: function () {
      return this.type ? FieldsMap[this.type] : []
    },
    recommendations: function(){
      return [
        this.$t('submitInfoModal.words.a'),
        this.$t('submitInfoModal.words.b'),
        this.$t('submitInfoModal.words.c'),
        this.$t('submitInfoModal.words.d'),
        this.$t('submitInfoModal.words.e'),
        this.$t('submitInfoModal.words.f'),
        this.$t('submitInfoModal.words.g'),
        this.$t('submitInfoModal.words.h'),
        this.$t('submitInfoModal.words.i'),
      ]
    },
  },

  data() {
    return {
      visible: false,
      isEdit: false,

      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      form: {
      },
      backNodesOptions: [],
      backUsersOptions: [],

      rules: {
        comment: [{
          validator(rule, value, cb) {
            if(!value){
              cb(new Error(`不可为空！`))
            }else{
              if (value.trim().length > 255) {
                cb(new Error(`超出 ${value.trim().length - 255} 字符！`))
              } else {
                cb()
              }
            }
          }, trigger: 'blur'
        }],
        delegator:[{required: true}],
        backNodeId:[{required: true}],
        backUsers:[{required: true}],

      },
    };
  },

  methods: {
    onBackNodesSelectChange(nodeId) {
      this.loadBackUsersOptions(nodeId)
    },
    async loadBackUsersOptions(nodeId) {
      // backUsersOptions
      const res = await getNodeCandidates({
        businessId: this.businessId,// submit接口， 业务ID，从草稿提交时需要携带
        curNodeId: nodeId,// submit接口，审批时需要携带
        curTaskId: this.curTaskId,// submit接口，审批时需要携带
        uniTenantId: this.uniTenantId,
        bizToken: this.bizToken,
      })
      if (res.status === 200) {
        this.backUsersOptions = res.data.map(it => ({ label: it.name, value: it.id }))
      }
    },
    async initForm(form) {
      // if (form) {
      //   this.isEdit = true;
      //   // 先置空,这样会将id也set到form，id是update 必传字段
      //   this.$set(this, 'form', {});
      //   this.$set(this, 'form', Object.assign({}, form));
      // } else {
      //   this.$set(this, 'form', {});
      // }
      this.$set(this, 'form', {
        comment:this.$t('formPreview.pass')
      });


      // ! 这里为什么要用 nextTick ? 不知道， 但是不用， this.type 这个prop 值， 始终是延后一步
      this.$nextTick(async () => {
        if (this.type !== SubmitInfoType.BACKTASK) return

        // 如果是驳回，去拉取必要数据
        const res = await getBackList({
          businessId: this.businessId,// submit接口， 业务ID，从草稿提交时需要携带
          curTaskId: this.curTaskId,// submit接口，审批时需要携带
          uniTenantId: this.uniTenantId,
          bizToken: this.bizToken,

        })
        if (res.status === 200) {
          this.backNodesOptions = res.data.map(it => ({ label: it.nodeName, value: it.nodeId }))
        }
      })


    },
    show(form = null) {

      this.initForm(form);
      this.visible = true;
    },
    hide() {
      this.visible = false;
      this.resetForm();
    },
    handleFileUploaded(filePaths) {
      this.$set(this, 'form', Object.assign(this.form, { enclosurePaths: filePaths }));
    },
    handleTextClick(text) {
      this.$set(this.form, 'comment', (this.form.comment || "") + text);
    },
    handleOk(e) {
      const valid = this.validateForm();
      valid && this.$emit('ok', JSON.parse(JSON.stringify(this.form)), this.isEdit);
      valid && this.hide()
    },
    handleCancle() {
      this.resetForm();
      this.$emit('cancel');
    },
    validateForm() {
      let _valid = false;
      window.xxx = this.$refs.ruleForm
      this.$refs.ruleForm.validate((valid) => {
        _valid = valid;
      })
      return _valid;
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },

  },
};
</script>
<style scoped>
.label-slot {
  font-weight: bold;
  font-size: 14px;
}
.label-slot-small {
  font-size: 12px;
  margin: 0;
}
>>> .ant-input {
  border-radius: 0;
}
.recommendations {
  display: inline-flex;
  gap: 0.4em;
  flex-wrap: wrap;
}
>>> .ant-form-item {
  margin-bottom: 0;
}
</style>
