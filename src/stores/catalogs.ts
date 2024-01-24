/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/Api';
import { Catalogue } from 'src/interfaces/CatalogueInterface';
import { ImportPagesInterface } from 'src/interfaces/CatalogueInterface';

const path = 'catalogues';
const handlerRequest = new Request({
  Accept: 'application/json',
});

export const useCatalogsStore = defineStore('catalogsStore', () => {
  // data
  const catalogs = ref<Catalogue[]>([]);
  const totalPage = ref<number>(1);

  // methods
  const doListCatalogues = async (queryParams: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        queryParams,
        true
      )) as ResponseObj;
      if (response.success) {
        catalogs.value.push(...response.data.catalogues);
        totalPage.value = response.data.totalPages;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const clearData = () => {
    catalogs.value = [];
    totalPage.value = 1;
  };

  const doSaveCatalog = async (params: FormData) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        catalogs.value.push(response.data);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doDeleteCatalog = async (id: string) => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      )) as ResponseObj;
      if (response.success) {
        const index = catalogs.value.findIndex((data) => {
          return data._id === id;
        });
        catalogs.value.splice(index, 1);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doUpdateCatalog = async (params: FormData, id: string) => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${id}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        const index = catalogs.value.findIndex((data) => {
          return data._id === id;
        });
        catalogs.value[index] = response.data;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //##PAGES METHODS##//
  const doImportPages = async (params: ImportPagesInterface | any) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        'pages/import/pdf',
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listPages = async (id: string, query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `pages/catalogue/${id}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        totalPage.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const activateCatalog = async (id: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `catalogues/activate/${id}`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // pages
  const doSavePage = async (params: FormData) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        'pages',
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePage = async (id: string) => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `pages/${id}`,
        true
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setButtonsOnPage = async (params: any, pageId: string | undefined) => {
    try {
      const response: ResponseObj = (await handlerRequest.doPostRequest(
        `pages/${pageId}/set-buttons`,
        params,
        true,
        false
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    catalogs,
    totalPage,
    clearData,
    doListCatalogues,
    doSaveCatalog,
    doDeleteCatalog,
    doUpdateCatalog,
    doImportPages,
    listPages,
    activateCatalog,
    doSavePage,
    deletePage,
    setButtonsOnPage,
  };
});
