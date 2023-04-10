<template>
  <bpmn-designer :xml.sync="xmlString" />
</template>
<script>
import BpmnDesigner from '@/lib/bpmnpdv2/packages/components/Designer/index.vue';

export default {
  components: { BpmnDesigner },
};
</script>
<style></style>
