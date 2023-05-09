<template>
  <div>
    <h1>test</h1>
    <!-- <CustomFields ref="cusf" /> -->
    <LangSet />
  </div>
</template>
<script>
// import { FlowDesigner } from '../dist/';
// console.log('[FormDesigner]: ', FormDesigner);
// import CustomFields from '@/components/CusCompsForFormDesign/CustomFields/CustomFields.vue';
import LangSet from '@/components/FlowForm/LangSet/index.vue';
export default {
  components: { LangSet },
  mounted() {
    // this.$refs.cusf.$data.exposeFields.price.disabled = true;
    // this.$refs.cusf.$data.exposeFields.userName.hidden = true;
    // console.log('[this.$refs.cusf]: ', this.$refs.cusf.$data.exposeFields.price.disabled);
  },
};
</script>
<style></style>
