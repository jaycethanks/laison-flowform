/**
 * src/components/FlowForm/SubmitInfoModal/submitInfoModal.vue
 * 组件是一个多复用的表单录入 modal，
 * 根据不同的类型， 需要动态的去控制需要录入哪些字段
 */
export const SubmitInfoType = {
  APPLY: 1, //发起
  PASS: 2, //审批通过
  DELEGATE: 3, //委托
  BACKTASK: 4, //驳回
  CANCELTASK: 6, //撤销
  //！ 这里的类型，可以依照需要扩展定义， 但不要修改或者删除已存在的定义
};
