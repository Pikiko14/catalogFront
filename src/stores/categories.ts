import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/Api';
import { CategoryInterface } from 'src/interfaces/categories';

const handlerRequest = new Request({
  Accept: 'application/json',
});

const path = 'categories';

export const useCategoriesStore = defineStore('categoriesStore', () => {
  // data
  const totalPage = ref<number>(1);
  const categories = ref<CategoryInterface[]>([]);

  // methods
  const saveCategory = async (params: CategoryInterface) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true
      )) as ResponseObj;
      if (response.success) {
        categories.value.push(response.data);
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

  const updateCategory = async (params: CategoryInterface, idx: number) => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${params._id}`,
        params,
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
    saveCategory,
    listCategories,
    clearCategories,
    updateCategory,
    deleteCategory,
  };
});
