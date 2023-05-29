<template>
  <div class="flow-form-designer-root">
    <div class="flow-form-designer-root" v-show="!success">
      <p class="flow-form-designer-header">
        <a-steps
          ref="steps"
          style="margin-bottom: 0; width: 550px"
          size="small"
          v-model="current"
          type="navigation"
          @change="onStepChange"
        >
          <a-step status="finish" title="表单设计" v-if="!noFormDesign">
            <SvgIconFormDesign style="width: 24px; height: 24px" slot="icon" />
          </a-step>
          <a-step status="finish" title="流程设计">
            <SvgIconFlowDesign style="width: 24px; height: 24px" slot="icon" />
          </a-step>
          <a-step status="process" title="流程发布">
            <SvgIconFFPublish style="width: 24px; height: 24px" slot="icon" />
          </a-step>
        </a-steps>
      </p>
      <div class="flow-form-designer-container">
        <form-design v-if="!noFormDesign" v-show="current === 0" ref="formDesignView"></form-design>
        <flow-design
          v-show="noFormDesign ? current === 0 : current === 1"
          :bpmnEditDataInit="bpmnEditDataInit"
          :type="computedQuery.type"
        ></flow-design>
        <flow-form-publish
          v-show="noFormDesign ? current === 1 : current === 2"
          @submit="sumbitHandler"
          :publishEditDataInit="publishEditDataInit"
          @success="$emit('back')"
          @doSubmit="handleSubmit"
          :type="computedQuery.type"
        ></flow-form-publish>
      </div>
    </div>
    <SuccessPage description="提交成功" v-show="success">
      <a-button @click="handleGoBackToDesign" type="link" icon="rollback">继续设计</a-button>
    </SuccessPage>
  </div>
</template>

<script>
import FormDesign from '@/packages/FormDesigner/index.vue';
import FlowDesign from '@/packages/FlowDesigner/index.vue';
import handleQuery from '@/mixins/handleQuery.js';

import FlowFormPublish from './FlowFormPublish';
import FlowFormDesignerType from '@/constants/FlowFormDesignerType.js';

import SvgIconFormDesign from '@/assets/svgIcon/SvgIconFormDesign.vue';
import SvgIconFlowDesign from '@/assets/svgIcon/SvgIconFlowDesign.vue';
import SvgIconFFPublish from '@/assets/svgIcon/SvgIconFFPublish.vue';

