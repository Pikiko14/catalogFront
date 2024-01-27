/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Catalogue {
  _id?: string;
  id?: string;
  name: string;
  start_date: Date | string | any;
  end_date: Date | string | any;
  is_active: boolean;
  cover: string | File | undefined | any;
  user_id?: string;
  pages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImportPagesInterface {
  file: File | null;
  catalogId: string | null;
}

export interface PageInterface {
  _id?: string;
  number: number;
  type: string;
  catalogue_id: string;
  images: ImageInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageInterface {
  path: string;
  order: number;
  buttons: any[];
  _id?: string;
}
