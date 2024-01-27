/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalStorage, SessionStorage } from 'quasar';

export class Storage {
  store: string;
  constructor(storeParam: string) {
    this.store = storeParam;
  }

  saveInStorage(type: string, key: string, value: any): string | any {
    if (type === 'local') {
      LocalStorage.set(key, value);
      return true;
    }
    SessionStorage.set(key, value);
    return true;
  }

  getItemStorage(type: string, key: string): any {
    let data: any = null;
    if (type == 'local') {
      data = LocalStorage.getItem(key) ? LocalStorage.getItem(key) : null;
    } else {
      data = SessionStorage.getItem(key) ? sessionStorage.getItem(key) : null;
    }
    return data;
  }

  deleteItemStorage(type: string, key: string): null {
    if (type == 'local') {
      LocalStorage.remove(key);
    } else {
      SessionStorage.remove(key);
    }
    return null;
  }

  setCookie(time: number, token: string, name: string): null {
    const expirationDate: Date = new Date();
    expirationDate.setHours(expirationDate.getHours() + time);
    const cookieValue =
      encodeURIComponent(token) +
      '; expires=' +
      expirationDate.toUTCString() +
      '; path=/';
    document.cookie = `${name}=${cookieValue}`;
    return null;
  }

  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }

    return null;
  }

  removeCookie(cookieName: string) {
    document.cookie =
      cookieName +
      '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
      window.location.hostname +
      ';';
  }
}
