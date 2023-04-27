export default {
  formDesignId: '',
  designKey: 'diagram_Process_1682579363287',
  designName: '',
  designDes: '',
  designGroupName: '',
  formInfo:
    '{"list":[{"label":"CustomFields","type":"CustomFields","options":{"help":"","width":"100%","hidden":false,"disabled":false},"rules":[{"required":false,"message":"common.please_input"}],"key":"CustomFields_1682581202354","model":"CustomFields_1682581202354","exposeFields":[{"label":"userName","disabled":true,"hidden":true,"type":"userName","key":"userName"},{"label":"price","disabled":true,"hidden":true,"type":"price","key":"price"}]},{"type":"number","label":"数字输入框","icon":"icon-number","options":{"width":"100%","defaultValue":0,"min":null,"max":null,"precision":null,"step":1,"hidden":false,"disabled":false,"placeholder":"common.please_input"},"model":"number_1682581205928","key":"number_1682581205928","help":"","rules":[{"required":false,"message":"common.please_input"}]},{"type":"textarea","label":"文本框","icon":"icon-edit","options":{"width":"100%","minRows":4,"maxRows":6,"maxLength":null,"defaultValue":"","clearable":false,"hidden":false,"disabled":false,"placeholder":"common.please_input"},"model":"textarea_1682581211176","key":"textarea_1682581211176","help":"","rules":[{"required":false,"message":"common.please_input"}]}],"config":{"layout":"horizontal","labelCol":{"xs":4,"sm":4,"md":4,"lg":4,"xl":4,"xxl":4},"labelWidth":100,"labelLayout":"flex","wrapperCol":{"xs":18,"sm":18,"md":18,"lg":18,"xl":18,"xxl":18},"hideRequiredMark":false,"customStyle":"","enablePrint":false,"expressions":""}}',
  procModelXml:
    '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="diagram_Process_1682579363287" targetNamespace="http://activiti.org/bpmn">\n  <bpmn2:process id="Process_1682579363287" name="业务流程_1682579363287" isExecutable="true">\n    <bpmn2:startEvent id="Event_1dz0whj">\n      <bpmn2:outgoing>Flow_0mi9khz</bpmn2:outgoing>\n    </bpmn2:startEvent>\n    <bpmn2:userTask id="Activity_1i14fm4">\n      <bpmn2:incoming>Flow_0mi9khz</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_0e0az64</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:sequenceFlow id="Flow_0mi9khz" sourceRef="Event_1dz0whj" targetRef="Activity_1i14fm4" />\n    <bpmn2:endEvent id="Event_1o81rdv">\n      <bpmn2:incoming>Flow_0e0az64</bpmn2:incoming>\n    </bpmn2:endEvent>\n    <bpmn2:sequenceFlow id="Flow_0e0az64" sourceRef="Activity_1i14fm4" targetRef="Event_1o81rdv" />\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1682579363287">\n      <bpmndi:BPMNEdge id="Flow_0mi9khz_di" bpmnElement="Flow_0mi9khz">\n        <di:waypoint x="318" y="200" />\n        <di:waypoint x="370" y="200" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_0e0az64_di" bpmnElement="Flow_0e0az64">\n        <di:waypoint x="470" y="200" />\n        <di:waypoint x="522" y="200" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_1dz0whj_di" bpmnElement="Event_1dz0whj">\n        <dc:Bounds x="282" y="182" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_1i14fm4_di" bpmnElement="Activity_1i14fm4">\n        <dc:Bounds x="370" y="160" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_1o81rdv_di" bpmnElement="Event_1o81rdv">\n        <dc:Bounds x="522" y="182" width="36" height="36" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>\n',
  permissionConfig: {
    starterMembers: [],
    viewAllMembers: [],
  },
  nodeConfigs: [
    {
      nodeId: 'Activity_1i14fm4',
      taskConfig: {
        columnConfigs: [
          {
            label: 'CustomFields',
            type: 'CustomFields',
            model: 'CustomFields_1682581202354',
            key: 'CustomFields_1682581202354',
            hidden: false,
            disabled: false,
            exposeFields: [
              {
                label: 'userName',
                disabled: true,
                hidden: false,
                type: 'userName',
                key: 'userName',
              },
              {
                label: 'price',
                disabled: false,
                hidden: false,
                type: 'price',
                key: 'price',
              },
            ],
          },
          {
            label: '数字输入框',
            type: 'number',
            model: 'number_1682581205928',
            key: 'number_1682581205928',
            hidden: false,
            disabled: false,
          },
          {
            label: '文本框',
            type: 'textarea',
            model: 'textarea_1682581211176',
            key: 'textarea_1682581211176',
            hidden: false,
            disabled: true,
          },
        ],
        members: [],
        applyerLeader: false,
        applyer: false,
      },
      copyConfig: {
        columnConfigs: [
          {
            label: 'CustomFields',
            type: 'CustomFields',
            model: 'CustomFields_1682581202354',
            key: 'CustomFields_1682581202354',
            hidden: false,
            disabled: false,
            exposeFields: [
              {
                label: 'userName',
                disabled: true,
                hidden: true,
                type: 'userName',
                key: 'userName',
              },
              {
                label: 'price',
                disabled: true,
                hidden: true,
                type: 'price',
                key: 'price',
              },
            ],
          },
          {
            label: '数字输入框',
            type: 'number',
            model: 'number_1682581205928',
            key: 'number_1682581205928',
            hidden: false,
            disabled: false,
          },
          {
            label: '文本框',
            type: 'textarea',
            model: 'textarea_1682581211176',
            key: 'textarea_1682581211176',
            hidden: false,
            disabled: false,
          },
        ],
        members: [],
        type: 'end',
      },
      viewConfig: {
        commonConfig: {
          newest: true,
          disabled: true,
          hidden: true,
        },
        userConfig: {
          columnConfigs: [
            {
              label: 'CustomFields',
              type: 'CustomFields',
              model: 'CustomFields_1682581202354',
              key: 'CustomFields_1682581202354',
              hidden: false,
              disabled: false,
              exposeFields: [
                {
                  label: 'userName',
                  disabled: true,
                  hidden: true,
                  type: 'userName',
                  key: 'userName',
                },
                {
                  label: 'price',
                  disabled: true,
                  hidden: true,
                  type: 'price',
                  key: 'price',
                },
              ],
            },
            {
              label: '数字输入框',
              type: 'number',
              model: 'number_1682581205928',
              key: 'number_1682581205928',
              hidden: false,
              disabled: false,
            },
            {
              label: '文本框',
              type: 'textarea',
              model: 'textarea_1682581211176',
              key: 'textarea_1682581211176',
              hidden: false,
              disabled: false,
            },
          ],
          members: [],
        },
      },
    },
  ],
};
