<template>
  <div class="flow-form-designer-root">
    <p class="flow-form-designer-header">
      <a-steps
        ref="steps"
        style="margin-bottom: 0; width: 550px"
        size="small"
        v-model="current"
        type="navigation"
        @change="onStepChange"
      >
        <a-step status="finish" title="表单设计">
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
      ></flow-design>
      <flow-form-publish
        v-show="noFormDesign ? current === 1 : current === 2"
        @submit="sumbitHandler"
        :publishEditDataInit="publishEditDataInit"
        @success="$emit('back')"
      ></flow-form-publish>
    </div>
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
export default {
  name: 'FlowFormDesigner',
  mixins: [handleQuery],

  props: {
    editRecord: {
      type: Object,
    },
    // type: {
    //   type: Number,
    //   default: FlowFormDesignerType.INTEGRATION_SYSTEM,
    // },
  },
  components: {
    FormDesign,
    FlowDesign,
    FlowFormPublish,
    SvgIconFormDesign,
    SvgIconFlowDesign,
    SvgIconFFPublish,
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
      query: {
        // query 的初始化全部值，都必须在这里指定， 如果需要指明那一个query字段是必须的，
        // 那么，需要将该字段初始化为一对象,例如 type: {value: 初始化值}
        type: {
          type: Number,
        },
      },
    };
  },

  created() {
    // const { type } = this.$route.query;
    // switch (type) {
    //   case 'flowdesign':
    //     this.noFormDesign = true;
    //     this.noBack = true;
    //     break;
    // }

    this.handleType(this.computedQuery.type);
    // 尝试数据初始化
    if (this.editRecord != null) {
      // init k-form-design
      //TODO: @jayce 23/05/10-10:10:08 : 暂时取消缓存相关逻辑
      // this.$store.commit('SET_KFORM_DATA', JSON.parse(this.editRecord.formInfo));
      // dealwith bpmn process designer init data
      this.bpmnEditDataInit = {
        xmldata: this.editRecord.procModelXml,
        nodeDesignConfigs: this.editRecord.nodeDesignConfigs,
      };
      // dealwith form-design-publish init data
      let permissionDesignConfig = JSON.parse(this.editRecord.permissionDesignConfig);
      this.publishEditDataInit = {
        formDesignId: this.editRecord.formDesignId, // 注意，仅当为编辑状态时需要此id， 如果时新建流程，不需要传这个id
        iconName: {
          name: this.editRecord.designIcon,
          color: this.editRecord.designColor,
        },
        flowName: this.editRecord.designName,
        groupSelected: this.editRecord.designGroupName,
        remark: this.editRecord.designDes,
        startMembers: permissionDesignConfig.starterMembers,
        viewMembers: permissionDesignConfig.viewAllMembers,
      };
    } else {
      // TODO: 查看一下这里的逻辑，this.$store.commit('SET_KFORM_DATA',看看能不能删除掉， 不应该这么做， 表单的数据初始化操作是在 KFormDesign 中进行的， 这里会影响到 src/lib/kform/KFormDesign/index.vue的初始化操作， 虽然这里现在是手动添加了自定义字段解决了。
      //TODO: @jayce 23/05/10-10:10:08 : 暂时取消缓存相关逻辑
      return;
      this.$store.commit('SET_KFORM_DATA', {
        list: [],
        config: {
          layout: 'horizontal',
          labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
          labelWidth: 100,
          labelLayout: 'flex',
          wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
          hideRequiredMark: false,
          customStyle: '',
          enablePrint: false, //@jayce
          expressions: '', //@jayce
          currentLang: 'zh', //@jayce 23/05/10-09:47:32 :
        },
      });
    }
  },
  mounted() {
    // console.log(this.$route.path, '--line115')
    // console.log(this.$store.state.kform, '--line89')
    // console.log(this.$store.state.bpmn, '--line90')
    // console.log(this.$store, '--line91')
    // this.$store.commit('SET_KFORM_DATA', 'HELLO')
    // console.log(this.$store.state, '--line93')
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
      switch (type) {
        case FlowFormDesignerType.PLATFORM: //1
          this.noFormDesign = false;
          this.noBack = false;
          break;
        case FlowFormDesignerType.INTEGRATION_SYSTEM: //2
          this.noFormDesign = true;
          this.noBack = true;
          break;
        default:
          break;
      }
    },
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
<style scoped lang="css">
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
>>> .ant-steps-navigation .ant-steps-item.ant-steps-item-active::before {
  transform: translateX(-50%);
  left: 50%;
  width: 25%;
}
>>> .ant-steps-navigation .ant-steps-item::before {
  transform: translateX(-50%);
}
>>> .ant-steps-navigation .ant-steps-item-container {
  padding-bottom: 8px;
}
>>> .ant-steps-navigation .ant-steps-item::before {
  height: 1.8px;
}
>>> .ant-steps-navigation {
  padding: 12px 0 5px;
}
/** steps 自定义样式 END */
</style>
