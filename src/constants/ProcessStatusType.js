import i18n from '@/lang';
import $t from '@/utils/useI18n.js';
export const ProcessStatusType = {
  DRAFT: 0, //草稿
  TODO: 1, //代办
  DONE: 2, //已办
  REVOKE: 3, //撤回
  AUDITING: 4, //审批中
  REJECT: 5, //驳回
  CHANGE: 6, //变更
};

const { DRAFT, TODO, DONE, REJECT, AUDITING, REVOKE, CHANGE } = ProcessStatusType;
export const StatusOptions = [
  { label: $t('common._status.draft'), value: DRAFT },
  { label: $t('common._status.todo'), value: TODO },
  { label: $t('common._status.done'), value: DONE },
  { label: $t('common._status.revoke'), value: REVOKE },
  { label: $t('common._status.auding'), value: AUDITING },
  { label: $t('common._status.reject'), value: REJECT },
  { label: $t('common._status.change'), value: CHANGE },
];
