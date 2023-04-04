import HelloWorld from "./src/components/HelloWorld.vue";
const components = [HelloWorld];
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
};