import { add as system_add } from '@/api/system/ffTemplate.js';
import { add as platform_add } from '@/api/platform/ffTemplate.js';
import SuccessPage from "@/components/FlowForm/SuccessPage/index.vue"
import mock from './mock';
export default {
  name: 'FlowFormDesigner',
  mixins: [handleQuery],

  props: {
    editRecord: {
      type: Object,
    },
    // type: {
    //   type: Number,
    //   default: FlowFormDesignerType.PLATFORM_NEW,
    // },
  },

  components: {
    FormDesign,
    FlowDesign,
    FlowFormPublish,
    SvgIconFormDesign,
    SvgIconFlowDesign,
    SvgIconFFPublish,
    SuccessPage
  },
  provide: function () {
    return {
      jumpTo: this.jumpTo,
    };
  },
  data() {
    return {
      noBack: true,
      noFormDesign: true,
      current: 0,
      stepsHistoryStack: [0], // steps 的跳转栈，用于增加操作逻辑
      isSubmit: false, // 用于判断路由切换时，提示控制
      bpmnEditDataInit: null, // 用于edit的回显初始化
      publishEditDataInit: null, // 用于edit的回显初始化
      fn: {
        add: null,
      },
      query: {
        // query 的初始化全部值，都必须在这里指定， 如果需要指明那一个query字段是必须的，
        // 那么，需要将该字段初始化为一对象,例如 type: {value: 初始化值}
        type: {
          type: Number,
        },
      },
      success:false
    };
  },

  created() {
    this.handleType(this.computedQuery.type);
    // 尝试数据初始化
  },
  mounted() {
    this.$refs.steps.historyStack = [];
  },
  methods: {
    jumpTo(tabIndex) {
      this.current = tabIndex;
    },
    onStepChange(key) {
      this.stepsHistoryStack.push(key);
      let from = this.stepsHistoryStack.at(-2);

      let _this = this;
      // let res = this.$refs.formDesignView.fetchFormData()
      let currentFormInfo = this.$store.state.kform.data;

      // !! 临时禁用验证
      // if (key === 1 && !currentFormInfo.list.length) {
      //   this.$warning({
      //     content: '表单设计为空，请先完成表单设计',
      //     onOk() {
      //       _this.current = 0;
      //     },
      //   });
      // } else if (key === 2 && !window.historyExtendConfig.length) {
      //   this.$warning({
      //     content: '设计流程不可为空，请先完成流程设计',
      //     onOk() {
      //       _this.current = 1;
      //     },
      //   });
      // }

      // if(from === 0 && to === 1){
      //   this.$warning({
      //     content: '请确认表单设计内容,跳转将刷新流程节点字段控制',
      //     onOk() {
      //       _this.current = 0
      //     },
      //   })
      // }
      /**
       * 触发事件 'stepChange' , 以便于在src/components/bpmnpd/package/penal/PropertiesPanel.vue 中触发更新
       * @param key -  { Number } - 当前step对应的key,相当于 "to" 的含义
       * @param from { Number } - 上一个step
       */

      this.$bus.$emit('stepChange', from, key);
    },
    sumbitHandler() {
      this.isSubmit = true;
    },
    handleType(type) {
      // TODO: handle 提交接口 add
      switch (type) {
        case FlowFormDesignerType.SYSTEM_NEW: //1
          this.noFormDesign = false;
          this.noBack = false;
          this.fn.add = system_add;
          break;
        case FlowFormDesignerType.PLATFORM_NEW: //2
          this.noFormDesign = true;
          this.noBack = true;
          this.fn.add = platform_add;

          this.fetchFlowFormDesignData('template_design_idxxxxxxx'); //TODO: 参数handle
          break;
        case FlowFormDesignerType.SYSTEM_EDIT: //3
          this.noFormDesign = true;
          this.noBack = true;
          this.fn.add = platform_add;

          this.fetchFlowFormDesignData('template_design_idxxxxxxx'); //TODO: 参数handle
          break;
        case FlowFormDesignerType.PLATFORM_EDIT: //4
          this.noFormDesign = true;
          this.noBack = true;
          this.fn.add = platform_add;

          this.fetchFlowFormDesignData('template_design_idxxxxxxx'); //TODO: 参数handle
          break;
        default:
          break;
      }
    },

    // 平台管理员会进行模板的设计， 编辑的时候，回去拉取该模板的设计数据
    fetchTemplateData(designId) {
      // todo: 从接口拉取数据
      this.setFlowFormData(mock);
    },
    // 业务系统设计流程时，会拉取整个设计数据
    fetchFlowFormDesignData(designId) {
      // todo: 从接口拉取数据
      this.setFlowFormData(mock);
    },
    setFlowFormData(fetchData) {
      const { formInfo, procModelXml, nodeConfigs } = fetchData;
      this.setKformStore(formInfo);
      this.setFlowDesignData({ procModelXml, nodeConfigs });
      this.setFlowFormPublishData(fetchData);
    },
    setKformStore(formInfo) {
      let _formInfo;
      if (typeof formInfo === 'string') {
        _formInfo = JSON.parse(mock.formInfo);
      }

      this.$store.commit('SET_KFORM_DATA', _formInfo);
    },
    setFlowDesignData({ procModelXml, nodeConfigs }) {
      this.bpmnEditDataInit = {
        xmldata: procModelXml,
        nodeDesignConfigs: nodeConfigs,
      };
      console.log('[this.bpmnEditDataInit]: ', this.bpmnEditDataInit);
    },
    setFlowFormPublishData(fetchData) {
      const {
        permissionDesignConfig = null,
        formDesignId,
        designIcon,
        designColor,
        designName,
        designGroupName,
        designDes,
      } = fetchData;
      let _permissionDesignConfig = JSON.parse(permissionDesignConfig);
      this.publishEditDataInit = {
        formDesignId: formDesignId, // 注意，仅当为编辑状态时需要此id， 如果时新建流程，不需要传这个id
        iconName: {
          name: designIcon,
          color: designColor,
        },
        flowName: designName,
        groupSelected: designGroupName,
        remark: designDes,
        startMembers: _permissionDesignConfig ? _permissionDesignConfig.starterMembers : [],
        viewMembers: _permissionDesignConfig ? _permissionDesignConfig.viewAllMembers : [],
      };
    },

    // 数据提交
    async handleSubmit(data) {
      const res = await this.fn.add(data);
      if(res.status === 200){
        this.success = true
      }
    },
    handleGoBackToDesign(){
      this.jumpTo(0);
      this.success = false;
      this.$store.commit('RESET_KFORM');
      this.$store.commit('RESET_BPMN');
      this.$store.commit('RESET_FLOWFORM');
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.isSubmit) {
      //提交过了
      next();
    } else {
      this.$confirm({
        title: this.$t('common.warning'),
        content: this.$t('common.离开页面将会丢弃所有设计内容，确认离开？'),
        okType: 'danger',
        onOk() {
          next();
        },
        onCancel() {
          next(false);
        },
      });
    }
    this.isSubmit = false;
  },
};
</script>
<style scoped lang="scss">
.flow-form-designer-header {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #d6d6d6;
  user-select: none;
  height: 40px;
  position: relative;
  margin-bottom: 0;
}
.flow-form-designer-root {
  height: 100%;
  width: 100%;
}
.flow-form-designer-container {
  height: calc(100% - 40px);
}
::v-deep .ant-steps-navigation .ant-steps-item.ant-steps-item-active::before {
  transform: translateX(-50%);
  left: 50%;
  width: 25%;
}
::v-deep .ant-steps-navigation .ant-steps-item::before {
  transform: translateX(-50%);
}
::v-deep .ant-steps-navigation .ant-steps-item-container {
  padding-bottom: 8px;
}
::v-deep .ant-steps-navigation .ant-steps-item::before {
  height: 1.8px;
}
::v-deep .ant-steps-navigation {
  padding: 12px 0 5px;
}
/** steps 自定义样式 END */
</style>
