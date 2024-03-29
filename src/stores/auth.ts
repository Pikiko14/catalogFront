/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import {
  ProfileInterface,
  RegisterData,
  LoginData,
} from 'src/interfaces/AuthInterface';
import { ResponseObj } from 'src/interfaces/api';
import { Storage } from 'src/utils/storage';
import { User } from 'src/interfaces/userInterface';
import { SubscriptionsInterface } from 'src/interfaces/subscriptionInterface';

const path = 'auth';
const handlerRequest = new Request({
  Accept: 'application/json',
});
const storage = new Storage('auth');

export const useAuthStore = defineStore('authStore', () => {
  // data
  const now = ref<Date | string>('');
  const profile = ref<ProfileInterface>({
    whatsapp_message: '',
    brand_color: '',
  });
  const subscription = ref<SubscriptionsInterface>({});
  const token = ref<string>(storage.getItemStorage('local', 'session') || '');
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
      storage.deleteItemStorage('local', 'session');
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
        storage.saveInStorage('local', 'session', data.token);
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
      storage.deleteItemStorage('local', 'session');
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
      profile.value = {
        whatsapp_message: '',
        brand_color: '',
      };
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
      if (response.success) {
        profile.value = response.data;
      }
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

  const soConfigurationProfile = async (params: any, profileId: string) => {
    try {
      const response: ResponseObj = (await handlerRequest.doPutRequest(
        `profile/${profileId}/configuration/set`,
        params,
        true,
        true
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

  /**
   * init recovery password
   * @param params
   * @returns
   */
  const initRecoveryPassword = async (params: any) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}/recovery/password`,
        params,
        false,
        false
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
      // validamos  el usuario
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * init recovery password
   * @param params
   * @returns
   */
  const doChangePassword = async (params: any) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}/change/password`,
        params,
        false,
        false
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
      // validamos  el usuario
    } catch (error) {
      console.log(error);
    }
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
    doChangePassword,
    changeProfileImage,
    disableSubscription,
    initRecoveryPassword,
    soConfigurationProfile,
  };
});
