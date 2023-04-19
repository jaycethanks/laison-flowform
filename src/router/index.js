import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import ProcessList from '@/packages/FlowFormDesigner/comps/ProcessList.vue';
import FlowFormDesigner from '@/packages/FlowFormDesigner/index.vue';
import FlowPreviewer from '@/packages/FlowPreviewer/index.vue';
import FlowDesigner from '@/packages/FlowDesigner';
import FormDesigner from '@/packages/FormDesigner';
import NotFound from '@/views/NotFound.vue';
Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: FlowFormDesigner },
    { path: '/formdesign', component: FormDesigner },
    { path: '/flowdesign', component: FlowDesigner },
    { path: '/formpreviewer', component: FormPreviewer },
    { path: '/flowpreviewer', component: FlowPreviewer },
    // { path: '*', component: NotFound },
  ],
});
