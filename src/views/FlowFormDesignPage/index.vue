<template>
  <div class="flowform-design-page">
    <!-- <h1>流程表单设计</h1> -->
    <FlowFormDesigner />
  </div>
</template>
<script>
import FlowFormDesigner from '@/packages/FlowFormDesigner/index.vue';
export default {
  components: {
    FlowFormDesigner,
  },
};
</script>
<style scoped>
.flowform-design-page {
  height: 100%;
  width: 100%;
}
</style>
