import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/api';
import { CategoryInterface } from 'src/interfaces/categories';

const handlerRequest = new Request({
  Accept: 'application/json',
});

const path = 'categories';

export const useCategoriesStore = defineStore('categoriesStore', () => {
  // data
  const totalPage = ref<number>(1);
  const totalItems = ref<number>(1);
  const categories = ref<CategoryInterface[]>([]);

  // methods
  const saveCategory = async (params: FormData) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        categories.value.push(response.data);
        totalItems.value++;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const listCategories = async (queryParams: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        path,
        queryParams,
        true
      )) as ResponseObj;
      if (response.success) {
        totalPage.value = response.data.totalPages;
        totalItems.value = response.data.totalCategories;
        categories.value.push(...response.data.categories);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const clearCategories = () => {
    categories.value = [];
  };

  const updateCategory = async (
    params: FormData,
    id: string | undefined,
    idx: number
  ) => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${id}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        if (categories.value[idx]) {
          categories.value[idx] = response.data;
        }
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id: string, idx: number) => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      )) as ResponseObj;
      if (response.success) {
        if (categories.value[idx]) {
          totalItems.value--;
          categories.value.splice(idx, 1);
        }
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // return data and methods
  return {
    totalPage,
    categories,
    totalItems,
    saveCategory,
    updateCategory,
    deleteCategory,
    listCategories,
    clearCategories,
  };
});
