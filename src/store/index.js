import Vue from 'vue';
import Vuex from 'vuex';
import kform from './modules/kform';
import bpmn from './modules/bpmn';
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    kform,
    bpmn,
  },
  state: {},
  mutations: {},
  actions: {},
});
