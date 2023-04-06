import Vue from 'vue';
import App from './App.vue';
import VueI18n from 'vue-i18n';
import JeecgComponents from '@/components/jeecg/index';
import vueBus from '@/utils/vueBus';
import store from './store/';
// Antd 按需加载
import '@/lib/lazy_antd';
// elementui 按需引入
import '@/lib/lazy_elementui.js';
//LocalStorage 方法增强
import './utils/localStorageEnhance.js';
Vue.config.productionTip = false;
Vue.use(JeecgComponents);
Vue.use(vueBus);

/** i18n start */
Vue.use(VueI18n);
const languages = {
  en: {},
};
const messages = Object.assign(languages);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
/** i18n end */

new Vue({
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
