<template>
  <a-menu class="menu-root" mode="inline" :default-selected-keys="['1']">
    <template v-for="{ key, icon, text } in menuConfig">
      <a-menu-item class="menu-item" :key="key">
        <router-link :to="key">
          <a-icon :type="icon" />
          <span>{{ text }}</span>
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script>
import menuConfig from './menu.config';

export default {
  components: {},
  data() {
    return {
      menuConfig: menuConfig,
    };
  },
};
</script>
<style scoped lang="scss">
@import '@/components/base/base.scss';
::v-deep .ant-menu-item > a {
  color: inherit;
}
.menu-root {
  background-color: inherit;
  border: unset;
  color: inherit;
  .menu-item {
    color: inherit;
    background-color: inherit;
    &:hover {
      // font-weight: bold;
      background-color: $layout-aside-hover-bg;
    }
  }
}
</style>
