<template>
  <a-card
    :bordered="false"
    :body-style="{
      width: '100%',
      height: '100%',
      padding: '0px',
    }"
  >
    <p
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #d6d6d6;
        user-select: none;
      "
    >
      <a-button style="position: absolute; left: 10px" @click="$emit('back')">返回</a-button>
      <a-steps
        ref="steps"
        style="margin-bottom: 0; width: 550px"
        size="small"
        v-model="current"
        type="navigation"
        @change="onStepChange"
      >
        <a-step status="finish" :title="this.$t('erp.formDesign')">
          <a-icon slot="icon" type="form" />
        </a-step>
        <a-step status="finish" :title="this.$t('erp.formSet')">
          <a-icon slot="icon" type="branches" />
        </a-step>
        <a-step status="process" :title="this.$t('erp.formPublish')">
          <a-icon slot="icon" type="cloud-upload" />
        </a-step>
      </a-steps>
    </p>
    <div class="step-container">
      <div v-show="current === 0">
        <form-design :height="propHeight" ref="formDesignView"></form-design>
      </div>
      <div v-show="current === 1">
        <flow-design :height="propHeight" :bpmnEditDataInit="bpmnEditDataInit"></flow-design>
      </div>
      <div v-show="current === 2">
        <flow-form-publish
          :height="propHeight"
          @submit="sumbitHandler"
          :publishEditDataInit="publishEditDataInit"
          @success="$emit('back')"
        ></flow-form-publish>
      </div>
    </div>
  </a-card>
</template>

<script>
import FormDesign from '@/packages/FormDesigner/index.vue';
import FlowDesign from '@/packages/FlowDesigner/index.vue';
import FlowFormPublish from './FlowFormPublish';

export default {
  name: 'FlowFormDesigner',
  props: ['editRecord'],
  components: {
    FormDesign,
    FlowDesign,
    FlowFormPublish,
  },
  provide: function () {
    return {
      jumpTo: this.jumpTo,
    };
  },
  data() {
    return {
      current: 0,
      stepsHistoryStack: [0], // steps 的跳转栈，用于增加操作逻辑
      propHeight: 'calc(100vh - 66px)',
      isSubmit: false, // 用于判断路由切换时，提示控制
      bpmnEditDataInit: null, // 用于edit的回显初始化
      publishEditDataInit: null, // 用于edit的回显初始化
    };
  },
  created() {
    // 尝试数据初始化
    if (this.editRecord != null) {
      // init k-form-design
      this.$store.commit('SET_KFORM_DATA', JSON.parse(this.editRecord.formInfo));
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
          jsEnhance: '', //@jayce
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
      if (key === 1 && !currentFormInfo.list.length) {
        this.$warning({
          content: '表单设计为空，请先完成表单设计',
          onOk() {
            _this.current = 0;
          },
        });
      } else if (key === 2 && !window.historyExtendConfig.length) {
        this.$warning({
          content: '设计流程不可为空，请先完成流程设计',
          onOk() {
            _this.current = 1;
          },
        });
      }

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
<style scoped>
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
