<template>
  <bpmn-designer :xml.sync="xmlString" />
</template>
<script>
import BpmnDesigner from '@packages/components/Designer/index.vue';
export default {
  data() {
    return {
      xmlString: undefined,
    };
  },
  components: { BpmnDesigner },
};
</script>
<style></style>
