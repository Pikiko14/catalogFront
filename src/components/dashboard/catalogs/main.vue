<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <TableCreWeb
        :rows="rowsTable"
        :data="catalogues"
        @do-search="doSearch"
        :showActiveBtn="true"
        :title="$t('catalog')"
        :totalRows="totalItems"
        @do-edit="doShowCatalog"
        @do-delete="deleteCatalog"
        @open-modal="openModalForm"
        @do-active="doActivationCatalog"
        :permission="'create-catalogues'"
        @do-pagination="doPaginationCatalogues"
      />
    </div>

    <!--No data section-->
    <div class="col-12 no-pages" v-if="catalogues.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveCatalogues') }}.</p>
    </div>
    <!--end no data section-->

    <!--modal form-->
    <q-dialog v-model="openModal" @before-hide="clearCatalogue">
      <q-card class="round-10 user-add-card">
        <q-card-section class="title text-secondary">
          <span v-if="!catalogue._id">{{ $t('catalogAdd') }}</span>
          <span v-else>{{ $t('catalogUpdate') }}</span>
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
          <CatalogForm :catalogue="catalogue" @close-form="openModalForm" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--modal form-->
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { date } from 'quasar';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import CatalogForm from './partials/form.vue';
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'src/boot/notification';
import { useCatalogsStore } from 'src/stores/catalogs';
import { Catalogue } from 'src/interfaces/catalogueInterface';
import TableCreWeb from 'src/components/general/tableCreWeb.vue';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { PaginationInterface, ResponseObj } from 'src/interfaces/api';

export default defineComponent({
  name: 'CatalogMainComponents',
  components: {
    CatalogForm,
    TableCreWeb,
  },
  setup() {
    // data
    const route = useRoute();
    const openModal = ref<boolean>(false);
    const catalogsStore = useCatalogsStore();
    const q = useQuasar();
    const { t } = useI18n();
    const page = ref<any>(1);
    const router = useRouter();
    const catalogue = ref<Catalogue>({
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
      cover: null,
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
        field: (row: Catalogue) => row.name,
        format: (val: string) => `${val}`,
        sortable: false,
      },
      {
        name: 'dateStart',
        required: true,
        label: t('dateStart'),
        align: 'left',
        field: (row: Catalogue) => row.start_date,
        format: (val: string) => `${date.formatDate(val, 'YYYY-MM-DD')}`,
        sortable: false,
      },
      {
        name: 'dateEnd',
        required: true,
        label: t('dateEnd'),
        align: 'left',
        field: (row: Catalogue) => row.end_date,
        format: (val: string) => `${date.formatDate(val, 'YYYY-MM-DD')}`,
        sortable: false,
      },
      {
        name: 'totalPage',
        required: true,
        label: `# ${t('pages')}`,
        align: 'center',
        field: (row: Catalogue) => (row.pages ? row.pages.length : 0),
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
    const catalogues = computed(() => {
      return catalogsStore.catalogs;
    });

    const totalPage = computed(() => {
      return catalogsStore.totalPage;
    });

    const totalItems = computed(() => {
      return catalogsStore.totalItems;
    });

    // methods
    const doSearch = (search: string) => {
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'catalogs',
        query: {
          search,
          page: 1,
          perPage,
        },
      });
    };

    const openModalForm = () => {
      openModal.value = !openModal.value;
    };

    const listCatalogues = async () => {
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
        await catalogsStore.doListCatalogues(params);
      } catch (error) {
      } finally {
      }
    };

    const deleteCatalog = async (id: string) => {
      q.dialog({
        dark: false,
        title: t('delete'),
        message: t('deleteCatalogLabel'),
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await confirmDelete(id);
      });
    };

    const confirmDelete = async (id: string) => {
      try {
        const response = (await catalogsStore.doDeleteCatalog(
          id
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
        }
      } catch (error) {}
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
          name: 'catalogs',
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
          name: 'catalogs',
          query: {
            search,
            page: parseInt(pages) - 1,
            perPage,
          },
        });
      }
    };

    const doShowCatalog = (item: Catalogue) => {
      catalogue.value = item;
      openModalForm();
    };

    const clearCatalogue = () => {
      catalogue.value = {
        name: '',
        start_date: '',
        end_date: '',
        is_active: false,
        cover: null,
      };
    };

    const doActivationCatalog = async (row: Catalogue) => {
      try {
        const { _id } = row;
        const data = await catalogsStore.activateCatalog(_id);
        if (data && data.success) {
          notification('positive', data.message, 'primary');
          const index = catalogues.value.findIndex(
            (item: any) => item._id === _id
          );
          if (index !== -1) {
            catalogues.value[index].is_active =
              !catalogues.value[index].is_active;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const doPaginationCatalogues = (pagination: any) => {
      const search = route.query.search ? route.query.search : '';
      router.push({
        name: 'catalogs',
        query: {
          page: pagination.page || 1,
          perPage: pagination.rowsPerPage || 12,
          search,
        },
      });
    };

    // life cycle
    onBeforeMount(async () => {
      await listCatalogues();
    });

    onBeforeMount(() => {
      catalogsStore.clearData();
    });

    // return data
    return {
      doSearch,
      openModalForm,
      deleteCatalog,
      loadMinusData,
      loadMoreData,
      doShowCatalog,
      clearCatalogue,
      doActivationCatalog,
      openModal,
      catalogues,
      totalPage,
      page,
      rowsTable,
      catalogue,
      totalItems,
      doPaginationCatalogues,
    };
  },
});
</script>
