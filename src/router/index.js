import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import ProcessList from '@/packages/FlowFormDesigner/comps/ProcessList.vue';
import FlowFormDesigner from '@/packages/FlowFormDesigner/index.vue';
import FlowPreviewer from '@/packages/FlowPreviewer/index.vue';
import FlowDesigner from '@/packages/FlowDesigner';
import FormDesigner from '@/packages/FormDesigner';
Vue.use(VueRouter);

const routes = [
  { path: '/', component: FlowFormDesigner },
  { path: '/formdesign', component: FormDesigner },
  { path: '/flowdesign', component: FlowDesigner },
];

export default new VueRouter({
  routes,
});
