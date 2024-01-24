<template>
  <q-form class="row" @submit="doSaveProduct">
    <div class="col-12">
      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        mobile-arrows
        class="shadow-0"
        active-color="secondary"
      >
        <q-tab name="detail" :label="$t('detail')" />
        <q-tab name="prices" :label="$t('prices')" />
        <q-tab name="variants" :label="$t('variants')" />
        <q-tab name="media" :label="$t('media')" />
      </q-tabs>
    </div>
    <div class="col-12">
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
      >
        <!--Detail panel-->
        <q-tab-panel name="detail" v-if="render">
          <DefailtProductForm @emit-value="emitValue" :productData="product" />
        </q-tab-panel>
        <!--Prices panel-->
        <q-tab-panel name="prices">
          <PricesFormSection @emit-value="setPrice" :productData="product" />
        </q-tab-panel>
        <!--variant panel-->
        <q-tab-panel name="variants">
          <VariantProductForm
            @emit-value="setVariants"
            :productData="product"
          />
        </q-tab-panel>
        <!--variant panel-->
        <q-tab-panel name="media">
          <fileUploader
            :medias="product.medias"
            @set-file="setMediaProduct"
            @delete-file="deleteFile"
            @delete-media="deleteMedia"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div class="col-12 text-center">
      <q-btn
        :class="{ 'q-mr-sm': $q.screen.gt.sm }"
        :label="$t('back')"
        rounded
        color="secondary"
        v-if="tab !== 'detail'"
        style="width: 120px"
        no-caps
        @click="backSteb"
        outline
      ></q-btn>
      <q-btn
        :label="$t('next')"
        rounded
        v-if="tab !== 'media'"
        style="width: 120px"
        :disable="
          !product.name ||
          !product.reference ||
          product.categories?.length === 0 ||
          (tab == 'prices' && product.prices?.length === 0)
        "
        :class="{ 'q-ml-sm': $q.screen.gt.sm, 'q-ml-md': $q.screen.lt.md }"
        color="secondary"
        @click="nextSteb"
        no-caps
        unelevated
      ></q-btn>
      <q-btn
        :label="$t('save')"
        rounded
        v-if="tab === 'media'"
        style="width: 120px"
        :disable="
          !product.name ||
          !product.reference ||
          product.categories?.length === 0 ||
          product.prices?.length === 0
        "
        :class="{ 'q-ml-sm': $q.screen.gt.sm, 'q-ml-md': $q.screen.lt.md }"
        color="secondary"
        :loading="loading"
        type="submit"
        no-caps
        unelevated
      ></q-btn>
    </div>
  </q-form>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue';
import PricesFormSection from './prices.vue';
import DefailtProductForm from './detail.vue';
import VariantProductForm from './variants.vue';
import { PaginationInterface } from 'src/interfaces/Api';
import { useCategoriesStore } from 'src/stores/categories';
import {
  FileObject,
  MediaProductInterface,
  ProductInterface,
  StatusPrice,
  VariantsInterface,
} from 'src/interfaces/Product';
import fileUploader from 'src/components/general/fileUploader.vue';
import { Utils } from 'src/utils/utils';
import { useProductsStore } from 'src/stores/products';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'ProductForm',
  components: {
    DefailtProductForm,
    PricesFormSection,
    VariantProductForm,
    fileUploader,
  },
  setup(props, { emit }) {
    // data
    const store = useProductsStore();
    const render = ref<boolean>(true);
    const utils = new Utils('product');
    const loading = ref<boolean>(false);
    const product = ref<ProductInterface>({
      tax: 19,
      prices: [
        {
          position: 1,
          status: StatusPrice.active,
          value: 0,
        },
      ],
      categories: [],
      variants: [],
    });
    const tab = ref<string>('detail');
    const storeCategory = useCategoriesStore();
    const filesSelected = ref<FileObject[]>([]);

    // computed
    const categories = computed(() => {
      return storeCategory.categories;
    });

    const productStore = computed(() => {
      return store.product;
    });

    // methods
    const doSaveProduct = async () => {
      const formParams = utils.transformObjectInFormData(
        product.value,
        true,
        filesSelected.value
      );
      loading.value = true;
      if (product.value._id) {
        await doUpdateProduct(formParams);
        return false;
      }
      try {
        const response = await store.doSaveProduct(formParams);
        if (response?.success) {
          filesSelected.value = [];
          product.value = {
            tax: 19,
            prices: [
              {
                position: 1,
                status: StatusPrice.active,
                value: 0,
              },
            ],
            categories: [],
            variants: [],
          };
          notification('positive', response?.message, 'secondary');
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const doUpdateProduct = async (params: FormData) => {
      try {
        const response = await store.doUpdateProduct(params, product.value._id);
        if (response?.success) {
          filesSelected.value = [];
          product.value = {
            tax: 19,
            prices: [
              {
                position: 1,
                status: StatusPrice.active,
                value: 0,
              },
            ],
            categories: [],
            variants: [],
          };
          notification('positive', response?.message, 'secondary');
          emit('close-modal');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const nextSteb = () => {
      switch (tab.value) {
        case 'prices':
          tab.value = 'variants';
          break;

        case 'variants':
          tab.value = 'media';
          break;

        default:
          tab.value = 'prices';
          break;
      }
    };

    const backSteb = () => {
      switch (tab.value) {
        case 'media':
          tab.value = 'variants';
          break;

        case 'variants':
          tab.value = 'prices';
          break;

        default:
          tab.value = 'detail';
          break;
      }
    };

    const emitValue = (data: ProductInterface) => {
      data.variants = [];
      product.value = data;
    };

    const setPrice = (prices: any) => {
      product.value.prices = prices;
    };

    const listCategories = async () => {
      const query: PaginationInterface = {
        page: 1,
        perPage: 1000,
        search: '',
      };
      const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
      try {
        await storeCategory.listCategories(params);
      } catch (error) {
      } finally {
      }
    };

    const setVariants = (value: VariantsInterface[]) => {
      product.value.variants = value;
    };

    const setMediaProduct = (file: FileObject) => {
      filesSelected.value.push(file);
    };

    const deleteFile = (key: string) => {
      const index = filesSelected.value.findIndex(
        (data: FileObject) => data.__key === key
      );
      if (index !== -1) {
        filesSelected.value.splice(index, 1);
      }
    };

    const deleteMedia = (id: string) => {
      product.value.medias = product.value.medias?.map(
        (data: MediaProductInterface) => {
          if (data._id === id) {
            data.deleted = true;
          }
          return data;
        }
      );
    };

    // life cycle
    onBeforeMount(async () => {
      if (categories.value.length === 0) {
        await listCategories();
      }
      if (productStore.value && productStore.value._id) {
        product.value = JSON.parse(JSON.stringify(productStore.value));
        render.value = false;
        nextTick(() => {
          render.value = true;
        });
      }
    });

    onBeforeUnmount(() => {
      storeCategory.clearCategories();
    });

    // return data
    return {
      tab,
      render,
      product,
      loading,
      filesSelected,
      setPrice,
      backSteb,
      nextSteb,
      emitValue,
      deleteFile,
      setVariants,
      deleteMedia,
      doSaveProduct,
      setMediaProduct,
    };
  },
});
</script>
