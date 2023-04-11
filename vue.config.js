const { defineConfig } = require('@vue/cli-service');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  pages: {
    index: {
      entry: 'playground/main.js',
      // template: "public/index.html"
    },
  },
  transpileDependencies: true,
  css: {
    extract: false, // 配置打包后css文件是否独立
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#1890FF', // 同时也是k-form-design的主题色
          'layout-color': '#1890FF', //k-form-design 的布局框颜色
          'link-color': '#1890FF',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true, // 解决，antd less 样式引入报错问题
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@packages': resolve('src/lib/bpmnpdv2/packages'),
        '@utils': resolve('src/lib/bpmnpdv2/utils'),
      },
    },
  },
});
