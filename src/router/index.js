import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import ProcessList from '@/components/FlowForm/ProcessList/ProcessList.vue';

import FlowPreviewer from '@/packages/FlowPreviewer/index.vue';
import FlowDesigner from '@/packages/FlowDesigner';
import FormDesigner from '@/packages/FormDesigner';
import Test from '../../playground/Test.vue';
Vue.use(VueRouter);
export const systemRoutes = {
  path: '/',
  component: () => import('@/views/System/HomePage'),

  children: [
    {
      path: 'systemRegistration',
      name: '业务系统注册',
      icon: 'api', //antd-icon name
      component: () => import('@/views/System/SystemRegistration/index.vue'),
    },
    {
      path: 'flowformDesign',
      icon: 'pull-request', //antd-icon name
      name: '流程模板设计',
      component: () => import('@/views/System/FlowFormDesign/index.vue'),
    },
    {
      path: 'demo',
      icon: 'pull-request', //antd-icon name
      name: '平台页面测试',
      // component: Test,
      redirect: '/test',
      children: [
        { name: 'test', redirect: '/test', path: 'test' },
        { name: 'formDesign', redirect: '/formDesign', path: 'formDesign' },
        { name: 'formPreviewer', redirect: '/formPreviewer', path: 'formPreviewer' },
        { name: 'flowPreviewer', redirect: '/flowPreviewer', path: 'flowPreviewer' },
        {
          name: 'flowformDesigner',
          path: 'flowformDesigner',
          redirect: '/flowformDesigner',
        },
        {
          name: 'flowformManagement',
          path: 'flowformManagement',
          redirect: '/flowformManagement',
        },
      ],
    },
  ],
};

const platformRoutes = [
  { path: '/test', component: Test },
  { path: '/formDesign', component: FormDesigner },
  { path: '/formPreviewer', component: FormPreviewer },
  { path: '/flowPreviewer', component: FlowPreviewer },
  { path: '/flowformDesigner', component: () => import('@/packages/FlowFormDesigner/index.vue') },
  { path: '/flowformManagement', component: () => import('@/views/Platform/FlowFormManagement/index.vue') },
];
export default new VueRouter({
  mode: 'history',
  routes: [
    systemRoutes,
    ...platformRoutes,

    {
      path: '/login',
      component: () => import('@/views/System/Login/index.vue'),
    },
    { path: '*', component: () => import('@/views/System/404/NotFound.vue') },
  ],
});
