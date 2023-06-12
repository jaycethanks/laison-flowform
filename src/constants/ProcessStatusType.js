export const ProcessStatusType = {
  DRAFT: 0, //草稿
  TODO: 1, //代办
  DONE: 2, //已办
  DRAWBACK: 3, //撤回
  AUDITING: 4, //审批中
  REJECT: 5, //驳回
  CHANGE: 6, //变更
};

const { DRAFT, TODO, DONE, REJECT, AUDITING, DRAWBACK, CHANGE } = ProcessStatusType;
export const StatusOptions = [
  { label: '草稿', value: DRAFT },
  { label: '待审批', value: TODO },
  { label: '处理结束', value: DONE },
  { label: '已撤回', value: DRAWBACK },
  { label: '审批中', value: AUDITING },
  { label: '驳回', value: REJECT },
  { label: '变更', value: CHANGE },
];
