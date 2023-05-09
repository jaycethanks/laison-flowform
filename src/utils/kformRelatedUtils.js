/**
 * 解析结点配置，并返回洗过的 formInfo
 * @param {*} mock
 * @returns
 */
export const parseFormWidthNodeConfig = function (mock) {
  // 渲染一个表单， 需要 当前结点配置的类型： 审批/抄送/查看 + 当前结点的 id
  mock.currentNodeType = 'taskConfig'; // 后端返回的时候，需要标记当前结点的类型
  mock.currentNodeId = 'Activity_12sck8q';
  const { formInfo, currentNodeType, currentNodeId, nodeConfigs } = mock;
  const _formInfo = JSON.parse(formInfo);
  const _config = nodeConfigs.find((config) => config.nodeId === currentNodeId)[currentNodeType]['columnConfigs'];
  // 将结点配置的字段控制信息取出，并set到formInfo
  console.log('[_config]: ', _config);
  _formInfo.list.forEach((formItem) => {
    const { key } = formItem;
    console.log('[formItem]: ', formItem);
    _config.forEach((configItem) => {
      const { key: _key, hidden, disabled } = configItem;
      if (key === _key) {
        formItem.options.hidden = hidden;
        formItem.options.disabled = disabled;
      }
      if (typeof configItem.exposeFields !== 'undefined') {
        // 如果这个字段是自定义组件， 就会可能会存在 exposeFields 这个字段 (取决与自定义组件中 是否有按照规定实现)
        // 将exposeFields 写入到 formInfo 在组件解析阶段去控制自定义组件中的对应字段
        formItem._exposeFields = configItem.exposeFields;
        console.log('[configItem.exposeFields]: ', configItem.exposeFields);
      }
    });
  });
  return _formInfo;
};
