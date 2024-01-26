<template>
  <section class="row q-px-sm">
    <div class="col-12">
      <GridCard
        :title="$t('category')"
        :loading="loading"
        :data="categories"
        :permission="'create-categories'"
        @do-search="doSearch"
        @show-data="showData"
        @delete-data="deleteData"
        @open-modal-form="openFormModal"
      />
    </div>
    <div class="col-12 no-pages" v-if="categories.length === 0">
      <q-img src="/images/no-content.png" width="320px"></q-img>
      <p>{{ $t('dontHaveCategoires') }}.</p>
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
    <q-dialog v-model="modalForm" @before-hide="clearCategory">
      <FormCategories
        :idx="idx"
        :categoryData="category"
        @close-modal="openFormModal"
      />
    </q-dialog>
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
import GridCard from 'src/components/general/gridCard.vue';
import FormCategories from './partials/form.vue';
import { useCategoriesStore } from 'src/stores/categories';
import { CategoryInterface } from 'src/interfaces/categories';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { notification } from 'src/boot/notification';

export default defineComponent({
  name: 'CategoriesMainComponents',
  components: {
    GridCard,
    FormCategories,
  },
  setup() {
    // data
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
    const idx = ref<number>(0);

    // computed
    const categories = computed(() => {
      return store.categories;
    });

    const totalPage = computed(() => {
      return store.totalPage;
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
      idx.value = data.idx;
      category.value = data.data;
      openFormModal();
    };

    const openFormModal = () => {
      modalForm.value = !modalForm.value;
    };

    const clearCategory = (data: any) => {
      category.value = {
        name: '',
      };
    };

    const deleteData = (data: any) => {
      const { id, idx } = data;
      q.dialog({
        dark: false,
        title: t('delete'),
        message: t('deleteUserLabel'),
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await confirmDeleteCategories(id, idx);
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
      categories,
      loading,
      totalPage,
      page,
      modalForm,
      category,
      doSearch,
      showData,
      loadMoreData,
      loadMinusData,
      openFormModal,
      clearCategory,
      deleteData,
    };
  },
});
</script>
