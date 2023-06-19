<template>
  <div class="root">
    <!-- 指定审批人 -->
    <TitleRow :title="$t('orgSelectComp.approverDesignation')" size="small" bold> </TitleRow>
    <a-radio-group v-model="approval.approvalType" :options="options" @change="emitChange" />
    <OrgSelectionModal
      v-model="approval.members"
      style="margin-top: 10px"
      :approvalType="approval.approvalType"
      v-if="
        !['none', 'applicant', 'applicantLeader'].includes(
          approval.approvalType
        )
      "
    />
  </div>
</template>
<script>
import OrgSelectionModal from '@/lib/bpmnpd/package/penal/comps/OrgSelectionModal.vue';
import TitleRow from '@/components/base/TitleRow';

export default {
  name: 'NodeApproverConfigModal',
  components: { OrgSelectionModal, TitleRow },
  props: {
    customProp: {
      type: Object,
      default: () => ({
        approvalType: 'applicant',
        members: []
      })
    },
    hasNone: {
      type: Boolean,
      default: false,
    },
    defaultApprovalType: {
      type: String,
      default: 'applicant',
    },

  },
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
        if (this.customProp && this.customProp.approvalType && this.customProp.members) {
          const {
            approvalType, members,
          } = this.customProp;
          this.approval.approvalType = approvalType;
          this.approval.members = members;
        }
      },
      immediate: true,
      deep: true,
    },
    'approval.members': {
      handler: function () {
        this.emitChange();
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    options: function () {
      return this.hasNone ? [{ label: this.$t('orgSelectComp.none'), value: 'none' }].concat([
        { label: this.$t('orgSelectComp.applicantSelf'), value: 'applicant' },
        { label: this.$t('orgSelectComp.applicantLeader'), value: 'applicantLeader' },
        { label: this.$t('orgSelectComp.peopleAssignment'), value: 'people' },
        { label: this.$t('orgSelectComp.roleAssignment'), value: 'role' },
        { label: this.$t('orgSelectComp.deptAssignment'), value: 'department' },
      ]) : [
        { label: this.$t('orgSelectComp.applicantSelf'), value: 'applicant' },
        { label: this.$t('orgSelectComp.applicantLeader'), value: 'applicantLeader' },
        { label: this.$t('orgSelectComp.peopleAssignment'), value: 'people' },
        { label: this.$t('orgSelectComp.roleAssignment'), value: 'role' },
        { label: this.$t('orgSelectComp.deptAssignment'), value: 'department' },
      ]
    }
  },
  data() {
    return {
      approval: {
        approvalType: this.defaultApprovalType,
        members: [],
      },

    };
  },
  methods: {
    emitChange() {
      this.$emit('customEvent', {
        approvalType: this.approval.approvalType,
        members: this.approval.members,
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
