import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import FlowFormTemplatesList from '@/components/FlowForm/FlowFormTemplatesList/index.vue';

import FlowPreviewer from '@/packages/FlowPreviewer/index.vue';
import FlowDesigner from '@/packages/FlowDesigner';
import FormDesigner from '@/packages/FormDesigner';
import FlowFormDesignerType from '@/constants/FlowFormDesignerType.js';

import Test from '../../playground/Test.vue';
Vue.use(VueRouter);
export const systemRoutes = [
  {
    path: '', //默认首页
    name: '首页',
    icon: 'home',
    component: () => import('@/views/System/HomePage'), //默认sub路由页面
  },
  {
    path: 'systemRegistration',
    name: '业务系统注册',
    hidden: false,
    icon: 'api', //antd-icon name
    component: () => import('@/views/System/SystemRegistration/index.vue'),
  },
  {
    path: 'flowformDesign',
    icon: 'share-alt', //antd-icon name
    name: '流程模板设计',
    component: () => import('@/views/System/FlowFormDesign/index.vue'),
    hiddenChild: true,
    children: [
      {
        path: 'flowformDesigner',
        icon: 'file-add', //antd-icon name
        name: '新增流程模板',
        beforeEnter: (to, from, next) => {
          if (!to.query.type) {
            // 如果没有传递 query 参数，默认设置 'type'
            next({ path: to.path, query: { type: 1 } });
          } else {
            next();
          }
        },
        props: (route) => ({
          defaultQuery: route.query.defaultQuery || 'default value',
        }),
        component: () => import('@/packages/FlowFormDesigner/index.vue'),
        // component: () => import('@/packages/FlowFormDesigner/index.vue'),
      },
      {
        path: 'flowformTemplatesList',
        icon: 'appstore', //antd-icon name
        name: '流程模板管理列表',
        component: () => import('@/components/FlowForm/FlowFormTemplatesList/index.vue'),
      },
    ],
  },
  {
    path: 'demo',
    icon: 'pull-request', //antd-icon name
    name: '平台页面测试',
    // component: Test,
    redirect: '/test',
    children: [
      { name: 'test', redirect: '/platform/test', path: 'test' },
      { name: 'formDesign', redirect: '/platform/formDesign', path: 'formDesign' },
      { name: 'formPreviewer', redirect: '/platform/formPreviewer', path: 'formPreviewer' },
      { name: 'flowPreviewer', redirect: '/platform/flowPreviewer', path: 'flowPreviewer' },
      {
        name: 'flowformDesigner',
        path: 'flowformDesigner',
        redirect: '/platform/flowformDesigner',
      },
      {
        name: 'flowformManagement',
        path: 'flowformManagement',
        redirect: '/platform/flowformManagement',
      },
    ],
  },
];

const platformRoutes = [
  { path: 'test', component: Test },
  { path: 'formDesign', component: FormDesigner },
  { path: 'formPreviewer', component: FormPreviewer },
  { path: 'flowPreviewer', component: FlowPreviewer },
  {
    path: 'flowformDesigner',
    beforeEnter: (to, from, next) => {
      if (!to.query.type) {
        // 如果没有传递 query 参数，默认设置 'type'
        next({ path: to.path, query: { type: 2 } });
      } else {
        next();
      }
    },
    component: () => import('@/packages/FlowFormDesigner/index.vue'),
  },
  { path: 'flowformManagement', component: () => import('@/views/Platform/FlowFormManagement/index.vue') },
];

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/system',
    },
    {
      path: '/system',
      component: () => import('@/components/base/Layout/index.vue'),
      children: systemRoutes,
    },
    {
      path: '/platform',
      name: '平台根路由',
      component: () => import('@/views/Platform/index.vue'),
      children: platformRoutes,
    },
    {
      path: '/login',
      component: () => import('@/views/System/Login/index.vue'),
    },
    { path: '*', component: () => import('@/views/System/404/NotFound.vue') },
  ],
});

export default router;

// router.beforeEach((to, from, next) => {
//   if (to.name === '/system/flowformDesign/flowformDesigner' && !to.query.hasOwnProperty('type')) {
//     to.query.type = 1;
//   }
//   next();
// });
