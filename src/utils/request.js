import axios from 'axios';
import router from '@/router';
import { message as $message } from 'ant-design-vue';
const baseUrl = process.env.VUE_APP_BASE_URL;
// 创建 axios 实例
const service = axios.create({
  //baseURL: '/jeecg-boot',
  baseURL: baseUrl, // api base_url
  timeout: 30000, // 请求超时时间
});
function checkIfInWhitelist() {
  // 以platform 开头的路由， 不要设定 Authorization
  const {
    currentRoute: { path },
  } = router;
  return /^\/platform\/[^\/]+/.test(path);
}
// request interceptor
service.interceptors.request.use(
  function (config) {
    const token = cusLocalStorage.getItem('system', 'access_token');
    if (token) {
      if (!checkIfInWhitelist()) {
        config.headers['Authorization'] = 'bearer ' + token;
      } else {
        const lang = cusLocalStorage.getItem('business_system', 'lang');
        config.headers['Authorization'] = null;
        config.headers['language'] = lang;
      }
      // /api/file 文件下载， 去除 /api baseUrl
      // debugger
      // if (/^\/api\/file\//.test(config.url)) {
      //   console.log('[config]: ', config)

      // }
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
    // 624: token 失效
    if (response.data.status === 624) {
      const {
        currentRoute: { path },
      } = router;
      if (/^\/platform\/[^\/]+/.test(path)) {
        // 平台页接口token过期
        router.push('/platform/401');
        // 获取指向父级窗口的引用,向宿主页面通知 token 失效
        var parentWindow = window.parent;
        parentWindow && parentWindow.postMessage({ type: 'token_expired' }, '*');
      } else {
        // 系统平台过期
        $message.error(`登录凭证失效，请重新登录！`);
        router.push('/login');
      }
    } else if ([403, 401].includes(response.data.status)) {
      $message.error(`登录凭证过期，请重新登录！`);
      router.push('/login');
      localStorage.removeItem('token');
    } else {
      return response.data;
    }
  },
  // 服务器状态码不是2开头的的情况
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  (error) => {
    $message.error(`Network Error！ Please try again`);
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
