/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from './userInterface';

export interface Auth {
  success: boolean;
  data: Data;
  message: string;
}

export interface Data {
  token: string;
  user: User;
}

export interface Config {
  uuid: string;
  user_id: number;
  credit_status: boolean;
  credit_fee: number;
  credit_interest: number;
  credit_min_fee: number;
  blocked_client: any[];
  fee_late: number;
  micro_status: boolean;
  micro: number;
  quota_status: boolean;
  quota_visible: boolean;
  quota_sync: boolean;
  quota_default: null;
  comision_visible: boolean;
  comision: number;
  gps: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name?: string;
  last_name?: string;
}

export interface ProfileInterface {
  profile_pictury?: string;
  brand_name?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  address?: string;
  website?: string;
  type_slider?: string;
  user_id?: string;
  brand_color: string;
  whatsapp_message: string;
  file?: string;
  _id?: string;
}
