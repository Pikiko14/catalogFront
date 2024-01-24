/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ResponseObj {
  success?: boolean;
  error?: boolean;
  message?: string | any;
  data?: any;
  hide?: boolean;
  status?: string;
}

export interface PaginationInterface {
  page: number | string;
  perPage: number | string;
  search?: string;
}
