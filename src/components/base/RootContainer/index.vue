<template>
  <div class="root-container">
    <div class="root-content">
      <slot />
    </div>
    <FlowFormSvgIcon class="root-container-icon" />
  </div>
</template>
<script>
import FlowFormSvgIcon from '@/assets/svg_logo/FlowFormSvgIcon.vue';
export default {
  components: {
    FlowFormSvgIcon,
  },
};
</script>
<style scoped>
.root-container {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.root-content {
  overflow: auto;
}
.root-container-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 32px;
}
</style>
