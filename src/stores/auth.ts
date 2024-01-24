/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ProfileInterface, RegisterData } from 'src/interfaces/AuthInterface';
import { ResponseObj } from 'src/interfaces/Api';
import { LoginData } from './../interfaces/AuthInterface';
import { Storage } from 'src/utils/storage';
import { User } from 'src/interfaces/UserInterface';
import { SubscriptionsInterface } from 'src/interfaces/SubscriptionInterface';

const path = 'auth';
const handlerRequest = new Request({
  Accept: 'application/json',
});
const storage = new Storage('auth');

export const useAuthStore = defineStore('authStore', () => {
  // data
  const now = ref<Date | string>('');
  const profile = ref<ProfileInterface>({});
  const subscription = ref<SubscriptionsInterface>({});
  const token = ref<string>(storage.getCookie('session') || '');
  const user = ref<User>(storage.getItemStorage('local', 'user') || {});

  // methods
  const doSignUp = async (params: RegisterData) => {
    try {
      const data = (await handlerRequest.doPostRequest(
        `${path}/register`,
        params,
        false,
        false
      )) as ResponseObj;
      return data;
      // validamos  el usuario
    } catch (error) {}
  };

  const doLogin = async (params: LoginData) => {
    try {
      storage.removeCookie('session');
      storage.deleteItemStorage('local', 'user');
      const response = (await handlerRequest.doPostRequest(
        `${path}/login`,
        params,
        false,
        false
      )) as ResponseObj;
      if (response.success) {
        const { data } = response;
        // set user in storage
        storage.saveInStorage('local', 'user', data.user);
        // save token in cookie
        storage.setCookie(22, data.token, 'session');
        // set data now
        token.value = data.token;
        user.value = data.user;
      }
      return response;
      // validamos  el usuario
    } catch (error) {}
  };

  const doLogout = () => {
    try {
      storage.removeCookie('session');
      storage.deleteItemStorage('local', 'user');
      user.value = {
        _id: '',
        username: '',
        name: '',
        last_name: '',
        email: '',
        role: '',
        scopes: [],
        parent: '',
        catalogues: [],
        createdAt: '',
        updatedAt: '',
      };
      token.value = '';
      profile.value = {};
      subscription.value = {};
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * List profile data
   * @param id
   * @returns
   */
  const listProfile = async (id: string | undefined) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `profile/${id}`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        now.value = response.data.now;
        profile.value = response.data.profile;
        subscription.value = response.data.subscription;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Change profile image
   * @param params
   */
  const changeProfileImage = async (params: any) => {
    try {
      const response: ResponseObj = (await handlerRequest.doPostRequest(
        'profile/image/change',
        params,
        true,
        true
      )) as ResponseObj;
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const doSaveBrandData = async (params: any) => {
    try {
      const response: ResponseObj = (await handlerRequest.doPutRequest(
        'profile',
        params,
        true,
        false
      )) as ResponseObj;
      if (response?.success) {
        profile.value = response?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // clear subscription
  const disableSubscription = () => {
    subscription.value = {};
  };

  // return statement
  return {
    user,
    token,
    profile,
    subscription,
    now,
    doSignUp,
    doLogin,
    doLogout,
    listProfile,
    doSaveBrandData,
    changeProfileImage,
    disableSubscription,
  };
});
