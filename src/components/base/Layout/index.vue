<template>
  <a-layout id="layout-root">
    <a-layout-sider theme="dark" id="layout-aside" v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"><Logo /></div>
      <Menu />
    </a-layout-sider>
    <a-layout>
      <LayoutHeader :collapsed="collapsed" @toggleSideEvent="collapsed = !collapsed" />
      <a-layout-content :style="{ margin: '10px 10px', padding: '10px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Logo from '@/assets/svg_logo/FlowFormSvgIcon.vue';
import LayoutHeader from '../LayoutHeader';
import Menu from '../Menu';
export default {
  components: {
    Logo,
    Menu,
    LayoutHeader,
  },
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style scoped lang="scss">
@import '@/components/base/base.scss';

#layout-root {
  height: 100vh;
  #layout-aside {
    // background-color: rgb(0, 3, 22);
    color: $layout-aside-color;
  }
}

#layout-root .logo {
  // height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
