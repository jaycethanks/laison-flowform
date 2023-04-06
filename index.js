import FormPreviewer from './src/components/FormPreviewer/index.vue';
const components = [FormPreviewer];
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
};
