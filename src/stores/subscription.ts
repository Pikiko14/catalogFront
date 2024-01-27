/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Request } from 'src/api/api';
import { ResponseObj } from 'src/interfaces/Api';
import { PlanInterface } from 'src/interfaces/subscriptionInterface';

const handlerRequest = new Request({
  Accept: 'application/json',
});

const path = 'plans';
const pathSubscription = 'subscriptions';

export const useSubscriptionStore = defineStore('subscriptionStore', () => {
  // data
  const plans = ref<PlanInterface[]>([]);

  // methods
  const listPlans = async () => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        plans.value = response.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * do subscription
   * @param params
   * @returns
   */
  const doSubscriptionToPlan = async (params: any): Promise<any> => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${pathSubscription}`,
        params,
        true,
        false
      )) as ResponseObj;
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const disableSubscription = async (id: string | undefined) => {
    try {
      const response = (await handlerRequest.doDeleteRequest(
        `${pathSubscription}/${id}`,
        true
      )) as ResponseObj;
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // return data
  return {
    plans,
    listPlans,
    doSubscriptionToPlan,
    disableSubscription,
  };
});
