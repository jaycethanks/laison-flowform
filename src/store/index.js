import Vue from 'vue';
import Vuex from 'vuex';
import kform from './modules/kform';
import bpmn from './modules/bpmn';
import flowform from './modules/flowform';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    kform,
    bpmn,
    flowform,
  },
  state: {},
  mutations: {},
  actions: {},
});
