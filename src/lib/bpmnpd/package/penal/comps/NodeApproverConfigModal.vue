<template>
  <div class="root">
    <TitleRow title="审批类型" size="small" bold> </TitleRow>
    <a-checkbox @change="emitChange" v-model="autoApproval"> 自动审批 </a-checkbox>
    <TitleRow title="设定节点审批人" size="small" bold> </TitleRow>
    <a-radio-group v-model="approver.approvalType" :options="options" @change="emitChange" />
    <OrgSelectionModal
      v-model="approver.members"
      style="margin-top: 10px"
      :approvalType="approver.approvalType"
      v-if="approver.approvalType !== 'applicant' && approver.approvalType !== 'applicantLeader'"
    />

    <!-- autoApproval -->
  </div>
</template>
<script>
import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
import TitleRow from '@/components/base/TitleRow';
const options = [
  { label: '发起人自己', value: 'applicant' },
  { label: '发起人直属主管审批', value: 'applicantLeader' },
  { label: '指定人员', value: 'people' },
  { label: '指定角色', value: 'role' },
  { label: '指定部门', value: 'department' },
];
export default {
  name: 'NodeApproverConfigModal',
  components: { OrgSelectionModal, TitleRow },
  props: ['customProp'],
  model: {
    prop: 'customProp',
    event: 'customEvent',
  },

  watch: {
    // 值绑定逻辑:
    // 父 => 子 :
    // 子 => 父 :
    customProp: {
      handler: function () {
        if (this.customProp) {
          const {
            autoApproval,
            approver: { approvalType, members },
          } = this.customProp;
          this.autoApproval = autoApproval;
          this.approver.approvalType = approvalType;
          this.approver.members = members;
        }
      },
      immediate: true,
      deep: true,
    },
    'approver.members': {
      handler: function () {
        this.emitChange();
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      autoApproval: false,
      approver: {
        approvalType: 'applicant',
        members: [],
      },
      options,
    };
  },
  methods: {
    emitChange() {
      this.$emit('customEvent', {
        autoApproval: this.autoApproval,
        approver: this.approver,
      });
    },
  },
};
</script>
<style scoped>
>>> .ant-radio-wrapper {
  line-height: 2;
}
</style>
