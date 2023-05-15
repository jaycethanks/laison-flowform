<template>
  <div class="flowform-design-page">
    <div class="flow_form_index_page" style="height: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ProcessList from '@/components/FlowForm/ProcessList/ProcessList.vue';
import FlowFormDesignerType from '@/constants/FlowFormDesignerType.js';
import FlowFormDesigner from '@/packages/FlowFormDesigner/index.vue';
export default {
  name: 'FlowFormDesignPage',
  components: {
    FlowFormDesigner,
    ProcessList,
  },
  data() {
    return {
      FlowFormDesignerType,
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
