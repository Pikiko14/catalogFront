<template>
  <q-card class="configuration-card">
    <!--header section-->
    <q-bar class="bg-secondary text-bold text-white q-py-lg">
      <span>
        {{ $t('configurationPage') }} {{ configurationPage?.number }}
      </span>
      <q-space />
      <q-btn
        class="q-mr-sm"
        size="8pt"
        icon="save"
        :loading="loading"
        @click="setButtons"
        round
        flat
        dense
        color="white"
      >
        <q-tooltip class="bg-secondary text-white">
          {{ $t('save') }}
        </q-tooltip>
      </q-btn>
      <q-btn round color="white" dense flat icon="close" v-close-popup>
        <q-tooltip class="bg-secondary text-white">
          {{ $t('close') }}
        </q-tooltip>
      </q-btn>
    </q-bar>
    <!--end header section-->

    <!--edition section-->
    <q-card-section>
      <component
        ref="refComponents"
        :is="renderPageSection()"
        @do-add-product="doAddProduct"
        :images="configurationPage.images"
      />
    </q-card-section>
    <!--end edition section-->

    <!--Help center-->
    <q-btn class="btn-help shadow-2" icon="help" round color="secondary">
      <q-menu>
        <q-list style="min-height: 190px">
          <q-item-label header class="text-bold text-black font-10">
            {{ $t('titleHelpCenter') }}
          </q-item-label>
          <q-item style="margin-top: -15px">
            <q-item-section>
              <q-item-label class="font-10" caption>
                1 {{ $t('clickAddProduct') }}
              </q-item-label>
              <q-item-label class="font-10 text-justify" caption lines="2">
                2 {{ $t('moveButtonLabel') }}
              </q-item-label>
              <q-item-label class="font-10 text-justify" caption lines="2">
                3 {{ $t('asignProduct') }}
              </q-item-label>
              <q-item-label class="font-10 text-justify" caption lines="2">
                4 {{ $t('moveButtonLabel') }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item-label header class="text-bold text-black font-10">
            {{ $t('rememberHelpCenter') }}
          </q-item-label>
        </q-list>
      </q-menu>
      <q-tooltip class="bg-primary">
        {{ $t('help') }}
      </q-tooltip>
    </q-btn>
    <!--End help center-->

    <!--modal products add to btn-->
    <q-dialog
      v-model="openProductModal"
      @before-show="listProducts"
      @before-hide="clearBtnIdx"
    >
      <q-card class="round-10 product-to-btn">
        <q-card-section class="title text-primary">
          <span>{{ $t('productAddBtn') }}</span>
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
        <q-card-section style="margin-top: -10px" class="q-pl-none">
          <TableCreWeb
            ref="tableProducts"
            :data="products"
            :rows="rowsTable"
            :pageProps="page"
            @do-search="doSearch"
            :enableSelected="true"
            :title="$t('product')"
            :perPageProps="perPage"
            :totalRows="totalItems"
            @open-modal="openModal"
            :permission="'create-products'"
            @do-pagination="doPaginationProducts"
          />
          <div class="full-width text-center">
            <q-btn
              no-caps
              rounded
              unelevated
              color="secondary"
              :label="$t('save')"
              @click="saveProductToBtn"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end products modal-->

    <!--Product add and update modal-->
    <q-dialog v-model="openModalProduct">
      <q-card class="round-10 product-add-card">
        <q-card-section class="title text-black">
          <span>{{ $t('productAdd') }}</span>
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
        <q-card-section style="margin-top: -10px">
          <FormProduct @close-modal="closeModal" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end product add or update modal-->
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import FormProduct from 'src/components/dashboard/products/partials/form.vue';
import SimplePage from './pagesTypes/simple.vue';
import { PaginationInterface } from 'src/interfaces/api';
import {
  ImageInterface,
  PageInterface,
} from 'src/interfaces/catalogueInterface';
import { useCatalogsStore } from 'src/stores/catalogs';
import { useProductsStore } from 'src/stores/products';
import TableCreWeb from 'src/components/general/tableCreWeb.vue';
import { ProductInterface } from 'src/interfaces/product';
import { useI18n } from 'vue-i18n';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'ConfigurationPage',
  components: {
    TableCreWeb,
    FormProduct,
  },
  props: {
    configurationPage: {
      type: Object as () => PageInterface,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const loading = ref(false);
    const page = ref<number>(1);
    const refComponents = ref();
    const search = ref<string>('');
    const btnIdx = ref<number>(-1);
    const perPage = ref<number>(12);
    const store = useCatalogsStore();
    const { configurationPage } = props;
    const storeProduct = useProductsStore();
    const openProductModal = ref<boolean>(false);
    const openModalProduct = ref<boolean>(false);
    const rowsTable = [
      {
        name: 'img',
        required: true,
        label: '',
        align: 'center',
        sortable: false,
      },
      {
        name: 'name',
        required: true,
        label: t('name'),
        align: 'left',
        field: (row: ProductInterface) => row.name,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'reference',
        required: true,
        label: t('reference'),
        align: 'left',
        field: (row: ProductInterface) => row.reference,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        align: 'left',
        required: true,
        sortable: false,
        name: 'category',
        label: t('category'),
        format: (val: any) =>
          val.map((data: ProductInterface) => {
            return `${data.name} `;
          }),
        field: (row: ProductInterface) => row.categories,
      },
    ];
    const tableProducts = ref();

    // computed
    const products = computed(() => {
      return storeProduct.products;
    });

    const totalPage = computed(() => {
      return storeProduct.totalPage;
    });

    const totalItems = computed(() => {
      return storeProduct.totalItems;
    });

    // methods
    const renderPageSection = () => {
      // Renderiza SimplePage solo si configurationPage.type es "simple"
      if (configurationPage.type === 'simple') {
        return SimplePage;
      }
      // Puedes agregar lógica para otros tipos de página aquí
      return null; // Otra opción es no renderizar nada si no hay coincidencia
    };

    const setButtons = async () => {
      try {
        const { buttons, image } = refComponents.value;
        const index = configurationPage.images.findIndex(
          (data: ImageInterface) => data._id === image._id
        );
        if (index !== -1) {
          loading.value = true;
          configurationPage.images[index].buttons = buttons;
          const response = await store.setButtonsOnPage(
            configurationPage.images,
            configurationPage._id
          );
          if (response?.success) {
            notification('positive', response.message, 'primary');
            emit('close-image-configuration');
          }
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const doAddProduct = (idx: number) => {
      btnIdx.value = idx;
      openProductModal.value = !openProductModal.value;
    };

    const clearBtnIdx = () => {
      btnIdx.value = -1;
      page.value = 1;
      perPage.value = 12;
      search.value = '';
      storeProduct.clearProduct();
    };

    const listProducts = async () => {
      const query: PaginationInterface = {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      };
      page.value = query.page as number;
      const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
      try {
        await storeProduct.doListProducts(params);
      } catch (error) {
      } finally {
      }
    };

    const openModal = () => {
      openModalProduct.value = !openModalProduct.value;
    };

    const closeModal = () => {
      openModal();
    };

    const doSearch = async (string: string) => {
      storeProduct.clearProduct();
      page.value = 1;
      search.value = string ? string : '';
      perPage.value = 12;
      await listProducts();
    };

    const doPaginationProducts = async (pagination: any) => {
      storeProduct.clearProduct();
      page.value = pagination.page;
      perPage.value = pagination.rowsPerPage;
      await listProducts();
    };

    const saveProductToBtn = () => {
      const { selectedProduct } = tableProducts.value;
      if (selectedProduct && selectedProduct.length === 0) {
        return false;
      }
      refComponents.value.buttons[btnIdx.value].product =
        selectedProduct[0]._id;
      clearBtnIdx();
      openProductModal.value = false;
    };

    // life cycle

    // return data
    return {
      page,
      perPage,
      loading,
      doSearch,
      products,
      openModal,
      rowsTable,
      totalPage,
      setButtons,
      closeModal,
      totalItems,
      clearBtnIdx,
      doAddProduct,
      listProducts,
      refComponents,
      tableProducts,
      saveProductToBtn,
      openProductModal,
      openModalProduct,
      renderPageSection,
      doPaginationProducts,
    };
  },
});
</script>
