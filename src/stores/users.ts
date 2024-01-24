/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/Api';
import { User } from 'src/interfaces/UserInterface';

const path = 'users';
const handlerRequest = new Request({
  Accept: 'application/json',
});

export const useUsersStore = defineStore('userStore', () => {
  // data
  const users = ref<User[]>([]);
  const totalPage = ref<number>(1);

  // methods
  const doGetUsers = async (queryParams: string) => {
    try {
      const { data } = (await handlerRequest.doGetRequest(
        `${path}${queryParams}`,
        '',
        true
      )) as ResponseObj;
      if (data && data.users) {
        users.value.push(...data.users);
        totalPage.value = data.totalPages;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doSaveUser = async (params: User): Promise<ResponseObj | boolean> => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        false
      )) as ResponseObj;
      if (response.success) {
        users.value.push(response.data);
      }
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const doUpdateUser = async (params: User): Promise<ResponseObj | boolean> => {
    try {
      const response: ResponseObj = (await handlerRequest.doPutRequest(
        `${path}/${params._id}`,
        params,
        true,
        false
      )) as ResponseObj;
      if (response.success) {
        const index = users.value.findIndex((data) => {
          return data._id === params._id;
        });
        users.value[index] = response.data;
      }
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const doDeleteUsers = async (
    id: string | undefined,
    idx: number
  ): Promise<ResponseObj | boolean | undefined> => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      )) as ResponseObj;
      if (response.success) {
        users.value.splice(idx, 1);
        return response;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const clearUsers = () => {
    users.value = [];
  };

  // return statement
  return {
    users,
    totalPage,
    doGetUsers,
    clearUsers,
    doSaveUser,
    doDeleteUsers,
    doUpdateUser,
  };
});
