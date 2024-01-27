<template>
  <section class="row q-px-sm">
    <!--table section-->
    <div class="col-12">
      <TableCreWeb
        :rows="rowsTable"
        :data="categories"
        @do-edit="showData"
        @do-search="doSearch"
        @do-delete="deleteData"
        :title="$t('category')"
        :totalRows="totalItems"
        @open-modal="openFormModal"
        :permission="'create-categories'"
        @do-pagination="doPaginationCategories"
      />
    </div>
    <!--table section end-->

    <!--no data section-->
    <div class="col-12 no-pages" v-if="categories.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveCategoires') }}.</p>
    </div>
    <!--end no data section-->

    <!--dialog form category-->
    <q-dialog v-model="modalForm" @before-hide="clearCategory">
      <FormCategories
        :idx="idx"
        :categoryData="category"
        @close-modal="openFormModal"
      />
    </q-dialog>
    <!--End dialog form-->
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { PaginationInterface } from 'src/interfaces/Api';
import {
  defineComponent,
  onBeforeMount,
  computed,
  ref,
  onBeforeUnmount,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TableCreWeb from 'src/components/general/tableCreWeb.vue';
import FormCategories from './partials/form.vue';
import { useCategoriesStore } from 'src/stores/categories';
import { CategoryInterface } from 'src/interfaces/categories';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'CategoriesMainComponents',
  components: {
    TableCreWeb,
    FormCategories,
  },
  setup() {
    // data
    const idx = ref();
    const q = useQuasar();
    const { t } = useI18n();
    const page = ref<any>(1);
    const route = useRoute();
    const router = useRouter();
    const loading = ref<boolean>(false);
    const store = useCategoriesStore();
    const modalForm = ref<boolean>(false);
    const category = ref<CategoryInterface>({
      name: '',
    });
    const rowsTable = [
      {
        name: 'img',
        required: true,
        align: 'left',
        sortable: false,
      },
      {
        name: 'name',
        required: true,
        label: t('name'),
        align: 'left',
        field: (row: CategoryInterface) => row.name,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'totalProduct',
        required: true,
        label: t('totalProduct'),
        align: 'center',
        field: () => 0,
        format: (val: string) => `${val}`,
        sortable: false,
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
    const categories = computed(() => {
      return store.categories;
    });

    const totalPage = computed(() => {
      return store.totalPage;
    });

    const totalItems = computed(() => {
      return store.totalItems;
    });

    // methods
    const listCategories = async () => {
      const query: PaginationInterface = {
        page: route.query.page ? (route.query.page as unknown as number) : 1,
        perPage: route.query.perPage
          ? (route.query.perPage as unknown as number)
          : 12,
        search: route.query.search ? (route.query.search as string) : '',
      };
      page.value = query.page;
      const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
      try {
        await store.listCategories(params);
      } catch (error) {
      } finally {
      }
    };

    const doSearch = async (search: string) => {
      const page = route.query.page ? route.query.page : 1;
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'categories',
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
          name: 'categories',
          query: {
            search,
            page: parseInt(pages) + 1,
            perPage,
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
          name: 'categories',
          query: {
            search,
            page: parseInt(pages) - 1,
            perPage,
          },
        });
      }
    };

    const showData = async (data: any) => {
      const index = getIndex(data._id);
      idx.value = index;
      category.value = JSON.parse(JSON.stringify(data));
      openFormModal();
    };

    const openFormModal = () => {
      modalForm.value = !modalForm.value;
    };

    const clearCategory = () => {
      category.value = {
        name: '',
      };
    };

    const deleteData = (id: string) => {
      const idx = getIndex(id);
      q.dialog({
        dark: false,
        cancel: true,
        persistent: true,
        title: t('delete'),
        message: t('deleteCategoryLabel'),
      }).onOk(async () => {
        await confirmDeleteCategories(id, idx);
      });
    };

    const getIndex = (id: string) => {
      return categories.value.findIndex((data: CategoryInterface) => {
        return data._id === id;
      });
    };

    const confirmDeleteCategories = async (id: string, idx: number) => {
      try {
        const response = await store.deleteCategory(id, idx);
        if (response?.success) {
          notification('positive', response?.message, 'primary');
        }
      } catch (error) {}
    };

    const doPaginationCategories = (pagination: any) => {
      const search = route.query.search ? route.query.search : '';
      router.push({
        name: 'categories',
        query: {
          page: pagination.page || 1,
          perPage: pagination.rowsPerPage || 12,
          search,
        },
      });
    };

    // life cycle
    onBeforeMount(async () => {
      await listCategories();
    });

    onBeforeUnmount(() => {
      store.clearCategories();
    });

    // return data
    return {
      idx,
      rowsTable,
      categories,
      loading,
      totalPage,
      page,
      modalForm,
      category,
      totalItems,
      doSearch,
      showData,
      loadMoreData,
      loadMinusData,
      openFormModal,
      clearCategory,
      deleteData,
      doPaginationCategories,
    };
  },
});
</script>
