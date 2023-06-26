import CustomFields from './CustomFields.vue';
export default {
  label: 'CustomFields', // 标题文字
  icon: 'icon-write', // 自定义组件 icon (ant-design-vue 合法icon)
  component: CustomFields,
  type: 'CustomFields',
  options: {
    help: '',
    hidden: false, // 是否隐藏，false显示，true隐藏
    disabled: false, // 是否禁用，false不禁用，true禁用
  },
  rules: [
    //验证规则
    {
      required: false, // 必须填写
      message: 'common.please_input',
    },
  ],
};
