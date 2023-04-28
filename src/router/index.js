import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import ProcessList from '@/components/ProcessList/ProcessList.vue';

import FlowPreviewer from '@/packages/FlowPreviewer/index.vue';
import FlowDesigner from '@/packages/FlowDesigner';
import FormDesigner from '@/packages/FormDesigner';
import Test from '../../playground/Test.vue';
import NotFound from '@/views/NotFound.vue';
Vue.use(VueRouter);
export const systemRoutes = {
  path: '/',
  component: () => import('@/views/HomePage'),

  children: [
    {
      path: 'system_registration_page',
      name: '业务系统注册',
      icon: 'api', //antd-icon name
      component: () => import('@/views/SystemRegistrationPage/index.vue'),
    },
    {
      path: 'flowform_template_design_page',
      icon: 'pull-request', //antd-icon name
      name: '流程模板',
      component: () => import('@/views/FlowFormTemplateDesignPage/index.vue'),
    },
    {
      path: 'flowform_design_page',
      icon: 'pull-request', //antd-icon name
      name: '流程设计',
      component: () => import('@/views/FlowFormDesignPage/index.vue'),
    },
  ],
};
export default new VueRouter({
  mode: 'history',
  routes: [
    systemRoutes,
    { path: '/test', component: Test },
    { path: '/formdesign', component: FormDesigner },
    { path: '/flowdesign', component: FlowDesigner },
    { path: '/formpreviewer', component: FormPreviewer },
    { path: '/flowpreviewer', component: FlowPreviewer },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
    },
    { path: '*', component: NotFound },
  ],
});
