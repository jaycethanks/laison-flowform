import Vue from 'vue';
import App from './App.vue';
// Antd 按需加载
import './components/lazy_antd';
// elementui 按需引入
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n';
import JeecgComponents from '@/components/jeecg/index';
import vueBus from '@/utils/vueBus';

import '@/components/lazy_elementui.js';
import store from './store/';
//LocalStorage 方法增强
import './components/localStorageEnhance.js';
import KFormDesign from './components/kform';
Vue.use(KFormDesign);
// import './components/styles/form-design.less';
/* Bpmn Process Designer -- Start -- */

import '@/components/bpmnpd/package/theme/element-variables.scss';

// 引入highlight，代码高亮插件
// import { vuePlugin } from '@/components/bpmnpd/src/highlight'
// import 'highlight.js/styles/atom-one-dark-reasonable.css'
// Vue.use(vuePlugin)

// 引入bpmn-process-designer插件
import '@/components/bpmnpd/package/theme/index.scss';
import MyPD from '@/components/bpmnpd/package/';
Vue.use(MyPD);

// 引入bpmn插件
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
/* Bpmn Process Designer -- End -- */
Vue.config.productionTip = false;
Vue.use(JeecgComponents);
Vue.use(vueBus);

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
new Vue({
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
