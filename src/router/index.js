import Vue from 'vue';
import VueRouter from 'vue-router';
import FormPreviewer from '@/packages/FormPreviewer';
import FlowFormTemplatesList from '@/components/FlowForm/FlowFormTemplatesList/index.vue';
import RouteView from '@/components/base/RouteView/index.vue';
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
    path: 'flowformDesign',
    icon: 'share-alt', //antd-icon name
    name: '流程模板',
    component: RouteView,
    // hiddenChild: true,
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
    path: 'configManagement',
    name: '配置管理',
    hidden: false,
    icon: 'api', //antd-icon name
    component: () => import('@/views/System/ConfigManagement/index.vue'),
  },

  {
    path: 'systemManagement',
    name: '系统管理',
    hidden: false,
    icon: 'api', //antd-icon name
    component: RouteView,
    children: [
      {
        path: 'department',
        icon: 'appstore', //antd-icon name
        name: '部门管理',
        component: () => import('@/views/System/SystemManagement/Department/index.vue'),
      },
      {
        path: 'menu',
        icon: 'appstore', //antd-icon name
        name: '菜单管理',
        component: () => import('@/views/System/SystemManagement/Menu/index.vue'),
      },
      {
        path: 'role',
        icon: 'appstore', //antd-icon name
        name: '角色管理',
        component: () => import('@/views/System/SystemManagement/Role/index.vue'),
      },
      {
        path: 'user',
        icon: 'appstore', //antd-icon name
        name: '用户管理',
        component: () => import('@/views/System/SystemManagement/User/index.vue'),
      },
    ],
  },

  {
    path: 'platformManagement',
    name: '平台管理',
    hidden: false,
    icon: 'api', //antd-icon name
    component: RouteView,
    children: [
      {
        path: 'platformRegistration',
        icon: 'appstore', //antd-icon name
        name: '平台注册',
        component: () => import('@/views/System/PlatformManagement/PlatformRegistration/index.vue'),
      },
      {
        path: 'userRegistration',
        icon: 'appstore', //antd-icon name
        name: '用户注册',
        component: () => import('@/views/System/PlatformManagement/UserRegistration/index.vue'),
      },
    ],
  },

  {
    path: 'statisticAnalysis',
    name: '统计分析',
    hidden: false,
    icon: 'api', //antd-icon name
    component: RouteView,
    children: [
      {
        path: 'workOrder',
        icon: 'appstore', //antd-icon name
        name: '工单统计',
        component: () => import('@/views/System/StatisticAnalysis/WorkOrder/index.vue'),
      },
      {
        path: 'workOrderResolutionRate',
        icon: 'appstore', //antd-icon name
        name: '工单解决率统计',
        component: () => import('@/views/System/StatisticAnalysis/WorkOrderResolutionRate/index.vue'),
      },
      {
        path: 'workOrderStatus',
        icon: 'appstore', //antd-icon name
        name: '工单状态统计',
        component: () => import('@/views/System/StatisticAnalysis/WorkOrderStatus/index.vue'),
      },
      {
        path: 'workOrderType',
        icon: 'appstore', //antd-icon name
        name: '工单类型统计',
        component: () => import('@/views/System/StatisticAnalysis/WorkOrderType/index.vue'),
      },
    ],
  },

  {
    path: 'notificationCenter',
    name: '通知中心',
    hidden: false,
    icon: 'api', //antd-icon name
    component: RouteView,
    children: [
      {
        path: 'params',
        icon: 'appstore', //antd-icon name
        name: '通知参数配置',
        component: () => import('@/views/System/NotificationCenter/Params/index.vue'),
      },
      {
        path: 'template',
        icon: 'appstore', //antd-icon name
        name: '通知模板配置',
        component: () => import('@/views/System/NotificationCenter/Template/index.vue'),
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
  {
    path: 'userCenter',
    name: '用户中心',
    hidden: false,
    icon: 'api', //antd-icon name
    component: () => import('@/views/System/UserCenter/index.vue'),
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
