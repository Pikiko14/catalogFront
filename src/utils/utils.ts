/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from 'src/stores/auth';

export class Utils {
  model: string;

  constructor(modalData: string) {
    this.model = modalData;
  }

  formatPrice(price: number | undefined): string {
    if (!price) {
      return '';
    }
    const val = (price / 1).toFixed(0).replace('.', ',');
    return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  validatePermission(available: string): boolean {
    const store = useAuthStore();
    const permissions =
      store.user.scopes && store.user.scopes.length > 0
        ? store.user.scopes
        : [];
    let enable = false;
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (permission !== available) {
          enable = false;
        } else {
          enable = true;
          break;
        }
      }
    }
    return enable;
  }

  transformObjectInFormData(
    object: any,
    hasFile: boolean,
    file: File | null | undefined | any
  ): FormData {
    const formData = new FormData();
    const keysObj = Object.keys(object);
    for (const keyObj of keysObj) {
      if (
        Array.isArray(object[keyObj]) ||
        (object[keyObj] &&
          typeof object[keyObj] === 'object' &&
          !object[keyObj].size &&
          !object[keyObj].lastModified)
      ) {
        // Si el valor es un array, se agrega cada elemento con el mismo nombre en el FormData
        formData.append(`${keyObj}`, JSON.stringify(object[keyObj]));
      } else {
        formData.append(keyObj, object[keyObj]);
      }
    }
    if (hasFile && file && !Array.isArray(file)) {
      formData.append('file', file);
    }
    if (Array.isArray(file)) {
      file.forEach((item: File) => {
        formData.append('file', item);
      });
    }
    return formData;
  }

  valdiateDate(value: string): boolean {
    if (value) {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      return regex.test(value);
    }
    return true;
  }

  valdiateFile(value: any): boolean {
    if (value) {
      const regex = /^.*\.(png|jpg|jpeg|webp|pdf)$/;
      return regex.test(value.name);
    }
    return true;
  }
}
