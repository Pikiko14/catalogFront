/* eslint-disable @typescript-eslint/no-explicit-any */
import { boot } from 'quasar/wrappers';
import { Storage } from 'src/utils/storage';
import axios, { AxiosInstance } from 'axios';
import { notification } from './notification';
import { useAuthStore } from 'src/stores/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: `${process.env.API_URL}/api/v1` });

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  const storage = new Storage('interceptor');
  const store = useAuthStore();
  api.interceptors.response.use(undefined, async (error: any) => {
    if (error.response?.status === 401) {
      storage.deleteItemStorage('local', 'user');
      storage.removeCookie('session');
      store.doLogout();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    if (error.response) {
      if (error.response.status === 422) {
        if (error) {
          const { data } = error.response.data;
          const { msg } = data.shift();
          notification('negative', msg, 'red');
        }
      } else {
        error.response.data.message
          ? notification('negative', error.response.data.message, 'red')
          : error.response.data.error
          ? notification('negative', error.response.data.error, 'red')
          : notification('negative', error.response.statusText, 'red');
      }
    } else {
      notification(
        'negative',
        error.message
          ? error.message
          : 'Algo ha ocurrio al intentar procesar esta solicitud',
        'red'
      );
    }
    return Promise.reject(error);
  });
});

export { api };
