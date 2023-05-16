<template>
  <div>
    <h1>test</h1>
    <!-- <CustomFields ref="cusf" /> -->
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
  </div>
</template>
<script>
// import { FlowDesigner } from '../dist/';
// console.log('[FormDesigner]: ', FormDesigner);
// import CustomFields from '@/components/CusCompsForFormDesign/CustomFields/CustomFields.vue';
import SvgIconFormDesign from '@/assets/svgIcon/SvgIconFormDesign.vue';
import SvgIconFlowDesign from '@/assets/svgIcon/SvgIconFlowDesign.vue';
import SvgIconFFPublish from '@/assets/svgIcon/SvgIconFFPublish.vue';
export default {
  data() {
    return {
      current: 0,
    };
  },
  components: {
    SvgIconFormDesign,
    SvgIconFlowDesign,
    SvgIconFFPublish,
  },
  methods: {
    onStepChange(key) {},
  },
  mounted() {
    // this.$refs.cusf.$data.exposeFields.price.disabled = true;
    // this.$refs.cusf.$data.exposeFields.userName.hidden = true;
    // console.log('[this.$refs.cusf]: ', this.$refs.cusf.$data.exposeFields.price.disabled);
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
