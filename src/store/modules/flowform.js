const kform = {
  state: {
    data: null,
    orgStruct: null,
    group: null,
  },
  mutations: {
    SET_FLOWFORM_DATA: (state, data) => {
      state.data = data;
    },
    SET_FLOWFORM_orgStruct: (state, data) => {
      state.orgStruct = data;
    },
    SET_FLOWFORM_group: (state, data) => {
      state.group = data;
    },
  },
};

export default kform;
