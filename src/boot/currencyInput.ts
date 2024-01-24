import { boot } from 'quasar/wrappers';
import VueCurrencyInput from 'vue-currency-input';
import Vue from 'vue';

const pluginOptions = {
  globalOptions: { currency: 'COP' },
};

export default boot(async ({ app }) => {
  console.log(123);
});
