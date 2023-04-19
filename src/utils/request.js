import axios from 'axios';

const baseUrl = process.env.VUE_APP_BASE_URL;
// 创建 axios 实例
const service = axios.create({
  //baseURL: '/jeecg-boot',
  baseURL: baseUrl, // api base_url
  timeout: 30000, // 请求超时时间
});

// request interceptor
service.interceptors.request.use(
  function (config) {
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token');
      return config;
    } else {
      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    // console.log('[response]: ', response);
    // if (process.env.NODE_ENV === 'mock') {
    //   return injectMock();
    // }
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.data.errorcode === 401) {
      window.location.href = 'login.html';
    } else if (response.data.errorcode === 403) {
      // Message({
      //   message: 'The login information has expired. Please login again.',
      //   type: 'error',
      //   duration: 5 * 1000,
      // });
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    } else {
      return response.data;
    }
  },
  // 服务器状态码不是2开头的的情况
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  (error) => {
    // Message({
    //   message: error.response.statusText,
    //   type: 'error',
    //   duration: 5 * 1000,
    // });
  },
);

const VueAxios = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  install(Vue, router = {}, instance) {
    if (this.installed) {
      return;
    }
    this.installed = true;

    if (!instance) {
      // eslint-disable-next-line no-console
      console.error('You have to install axios');
      return;
    }

    Vue.axios = instance;

    Object.defineProperties(Vue.prototype, {
      $axios: {
        get: function get() {
          return instance;
        },
      },
    });
  },
};

const installer = {
  vm: {},
  install(Vue, router = {}) {
    Vue.use(VueAxios, router, service);
  },
};

export { installer as VueAxios, service as axios };
