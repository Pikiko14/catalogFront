<template>
  <q-field dense outlined rounded :error="v$.amount.$error">
    <template v-slot:control>
      <div class="self-center full-width no-outline" tabindex="0">
        <input v-on:focus="touchInput" ref="inputRef" type="text" />
      </div>
    </template>
    <template #error>
      <span v-if="v$.amount.required.$invalid">
        {{ $t('required') }}
      </span>
    </template>
  </q-field>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { watch, defineComponent, ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useCurrencyInput } from 'vue-currency-input';
import { minLength, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export default defineComponent({
  name: 'CurrencyInput',
  props: {
    modelValue: Number, // Vue 2: value
    options: Object,
    rules: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const { inputRef, setValue, numberValue } = useCurrencyInput(
      props.options as any,
      false
    );
    const obj = ref({
      amount: null,
    });

    // rules
    const productRule = {
      amount: {
        required,
        minLength: minLength(1),
      },
    };
    const v$ = useVuelidate(productRule, obj);

    // watch
    watchDebounced(
      numberValue,
      (value: any) => emit('update:modelValue', value),
      {
        debounce: 0,
      }
    ); // Vue 2: emit('input', value)

    watch(
      () => props.modelValue, // Vue 2: props.value
      (value: any) => {
        setValue(value);
        emit('change-value', value);
        obj.value.amount = value;
      }
    );

    // methods
    const touchInput = () => {
      v$.value.amount.$touch();
    };

    // return statement
    return {
      inputRef,
      v$,
      touchInput,
    };
  },
});
</script>

<style scoped>
input {
  background: transparent;
  border: 0px hidden;
  outline: 0px;
  height: 30px;
  border-radius: 20px;
}
</style>
