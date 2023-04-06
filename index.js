import HelloWorld from './src/components/HelloWorld.vue';
import FormPreviewer from './src/components/FormPreviewer/index.vue';
const components = [HelloWorld, FormPreviewer];
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
};
