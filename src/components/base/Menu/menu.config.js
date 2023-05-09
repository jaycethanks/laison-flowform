import { systemRoutes } from '@/router';
const { children } = systemRoutes;
export default children.map((route) => {
  const { path, name, icon, children } = route;
  const requiredFields = ['path', 'name', 'icon'];
  requiredFields.forEach((i) => {
    if (!route[i]) {
      console.error(`页面侧边栏路由注册失败,${requiredFields.join()}字段为必要字段, 不可为空!`);
    }
  });
  return {
    path,
    icon,
    name,
    children,
  };
});
