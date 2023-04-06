import Vue from 'vue';
import App from './App.vue';
// Antd 按需加载
import './components/lazy_antd';
// elementui 按需引入
import 'element-ui/lib/theme-chalk/index.css';
import '@/components/lazy_elementui.js';
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
