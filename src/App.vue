<template>
  <div id="flow-form-page-root-wrapper" ref="flowFormPageRootWrapper">
    <!--    <LaisonStockList />-->
    <div v-if="showIndex" class="flow_form_index_page" style="height: 100%">
      <!-- prettier-ignore -->
      <a-button @click="record = null;showIndex = false">新建流程表单</a-button>
      <FormPreviewer />
      <ProcessList
        style="height: calc(100% - 62px)"
        @edit="
          record = $event;
          showIndex = false;
        "
      />
    </div>
    <div v-else class="flow_form_designer_page">
      <FlowFormDesigner :editRecord="record" @back="showIndex = true" />
    </div>
  </div>
</template>

<script>
import FormPreviewer from '@/components/FormPreviewer/index.vue';
import ProcessList from '@/components/FlowFormDesigner/comps/ProcessList.vue';
import FlowFormDesigner from '@/components/FlowFormDesigner/index.vue';
// import LaisonStockList from '@/components/laison/LaisonStockList.vue'

export default {
  data() {
    return {
      showIndex: true,
      record: null,
    };
  },
  components: {
    FlowFormDesigner,
    ProcessList,
    FormPreviewer,
    // LaisonStockList,
  },
  mounted() {},
  methods: {
    handleDownload() {},
    //  handleEdit(record) {
    /**
     * ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
     * record 是整个流程的数据，在编辑时，需要将 FlowFormDesigner 进行数据初始化
     * 而 FlowFormDesigner 由三个主要模块组成， 分别时 k-form-design 表单设计、 bpmn 流程设计、 以及流程发布
     * 这三个模块的数数据来源都不统一，
     * 简单的说：
     * 1. k-form-design 的读写是通过 store 去操作的， 编辑都会保存一份 localstorage（增强localstorage，见main.js localstorage 增强），
     * 总的来说，需要通过 this.$store.commit('SET_KFORM_DATA', 表单数据) 去 set k-form-design, 而在收集表单数据时，则是 this.$store.state.kform.data 可以直接获取
     * （目前，所有模块的数据收集都已经在 formDesignPublish 中完成， 所以，在edit时，仅需要初始化这三个模块数据即可）
     * 2. bpmn 流程设计， 其初始化接口，在 "src\views\erp\formdesign\FlowFormDesigner\BpmnDesigner.vue ---- xmlString"
     * 所以需要这里需要将当前record的数据传入， 且需要处理为新增的时候，将其置空操作，
     * 此外需要特别注意的是，字段的控制， 人员组织选择控件都需要初始化。
     * 3. FormDesignPublish 也需要传入初始化数据
     *
     * 方便和可读性起见， 这里会将数据传入 FlowFormDesigner ，然后做简单处理后，直接用props 传值，处理2，3 , 并直接set 1, 具体的数据处理，分散到各层级组件。
     * ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
     */
    // }
  },
};
</script>
<style scoped lang="scss">
>>> .ant-modal {
  top: 123px;
}
>>> .ant-modal-content {
  box-shadow: unset;
}
#flow-form-page-root-wrapper {
  background-color: #fff;
  height: calc(100vh - 123px);
  .flow_form_index_page {
    padding: 10px;
  }
}
</style>
