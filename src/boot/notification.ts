// import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar';

const notification = (typeAlert: string, text: string, colorAlert: string) => {
  Notify.create({
    message: text,
    type: typeAlert,
    color: colorAlert,
  });
};

export { notification };
