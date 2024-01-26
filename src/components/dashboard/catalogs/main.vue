<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <TableSmart
        :title="$t('catalog')"
        :permission="'create-catalogues'"
        :tooltipbtn="$t('addCatalogLabel')"
        :type="'catalog'"
        :data="catalogues"
        @do-search="doSearch"
        @open-modal="openModalForm"
        @do-delete="deleteCatalog"
        @do-show="doShowCatalog"
        @do-activation-catalog="doActivationCatalog"
      />
    </div>
    <div class="col-12 no-pages" v-if="catalogues.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveCatalogues') }}.</p>
    </div>
    <div class="col-12 q-mt-xl text-center" v-if="totalPage > 1">
      <q-btn
        rounded
        color="secondary"
        :label="$q.screen.gt.sm ? $t('back') : ''"
        :disabled="parseInt(page) === 1"
        @click="loadMinusData"
        icon="arrow_back_ios"
        unelevated
        :style="$q.screen.gt.sm ? 'width: 160px' : ''"
        class="q-mr-md"
        no-caps
      ></q-btn>
      <q-btn
        rounded
        color="secondary"
        :style="$q.screen.gt.sm ? 'width: 160px' : ''"
        class="q-ml-md"
        :label="$q.screen.gt.sm ? $t('next') : ''"
        icon-right="arrow_forward_ios"
        :disabled="parseInt(page) === totalPage"
        @click="loadMoreData"
        unelevated
        no-caps
      ></q-btn>
    </div>
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
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import TableSmart from '../../general/tableSmart.vue';
import { useCatalogsStore } from 'src/stores/catalogs';
import { PaginationInterface, ResponseObj } from 'src/interfaces/Api';
import { useRoute, useRouter } from 'vue-router';
import CatalogForm from './partials/form.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { notification } from 'src/boot/notification';
import { Catalogue } from 'src/interfaces/CatalogueInterface';

export default defineComponent({
  name: 'CatalogMainComponents',
  components: {
    TableSmart,
    CatalogForm,
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

    // computed
    const catalogues = computed(() => {
      return catalogsStore.catalogs;
    });

    const totalPage = computed(() => {
      return catalogsStore.totalPage;
    });

    // methods
    const doSearch = (search: string) => {
      const page = route.query.page ? route.query.page : 1;
      const perPage = route.query.perPage ? route.query.perPage : 1;
      router.push({
        name: 'catalogs',
        query: {
          search,
          page,
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

    const doActivationCatalog = async (id: string) => {
      try {
        const data = await catalogsStore.activateCatalog(id);
        if (data && data.success) {
          notification('positive', data.message, 'primary');
          const index = catalogues.value.findIndex(
            (item: any) => item._id === id
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
      catalogue,
    };
  },
});
</script>
