<template>
  <div class="flowform-design-page">
    <div v-if="showIndex" class="flow_form_index_page" style="height: 100%">
      <a-button @click="showIndex = false">新建流程模板</a-button>
      <ProcessList style="height: calc(100% - 34px)" @edit="showIndex = false" />
    </div>
    <FlowFormDesigner v-else @back="showIndex = true" />
  </div>
</template>

<script>
import ProcessList from '@/components/ProcessList/ProcessList.vue';
import FlowFormDesigner from '@/packages/FlowFormDesigner/index.vue';
export default {
  name: 'FlowFormDesignPage',
  components: {
    FlowFormDesigner,
    ProcessList,
  },
  data() {
    return {
      showIndex: true,
    };
  },
};
</script>
<style scoped>
.flowform-design-page {
  height: 100%;
  width: 100%;
}
</style>
