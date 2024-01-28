<template>
  <section class="row q-px-sm">
    <!--grid section-->
    <div class="col-12">
      <TableSmart
        :title="$t('pages')"
        :permission="'create-pages'"
        :tooltipbtn="$t('addPagesLabel')"
        :type="'pages'"
        :showBackButton="true"
        :data="pages"
        :showSearch="false"
        :showImportButton="true"
        @do-search="doSearch"
        @show-import-modal="showImportModal"
        @open-modal="openModalAddPage"
        @delete-page="doDeletePage"
        @do-page-configuration="doPageConfiguration"
      />
    </div>
    <!--end grid section-->

    <!--no image section-->
    <div class="col-12 no-pages" v-if="pages.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHavePages') }}.</p>
    </div>
    <!--end no image section-->

    <!--paginator section-->
    <div class="col-12 q-mt-lg text-center q-my-lg" v-if="totalPage > 1">
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
    <!--end paginator section-->

    <!--Import page modal-->
    <q-dialog v-model="importModal">
      <q-card class="round-10 card-import-pdf">
        <q-card-section class="title text-primary">
          <span v-if="importPdf"> {{ $t('pagesImpotLabelModal') }}</span>
          <span v-else> {{ $t('pagesCreationLabel') }}</span>
          <q-btn
            flat
            dense
            color="red"
            @click="closeModalImport"
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
          <ImportForm v-if="importPdf" @close-modal-import="closeModalImport" />
          <PageForm
            @push-page="pushPage"
            @close-modal-import="closeModalImport"
            v-else
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--Finish import page modal-->

    <!--Configuration page modal-->
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="configurationPageModal"
      @before-hide="listPagesInCatalog"
    >
      <ConfigurationPage
        :configurationPage="configurationPage"
        @close-image-configuration="closeImageConfiguration"
      />
    </q-dialog>
    <!--end configuration page modal-->
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PageForm from './partials/form.vue';
import { useRoute, useRouter } from 'vue-router';
import ImportForm from './partials/importForm.vue';
import { notification } from 'src/boot/notification';
import TableSmart from '../../general/gridSection.vue';
import { useCatalogsStore } from 'src/stores/catalogs';
import ConfigurationPage from './partials/configurationPage.vue';
import { PageInterface } from 'src/interfaces/catalogueInterface';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { PaginationInterface, ResponseObj } from 'src/interfaces/api';

export default defineComponent({
  name: 'CatalogPagesMainComponents',
  components: {
    TableSmart,
    ImportForm,
    PageForm,
    ConfigurationPage,
  },
  setup() {
    // data
    const q = useQuasar();
    const { t } = useI18n();
    const route = useRoute();
    const page = ref<any>(1);
    const router = useRouter();
    const store = useCatalogsStore();
    const importPdf = ref<boolean>(false);
    const pages = ref<PageInterface[]>([]);
    const importModal = ref<boolean>(false);
    const configurationPage = ref<PageInterface>({
      number: 0,
      type: 'simple',
      catalogue_id: route.params.catalogId as string,
      images: [],
    });
    const configurationPageModal = ref<boolean>(false);

    // computed
    const totalPage = computed(() => {
      return store.totalPage;
    });

    // methods
    const doSearch = (search: string) => {
      console.log(search);
    };

    const openModalAddPage = () => {
      importModal.value = !importModal.value;
    };

    const showImportModal = () => {
      importPdf.value = true;
      importModal.value = !importModal.value;
    };

    const closeModalImport = async () => {
      importPdf.value = false;
      importModal.value = !importModal.value;
      await listPagesInCatalog();
    };

    const listPagesInCatalog = async () => {
      try {
        const id = route.params.catalogId as string;
        const query: PaginationInterface = {
          page: route.query.page ? (route.query.page as unknown as number) : 1,
          perPage: route.query.perPage
            ? (route.query.perPage as unknown as number)
            : 12,
          search: route.query.search ? (route.query.search as string) : '',
        };
        page.value = query.page;
        const params = `?page=${query.page}&perPage=${query.perPage}&search=${query.search}`;
        const response = (await store.listPages(id, params)) as ResponseObj;
        if (response.success) {
          pages.value = response.data.pages;
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
          name: 'catalogsPages',
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
          name: 'catalogsPages',
          query: {
            search,
            page: parseInt(pages) - 1,
            perPage,
          },
        });
      }
    };

    const pushPage = (file: PageInterface) => {
      pages.value.push(file);
    };

    const doDeletePage = async (id: string) => {
      q.dialog({
        dark: false,
        title: t('delete'),
        message: t('deletePageLabel'),
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await confirmDelete(id);
      });
    };

    const confirmDelete = async (id: string) => {
      const index = pages.value.findIndex(
        (item: PageInterface) => item._id === id
      );
      if (index !== -1) {
        try {
          const response = await store.deletePage(id);
          if (response?.success) {
            pages.value.splice(index, 1);
            notification('positive', response.message, 'primary');
          }
        } catch (error) {}
      }
    };

    const doPageConfiguration = (page: PageInterface | any) => {
      configurationPage.value = page;
      configurationPageModal.value = !configurationPageModal.value;
    };

    const closeImageConfiguration = () => {
      doPageConfiguration({});
    };

    // life cycle
    onBeforeMount(async () => {
      await listPagesInCatalog();
    });

    // return data
    return {
      page,
      pages,
      importPdf,
      totalPage,
      importModal,
      configurationPage,
      listPagesInCatalog,
      configurationPageModal,
      closeImageConfiguration,
      openModalAddPage,
      loadMoreData,
      loadMinusData,
      showImportModal,
      doSearch,
      closeModalImport,
      pushPage,
      doDeletePage,
      doPageConfiguration,
    };
  },
});
</script>
