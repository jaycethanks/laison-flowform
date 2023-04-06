const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  css: { extract: false }, // 配置打包后css文件是否独立
});
