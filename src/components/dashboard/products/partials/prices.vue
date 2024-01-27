<template>
  <section class="row">
    <div class="col-12">
      <q-markup-table class="shadow-0">
        <thead>
          <tr>
            <th class="text-left">{{ $t('price') }}</th>
            <th class="text-left">{{ $t('label') }}</th>
            <th class="text-center">
              {{ $t('status') }}
              <q-btn
                icon="add"
                flade
                dense
                rounded
                unelevated
                @click="pushNewPrice"
                size="6pt"
                class="float-right"
                color="secondary"
              ></q-btn>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer price-item"
            v-for="(price, idx) in prices"
            :key="idx"
          >
            <td class="text-left">
              <qCurrencyInput
                @change-value="doEmit"
                v-model="price.value"
                :options="{
                  currency: 'COP',
                  hideCurrencySymbol: true,
                  hideGroupingSeparatorOnFocus: false,
                  precision: 0,
                  valueRange: { min: 0 },
                }"
                style="width: 200px"
              />
            </td>
            <td class="text-left">
              <div style="margin-top: -20px">Precio {{ price.position }}</div>
            </td>
            <td class="text-center relative">
              <q-btn
                unelevated
                square
                size="8pt"
                style="width: 60px; margin-top: -18px; border-radius: 8px"
                class="text-white"
                no-caps
                @click="changeStatus(idx)"
                :class="statusClass[price.status]"
              >
                {{ statusLabel[price.status] }}
              </q-btn>
              <q-btn
                icon="delete"
                flat
                dense
                rounded
                unelevated
                @click="deletePrice(idx)"
                size="9pt"
                class="btn-delete-price"
                color="red"
                v-if="idx > 0"
              >
                <q-tooltip class="bg-red">
                  {{ $t('delete') }}
                </q-tooltip>
              </q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div class="col-12 text-center q-mt-lg" v-if="showConfirmButton">
      <q-btn
        :label="$t('save')"
        rounded
        @click="doEmit"
        v-close-popup
        v-if="prices.length > 0"
        color="secondary"
        unelevated
        no-caps
      ></q-btn>
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import {
  PricesInterface,
  ProductInterface,
  StatusPrice,
  VariantsInterface,
} from 'src/interfaces/product';
import { defineComponent, onBeforeMount, ref } from 'vue';
import qCurrencyInput from 'src/components/general/qCurrencyInput.vue';

export default defineComponent({
  name: 'DetailtProductForm',
  props: {
    productData: {
      type: Object as () => ProductInterface | VariantsInterface,
      defualt: () => {
        return {};
      },
    },
    showConfirmButton: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    qCurrencyInput,
  },
  setup(props, { emit }) {
    // data
    const prices = ref<PricesInterface[]>([]);
    const statusLabel = ref({
      active: 'Activo',
      inactive: 'Inactivo',
    });
    const statusClass = ref({
      active: 'bg-secondary',
      inactive: 'bg-red',
    });

    // rules

    // computed

    // methods
    const pushNewPrice = () => {
      const data: PricesInterface = {
        position: prices.value.length + 1,
        value: 0,
        status: StatusPrice.inactive,
      };
      prices.value.push(data);
      setPositionPrice();
    };

    const setPositionPrice = () => {
      let i = 1;
      let issetActive: any = prices.value.find(
        (data) => data.status === 'active'
      );
      prices.value = prices.value.map((data: PricesInterface) => {
        if (prices.value.length >= 1 && !issetActive) {
          data.status = StatusPrice.active;
          issetActive = true;
        }
        data.position = i;
        i++;
        return data;
      });
      doEmit();
    };

    const deletePrice = (idx: number) => {
      if (prices.value.length === 1) {
        return false;
      }
      prices.value.splice(idx, 1);
      setPositionPrice();
    };

    const doEmit = () => {
      emit('emit-value', prices.value);
    };

    const changeStatus = (idx: number) => {
      // get preview active
      const previewActivePrice = prices.value.find(
        (data) => data.status === 'active'
      );
      if (previewActivePrice) {
        const index = prices.value.findIndex(
          (data: any) => data.position === previewActivePrice.position
        );
        prices.value[index].status = StatusPrice.inactive;
      }
      // change price status
      switch (prices.value[idx].status) {
        case StatusPrice.active:
          prices.value[idx].status = StatusPrice.inactive;
          break;

        default:
          prices.value[idx].status = StatusPrice.active;
          break;
      }
      doEmit();
    };

    // life cycle
    onBeforeMount(() => {
      if (props.productData) {
        prices.value = JSON.parse(JSON.stringify(props.productData.prices));
      }
    });

    // return data
    return {
      prices,
      statusClass,
      statusLabel,
      doEmit,
      deletePrice,
      pushNewPrice,
      changeStatus,
    };
  },
});
</script>
