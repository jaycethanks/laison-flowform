import Vue from 'vue';
import App from './App.vue';
// import vueBus from '@/utils/vueBus';
import store from '@/store';
import '@/lib/lazy_antd';
import '@/lib/lazy_elementui.js';
import i18n from '@/lang/index.js';
import '@/utils/localStorageEnhance.js'; //LocalStorage 方法增强
Vue.config.productionTip = false;
// Vue.use(vueBus);

new Vue({
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
