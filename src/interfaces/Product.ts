/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductInterface {
  id?: string | any;
  tax?: number;
  _id?: string | any;
  name?: string;
  user_id?: string;
  reference?: string;
  description?: string;
  prices?: PricesInterface[];
  count_add_to_cart?: number;
  count_order_finish?: number;
  ratings?: RatingsInterface[];
  unit_of_measurement?: string;
  variants?: VariantsInterface[];
  medias?: MediaProductInterface[];
  categories?: string[];
  files?: FileObject[];
}

export interface PricesInterface {
  id?: string;
  _id?: string;
  value: number | null | undefined | any;
  position: number;
  status: StatusPrice;
}

export interface MediaProductInterface {
  id?: string;
  _id?: string;
  path: string;
  deleted?: boolean;
  type: ['video', 'image'];
  provider: ['owner', 'youtube'];
}

export interface VariantsInterface {
  id?: string;
  tax: number;
  _id?: string;
  reference: string;
  attribute: string;
  prices: PricesInterface[];
  medias?: MediaProductInterface[];
}

export interface RatingsInterface {
  rating: number;
  comment: string;
  name_client: string;
}

export enum StatusPrice {
  active = 'active',
  inactive = 'inactive',
}

export interface FileObject {
  __key: string;
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
}
