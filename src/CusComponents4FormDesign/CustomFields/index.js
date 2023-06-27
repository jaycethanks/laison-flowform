import CustomFields from './CustomFields.vue';
export default {
  label: 'CustomFields', // 标题文字
  icon: 'icon-write', // 自定义组件 icon (ant-design-vue 合法icon)
  component: CustomFields,
  type: 'CustomFields',
  rules: [{ required: true, message: "hello" }]
};
