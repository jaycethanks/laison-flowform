const kform = {
  state: {
    data: null,
  },
  mutations: {
    SET_KFORM_DATA: (state, data) => {
      state.data = data;
      cusLocalStorage.setItem('kform', 'data', data);
    },
  },
};

export default kform;
