<template>
  <div class="root">
    <TitleRow title="审批类型" size="small" bold> </TitleRow>
    <a-checkbox v-model="autoApproval"> 自动审批 </a-checkbox>
    <TitleRow title="设定节点审批人" size="small" bold> </TitleRow>
    <a-radio-group v-model="approvalType" :options="options" @change="onChange2" />
    <OrgSelectionModal
      v-model="approver"
      style="margin-top: 10px"
      :approvalType="approvalType"
      v-if="approvalType !== 'applicant'"
    />

    <!-- autoApproval -->
  </div>
</template>
<script>
import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
import TitleRow from '@/components/base/TitleRow';
const options = [
  { label: '发起人自己', value: 'applicant' },
  { label: '指定人员', value: 'people' },
  { label: '指定角色', value: 'role' },
  { label: '指定部门', value: 'department' },
];
export default {
  name: 'NodeApproverConfigModal',
  components: { OrgSelectionModal, TitleRow },

  data() {
    return {
      approver: [],
      autoApproval: false,
      options,
      approvalType: 'applicant',
    };
  },
  mounted() {
    window.xxxxxx = this;
  },
  methods: {
    onChange1(e) {
      console.log('radio1 checked', e.target.value);
    },
    onChange2(e) {
      console.log('radio2 checked', e.target.value);
    },
    onChange3(e) {
      console.log('radio3 checked', e.target.value);
    },
  },
};
</script>
<style></style>
