<template>
  <div>
    <FormDesigner />
  </div>
</template>
<script>
import { Flow } from '../dist/laison-flowform.umd.js';
console.log('[FormDesigner]: ', FormDesigner);
export default {
  components: { FormDesigner: FormDesigner },
};
</script>
<style></style>
