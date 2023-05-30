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
  productionSourceMap: false,
  transpileDependencies: true,
  css: {
    extract: false, // 配置打包后css文件是否独立
    loaderOptions: {
      less: {
        modifyVars: {
          // /* less 变量覆盖，用于自定义 ant design 主题 */
          // 'primary-color': '#1890FF', // 同时也是k-form-design的主题色
          // 'layout-color': '#1890FF', //k-form-design 的布局框颜色
          // 'link-color': '#1890FF',
          // 'border-radius-base': '4px',
        },
        javascriptEnabled: true, // 解决，antd less 样式引入报错问题
      },
      // sass: {
      //   data: `@import "@/styles/_variables.scss";`
      // }
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

  devServer: {
    // disableHostCheck: true,
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://192.168.3.47:12345',
        // target: 'http://127.0.0.1:1228',
        target: 'http://192.168.3.47:1228', // 请求本地 需要jeecg-boot后台项目
        // ws: true,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api': '/', // 这种接口配置出来     http://XX.XX.XX.XX:8083/login
        },
      },
      '/file': {
        target: 'http://127.0.0.1:2456', // 请求本地 需要jeecg-boot后台项目
        // target: 'http://192.168.3.47', // 请求本地 需要jeecg-boot后台项目
        // target: 'http://192.168.0.166:11180', // 请求本地 需要jeecg-boot后台项目
        changeOrigin: true,
        logLevel: 'debug',

        pathRewrite: {
          '^/file': '/file', // 这种接口配置出来     http://XX.XX.XX.XX:8083/login
        },
      },
    },
  },
});
