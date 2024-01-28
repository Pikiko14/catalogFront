import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/api';

const handlerRequest = new Request({
  Accept: 'application/json',
});

const path = 'dashboard';

export const useDashboardStore = defineStore('dashboardStore', () => {
  // data

  // methods
  const listMetricsData = async () => {
    try {
      const response: ResponseObj = await handlerRequest.doGetRequest(
        `${path}/metrics`,
        '',
        true
      );
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return data and methods
  return {
    listMetricsData,
  };
});
