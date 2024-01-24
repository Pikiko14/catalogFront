/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/Api';
import {
  MediaProductInterface,
  ProductInterface,
} from 'src/interfaces/Product';

const handlerRequest = new Request({
  Accept: 'application/json',
});

const path = 'products';

export const useProductsStore = defineStore('productsStore', () => {
  // data
  const totalPage = ref<number>(1);
  const product = ref<ProductInterface>({});
  const products = ref<ProductInterface[]>([]);

  // methods
  const doListProducts = async (queryParams: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        queryParams,
        true
      )) as ResponseObj;
      if (response.success) {
        products.value.push(...response.data.products);
        totalPage.value = response.data.totalPages;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const clearProduct = () => {
    products.value = [];
  };

  const doSaveProduct = async (params: any) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        products.value.push(response.data);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doDeleteProduct = async (id: string) => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      )) as ResponseObj;
      if (response.success) {
        const index = products.value.findIndex((data) => {
          return data._id === id;
        });
        products.value.splice(index, 1);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doGetProduct = async (id: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}/${id}`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        product.value = response.data;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doUpdateProduct = async (
    params: FormData,
    productId: string | undefined
  ) => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${productId}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        const index = products.value.findIndex((data: ProductInterface) => {
          return data._id === response.data._id;
        });
        if (index !== -1) {
          products.value[index] = response.data;
        }
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearOneProduct = () => {
    product.value = {};
  };

  const setDefaultImage = async (
    media: MediaProductInterface,
    productId: string | undefined
  ) => {
    try {
      const response: ResponseObj = await handlerRequest.doPostRequest(
        `products/${productId}/default-img`,
        media,
        true
      );
      if (response.success) {
        const index = products.value.findIndex(
          (data: ProductInterface) => data._id === response.data._id
        );
        if (index !== -1) {
          products.value[index] = response.data;
        }
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // return data and methods
  return {
    product,
    products,
    totalPage,
    doGetProduct,
    clearProduct,
    doSaveProduct,
    doListProducts,
    doDeleteProduct,
    clearOneProduct,
    setDefaultImage,
    doUpdateProduct,
  };
});
