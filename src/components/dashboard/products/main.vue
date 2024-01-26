<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <TableCreWeb
        :data="products"
        :rows="rowsTable"
        :totalRows="totalItems"
        :title="$t('product')"
        @open-modal="openModal"
        @do-edit="doShowProduct"
        @do-delete="deleteProduct"
        @action-one="doSetDefaultImg"
        :permission="'create-products'"
      />
    </div>

    <!--No image section-->
    <div class="col-12 no-pages" v-if="products.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveProduct') }}.</p>
    </div>
    <!--End no image section-->

    <!--Product add and update modal-->
    <q-dialog v-model="openModalProduct" @before-hide="clearProduct">
      <q-card class="round-10 product-add-card">
        <q-card-section class="title text-black">
          <span v-if="!product._id">{{ $t('productAdd') }}</span>
          <span v-else>{{ $t('productUpdate') }}</span>
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

    <!--Product galery modal-->
    <q-dialog v-model="openProductGalery" @before-hide="clearProduct">
      <q-card class="round-10 product-add-card">
        <q-card-section class="title text-secondary">
          <span>
            {{ $t('productGalery') }}
          </span>
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
          <Galery @close-modal="closeGalery" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end product galery modal-->
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import Galery from './partials/galery.vue';
import FormProduct from './partials/form.vue';
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'src/boot/notification';
import { useProductsStore } from 'src/stores/products';
import { ProductInterface } from 'src/interfaces/Product';
import TableCreWeb from 'src/components/general/tableCreWeb.vue';
import { PaginationInterface, ResponseObj } from 'src/interfaces/Api';

export default defineComponent({
  name: 'ProductsMainComponent',
  components: {
    Galery,
    TableCreWeb,
    FormProduct,
  },
  setup() {
    // data
    const q = useQuasar();
    const { t } = useI18n();
    const route = useRoute();
    const page = ref<any>(1);
    const router = useRouter();
    const store = useProductsStore();
    const product = ref<ProductInterface>({});
    const openModalProduct = ref<boolean>(false);
    const openProductGalery = ref<boolean>(false);
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
      {
        name: 'options',
        required: true,
        label: t('options'),
        align: 'center',
        sortable: false,
      },
    ];

    // computed
    const products = computed(() => {
      return store.products;
    });

    const totalPage = computed(() => {
      return store.totalPage;
    });

    const totalItems = computed(() => {
      return store.totalItems;
    });

    // methods
    const listProducts = async () => {
      const query: PaginationInterface = {
        page: route.query.page ? (route.query.page as unknown as number) : 1,
        perPage: route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12,
        search: route.query.search ? (route.query.search as string) : '',
      };
      page.value = query.page as number;
      const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
      try {
        await store.doListProducts(params);
      } catch (error) {
      } finally {
      }
    };

    const openModal = () => {
      openModalProduct.value = !openModalProduct.value;
    };

    const clearProduct = () => {
      product.value = {};
      store.clearOneProduct();
    };

    const closeModal = () => {
      openModal();
      clearProduct();
    };

    const doShowProduct = async (data: ProductInterface) => {
      if (!data || !data._id) {
        return false;
      }
      try {
        const response = (await store.doGetProduct(data?._id)) as ResponseObj;
        if (response.success) {
          openModalProduct.value = true;
        }
      } catch (error) {}
    };

    const deleteProduct = (id: string) => {
      q.dialog({
        dark: false,
        title: t('delete'),
        message: t('deleteProductLabel'),
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await confirmDelete(id);
      });
    };

    const confirmDelete = async (id: string) => {
      try {
        const response = (await store.doDeleteProduct(id)) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
        }
      } catch (error) {}
    };

    const doSetDefaultImg = async (id: string) => {
      try {
        const response = (await store.doGetProduct(id)) as ResponseObj;
        if (response.success) {
          openProductGalery.value = !openProductGalery.value;
        }
      } catch (error) {}
    };

    const closeGalery = () => {
      openProductGalery.value = !openProductGalery.value;
      store.clearOneProduct();
    };

    const doSearch = (search: string) => {
      const page = route.query.page ? route.query.page : 1;
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'products',
        query: {
          page,
          perPage,
          search,
        },
      });
    };

    const loadMoreData = async () => {
      if (page.value <= totalPage.value) {
        const search = route.query.search ? route.query.search : '';
        const perPage = route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12;
        const pages: any = route.query.page
          ? (route.query.page as unknown as number)
          : 12;
        router.push({
          name: 'products',
          query: {
            page: parseInt(pages) + 1,
            perPage,
            search,
          },
        });
      }
    };

    const loadMinusData = async () => {
      if (page.value <= totalPage.value) {
        const search = route.query.search ? route.query.search : '';
        const perPage = route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12;
        const pages: any = route.query.page
          ? (route.query.page as unknown as number)
          : 12;
        router.push({
          name: 'products',
          query: {
            page: parseInt(pages) - 1,
            perPage,
            search,
          },
        });
      }
    };

    // life cycle
    onBeforeMount(async () => {
      await listProducts();
    });

    onBeforeUnmount(() => {
      store.clearProduct();
    });

    // return data
    return {
      page,
      product,
      products,
      totalItems,
      totalPage,
      rowsTable,
      openModalProduct,
      openProductGalery,
      doSearch,
      openModal,
      clearProduct,
      closeModal,
      closeGalery,
      doShowProduct,
      deleteProduct,
      doSetDefaultImg,
      loadMinusData,
      loadMoreData,
    };
  },
});
</script>
