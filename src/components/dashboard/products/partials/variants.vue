<template>
  <section class="row">
    <div class="col-12">
      <q-btn
        icon="add"
        flade
        dense
        rounded
        unelevated
        @click="pushNewVariant"
        size="6pt"
        class="float-right"
        color="secondary"
      ></q-btn>
    </div>
    <div
      class="col-12 text-center font-12 text-bold q-py-md"
      v-if="variants.length === 0"
    >
      {{ $t('dontHaveVariants') }}
    </div>
    <div class="col-12" v-for="(variant, idx) in variants" :key="idx">
      <section class="row full-width variant-item-form cursor-pointer">
        <div class="col-12 col-md-4" :class="{ 'q-pr-md': $q.screen.gt.sm }">
          <label>{{ $t('reference') }}</label>
          <q-input
            outlined
            rounded
            color="primary"
            placeholder="NIKE-001"
            @update:model-value="emitvalue"
            style="width: 180px"
            :class="{ 'full-width q-pr-lg': $q.screen.lt.md }"
            :rules="[
              (vall) => !!vall || $t('required'),
              (vall) =>
                (vall.length > 0 && vall.length < 91) ||
                $t('referenceMinValidation'),
            ]"
            dense
            v-model="variant.reference"
          ></q-input>
        </div>
        <div
          class="col-12 col-md-4"
          :class="{ 'q-pl-md q-pr-md': $q.screen.gt.sm }"
        >
          <label>{{ $t('attribute') }}</label>
          <q-input
            outlined
            rounded
            color="primary"
            @update:model-value="emitvalue"
            placeholder="ROJO, ROJO - VERDE, ROJO | AZUL"
            :class="{ 'full-width q-pr-lg': $q.screen.lt.md }"
            style="width: 150px"
            :rules="[
              (vall) => !!vall || $t('required'),
              (vall) =>
                (vall.length > 0 && vall.length < 41) ||
                $t('referenceMinValidation'),
            ]"
            dense
            v-model="variant.attribute"
          ></q-input>
        </div>
        <div
          class="col-12 col-md-4"
          :class="{ 'q-pl-md q-pr-lg': $q.screen.gt.sm }"
        >
          <label>{{ $t('tax') }}</label>
          <q-input
            rounded
            color="primary"
            lazy-rules
            @update:model-value="emitvalue"
            dense
            outlined
            :class="{ 'full-width q-pr-lg': $q.screen.lt.md }"
            mask="##%"
            placeholder="19%"
            v-model="variant.tax"
          >
          </q-input>
        </div>
        <div class="action-variant">
          <q-btn
            @click="setPriceVariant(idx)"
            icon="attach_money"
            color="secondary"
            flat
            dense
            rounded
          >
            <q-tooltip class="bg-secondary">
              {{ $t('addPrice') }}
            </q-tooltip>
          </q-btn>
          <q-btn
            class="q-mt-sm q-pt-xs"
            icon="delete"
            color="red"
            flat
            dense
            rounded
            @click="deleteVariant(idx)"
          >
            <q-tooltip class="bg-red">
              {{ $t('delete') }}
            </q-tooltip>
          </q-btn>
        </div>
      </section>
    </div>
    <q-dialog v-model="variantPriceModal">
      <q-card class="product-add-card round-10">
        <q-card-section class="title text-secondary">
          <span>{{ $t('price') }}</span> {{ variants[variantIdx].reference }}
          <q-btn
            flat
            dense
            color="red"
            v-close-popup
            icon="close"
            rounded
            class="float-right"
          >
            <q-tooltip class="bg-red">
              {{ $t('close') }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
        <q-card-section>
          <PricesSection
            @emit-value="setPriceToVariant"
            :productData="variants[variantIdx]"
            :showConfirmButton="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useI18n } from 'vue-i18n';
import PricesSection from './prices.vue';
import { notification } from 'src/boot/notification';
import { defineComponent, onBeforeMount, ref } from 'vue';
import {
  PricesInterface,
  ProductInterface,
  VariantsInterface,
} from 'src/interfaces/Product';

export default defineComponent({
  name: 'VariantProductForm',
  props: {
    productData: {
      type: Object as () => ProductInterface,
      defualt: () => {
        return {};
      },
    },
  },
  components: {
    PricesSection,
  },
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const { productData } = props;
    const variantIdx = ref<number>(-1);
    const variantPriceModal = ref<boolean>(false);
    const variants = ref<VariantsInterface[]>([]);

    // rules

    // computed

    // methods
    const pushNewVariant = () => {
      if (!productData?.reference) {
        notification('negative', t('addReference'), 'red');
        return true;
      }
      const data = {
        reference: '',
        attribute: '',
        tax: props.productData?.tax ? props.productData.tax : 19,
        prices: [],
      };
      variants.value.push(data);
      setVariantsReference();
      emitvalue();
    };

    const emitvalue = () => {
      emit('emit-value', variants.value);
    };

    const deleteVariant = (idx: number) => {
      variants.value.splice(idx, 1);
      if (variants.value.length > 0) {
        setVariantsReference();
      }
      if (variants.value.length === 0) {
        variants.value = [];
      }
      emitvalue();
    };

    const setVariantsReference = () => {
      let i = 1;
      variants.value = variants.value.map((data: VariantsInterface) => {
        if (productData) {
          data.reference = `${productData?.reference}-${i}`;
          i++;
        }
        return data;
      });
    };

    const setPriceVariant = (idx: number) => {
      variantIdx.value = idx;
      variantPriceModal.value = !variantPriceModal.value;
    };

    const setPriceToVariant = (prices: PricesInterface | any) => {
      variants.value[variantIdx.value].prices = prices;
      emitvalue();
    };

    // life cycle
    onBeforeMount(() => {
      if (props.productData) {
        variants.value = JSON.parse(JSON.stringify(productData?.variants));
      }
    });

    // return data
    return {
      emitvalue,
      variants,
      variantIdx,
      variantPriceModal,
      deleteVariant,
      pushNewVariant,
      setPriceVariant,
      setPriceToVariant,
    };
  },
});
</script>
