```json
{
label: 'TestComponent', // 标题文字
icon: 'icon-write', // 支持 ant-design-icon 图表集
component: TestComponent,
type: 'TestComponent',// 组件渲染的时候,用于判断是否是自定义组件, 建议和组件名保持一致.
// 你应该避免使用这些已经预定义的组件类型, 否则将不会渲染自定义组件.
options: {
['input', 'textarea', 'date', 'time', 'number', 'radio', 'checkbox', 'select', 'rate', 'switch', 'slider', 'uploadImg', 'uploadFile', 'cascader', 'treeSelect']
['batch', 'editor', 'selectInputList']
['button']['alert']['text']['html']['divider']

width: '100%', // 宽度
defaultValue: '', // 默认值
placeholder: 'common.please_input', // 没有输入时，提示文字
clearable: false,
maxLength: null,
addonBefore: '',
addonAfter: '',
hidden: false, // 是否隐藏，false 显示，true 隐藏
disabled: false, // 是否禁用，false 不禁用，true 禁用
},
model: '', // 数据字段
key: '',
help: '',
rules: [
//验证规则
{
required: false, // 必须填写
message: 'common.please_input',
},
],

}
```
