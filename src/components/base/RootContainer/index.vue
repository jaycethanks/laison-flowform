<template>
  <div class="root-container">
    <div class="loading-mask" v-if="loading">
      <a-icon type="loading" />
      wait a moment...
    </div>
    <div ref="rootContent" class="root-content">
      <slot />
    </div>
    <FlowFormSvgIcon v-if="!noLogo" class="root-container-icon" />
  </div>
</template>
<script>
import FlowFormSvgIcon from '@/assets/svg_logo/FlowFormSvgIcon.vue';
export default {
  components: {
    FlowFormSvgIcon,
  },
  props: {
    noLogo: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  created() {
    window.removeEventListener('message', this.listener)
    window.addEventListener('message', this.listener);
  },
  methods: {
    listener(event) {
      if (event.data.type === 'getHeight') {
        const height = this.$el && this.$el.scrollHeight;
        event.source.postMessage({ type: 'height', height }, event.origin);
      }
    }
  }
};
</script>
<style scoped>
.root-container {
  /* background-color: #f8f9fb; */
  padding: 20px;
  height: auto;
  position: relative;
}
.root-content {
  overflow-y: auto;
  height: auto;
}
.root-container-icon {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 32px;
}
.loading-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
  background-color: rgb(255, 255, 255);
}
</style>
