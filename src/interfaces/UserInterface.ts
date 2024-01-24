export interface User {
  _id?: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  password?: string | undefined | null;
  role?: string;
  scopes?: string[];
  parent?: string;
  catalogues?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
