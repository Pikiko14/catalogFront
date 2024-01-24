<template>
  <section class="row">
    <div class="col-12">
      <label for="">{{ $t('name') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.name.$touch"
        @update:model-value="emitValue"
        lazy-rules
        dense
        outlined
        :error="v$.name.$error"
        placeholder="Tenis nike."
        v-model="product.name"
      >
        <template #error>
          <span v-if="v$.name.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.name.minLength.$invalid">
            {{ $t('minimumFive') }}
          </span>
          <span v-if="v$.name.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
          <span v-if="v$.name.mustBeString.$invalid">
            {{ $t('mustBeString') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <label for="">{{ $t('reference') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.reference.$touch"
        lazy-rules
        @update:model-value="emitValue"
        dense
        outlined
        :error="v$.reference.$error"
        placeholder="NIKE001"
        v-model="product.reference"
      >
        <template #error>
          <span v-if="v$.reference.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.reference.minLength.$invalid">
            {{ $t('minimumFive') }}
          </span>
          <span v-if="v$.reference.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
          <span v-if="v$.reference.mustBeReference.$invalid">
            {{ $t('mustBeReference') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm }">
      <label for="">{{ $t('tax') }}</label>
      <q-input
        rounded
        color="primary"
        lazy-rules
        dense
        outlined
        @update:model-value="emitValue"
        mask="##%"
        placeholder="19%"
        v-model="product.tax"
      >
      </q-input>
    </div>
    <div class="col-12">
      <label for="">{{ $t('category') }}</label>
      <q-select
        rounded
        color="primary"
        @blur="v$.categories.$touch"
        lazy-rules
        dense
        emit-value
        map-options
        @update:model-value="emitValue"
        multiple
        :options="categories"
        outlined
        :error="v$.categories.$error"
        placeholder="Medellín"
        use-chips
        v-model="product.categories"
      >
        <template #error>
          <span v-if="v$.categories.required.$invalid">
            {{ $t('required') }}
          </span>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <label for="">{{ $t('description') }}</label>
      <q-input
        rounded
        color="primary"
        lazy-rules
        @update:model-value="emitValue"
        dense
        type="textarea"
        outlined
        placeholder="Son unos tenis muy comodos...."
        v-model="product.description"
      >
      </q-input>
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { ProductInterface } from 'src/interfaces/Product';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { useCategoriesStore } from 'src/stores/categories';
import { CategoryInterface } from 'src/interfaces/categories';

export default defineComponent({
  name: 'DetailtProductForm',
  props: {
    productData: {
      type: Object as () => ProductInterface,
      defualt: () => {
        return {};
      },
    },
  },
  emits: ['emit-value'],
  setup(props, { emit }) {
    // data
    const product = ref<ProductInterface>({
      name: '',
    });
    const storeCategory = useCategoriesStore();

    // custom rules
    const mustBeString = (value: string) =>
      value.length > 0 ? /^[a-zA-Z\s]+$/.test(value) : true;
    const mustBeReference = (value: string) =>
      value.length > 0 ? /^[a-zA-Z0-9\-]+$/.test(value) : true;

    // rules
    const productRule = {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(90),
        mustBeString,
      },
      reference: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(30),
        mustBeReference,
      },
      categories: {
        required,
      },
    };
    const v$ = useVuelidate(productRule, product as any);

    // computed
    const categories = computed(() => {
      return storeCategory.categories.map((data: CategoryInterface) => {
        return {
          label: data.name,
          value: data._id,
        };
      });
    });

    // methods
    const emitValue = () => {
      emit('emit-value', product.value);
    };

    // life cycle
    onBeforeMount(() => {
      if (props.productData) {
        product.value = JSON.parse(JSON.stringify(props.productData));
      }
    });

    // return data
    return {
      v$,
      product,
      categories,
      emitValue,
    };
  },
});
</script>
