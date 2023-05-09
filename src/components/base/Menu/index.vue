<template>
  <a-menu :inline-collapsed="collapsed" theme="dark" class="menu-root" mode="inline" :default-selected-keys="['1']">
    <template v-for="{ path, icon, name, children } in menuConfig">
      <a-menu-item class="menu-item" :key="path" v-if="children === undefined">
        <router-link :to="path">
          <a-icon :type="icon" />
          <span>{{ name }}</span>
        </router-link>
      </a-menu-item>

      <!-- 二级菜单 -->
      <a-sub-menu class="menu-root" v-if="children" :key="path">
        <span slot="title"><a-icon :type="icon" />{{ collapsed ? '' : name }} </span>
        <template v-for="{ path, icon, name } in children">
          <a-menu-item class="menu-item" :key="path">
            <router-link :to="path">
              <a-icon :type="icon ? icon : 'file'" />
              <span>{{ name }}</span>
            </router-link>
          </a-menu-item>
        </template>
      </a-sub-menu>
    </template>
  </a-menu>
</template>
<script>
import menuConfig from './menu.config';

export default {
  props: ['collapsed'],
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
