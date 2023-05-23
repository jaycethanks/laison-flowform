<template>
  <div class="root">
    <a-space direction="vertical">
      <p>审批类型</p>
      <a-checkbox v-model="autoApproval"> 自动审批 </a-checkbox>
      <p>设定节点审批人</p>
      <a-radio-group v-model="approvalType" :options="options" @change="onChange2" />
      {{ approvalType }}
      <OrgSelectionModal :approvalType="approvalType" v-if="approvalType !== 'applicant'" />
    </a-space>

    <!-- autoApproval -->
  </div>
</template>
<script>
import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
const options = [
  { label: '发起人自己', value: 'applicant' },
  { label: '指定人员', value: 'people' },
  { label: '指定角色', value: 'role' },
  { label: '指定部门', value: 'department' },
];
export default {
  name: 'NodeApproverConfigModal',
  components: { OrgSelectionModal },
  data() {
    return {
      autoApproval: false,
      options,
      approvalType: 'applicant',
    };
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
