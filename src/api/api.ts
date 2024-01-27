/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'boot/axios';
import { notification } from 'boot/notification';
import { ResponseObj } from 'src/interfaces/api';
import { Storage } from 'src/utils/storage';

const storage = new Storage('api');

class Request {
  public headers: object = {};

  constructor(header: object) {
    this.headers = header;
  }

  doRequest(url: string, params: object, type: string, auth = false) {
    if (type === 'get') {
      this.doGetRequest(url, params as any, auth);
    }
    if (type === 'post') {
      this.doPostRequest(url, params, auth);
    }
  }

  doGetRequest(
    url: string,
    params: string,
    auth: boolean
  ): Promise<ResponseObj> {
    if (auth) {
      const isSupervisor = storage.getItemStorage(
        'local',
        'have_controll_user'
      );
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${storage.getCookie('session') || ''}`,
        'Is-Supervisor': isSupervisor ? 'Si' : 'No',
      };
    }
    return new Promise((resolve, reject) => {
      api
        .get(`${url}${params}`, { headers: this.headers })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  doPostRequest(
    url: string,
    params: object,
    auth: boolean,
    file = false
  ): Promise<ResponseObj> {
    const isSupervisor = storage.getItemStorage('local', 'have_controll_user');
    if (auth) {
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${storage.getCookie('session') || ''}`,
        'Is-Supervisor': isSupervisor ? 'Si' : 'No',
      };
    }
    if (file) {
      this.headers = { ...this.headers, Content: 'multipart/form-data' };
    }
    return new Promise((resolve, reject) => {
      api
        .post(url, params, { headers: this.headers })
        .then((response: any) => {
          if (response.data.status === 422) {
            notification('negative', response.data.message, 'red-9');
            reject(response.data);
          }
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  doDeleteRequest(url: string, auth: boolean): Promise<ResponseObj> {
    if (auth) {
      const isSupervisor = storage.getItemStorage(
        'local',
        'have_controll_user'
      );
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${storage.getCookie('session') || ''}`,
        'Is-Supervisor': isSupervisor ? 'Si' : 'No',
      };
    }
    return new Promise((resolve, reject) => {
      api
        .delete(`${url}`, { headers: this.headers })
        .then((response: any) => {
          if (response.data.status === 422) {
            notification('negative', response.data.message, 'red-9');
            reject(response.data);
          }
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  doPutRequest(
    url: string,
    params: any,
    auth: boolean,
    file = false
  ): Promise<ResponseObj> {
    if (auth) {
      const isSupervisor = storage.getItemStorage(
        'local',
        'have_controll_user'
      );
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${storage.getCookie('session') || ''}`,
        'Is-Supervisor': isSupervisor ? 'Si' : 'No',
      };
    }
    if (file) {
      this.headers = { ...this.headers, Content: 'multipart/form-data' };
    }
    return new Promise((resolve, reject) => {
      const path = params.id ? `${url}/${params.id}` : url;
      api
        .put(path, params, { headers: this.headers })
        .then((response: any) => {
          if (response.data.status === 422) {
            notification('negative', response.data.message, 'red-9');
            reject(response.data);
          }
          resolve(response.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}

export { Request };
