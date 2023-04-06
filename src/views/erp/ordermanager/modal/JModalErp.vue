<template>
  <j-modal
    :title="title"
    :visible="visible"
    @cancel="$emit('cancel')"
    :mask-closable="false"
    width="90vw"
    :footer="null"
    switchFullscreen
    @fullScreenEvent="isFullScreen = $event"
    :body-style="{ maxHeight: isFullScreen ? '' : '80vh', overflowY: 'auto', padding: '5px' }"
  >
    <slot></slot>
  </j-modal>
</template>
<script>
export default {
  name: 'JModalErp',
  data() {
    return {
      isFullScreen: false,
    }
  },
  props: {
    title: {
      type: String,
      default: '默认标题',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style></style>
