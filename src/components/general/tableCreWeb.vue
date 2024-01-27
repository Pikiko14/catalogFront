<template>
  <section class="row">
    <!--title section-->
    <div class="col-12 col-md-4 q-pl-md weight-600">
      <q-btn
        @click="$router.go(-1)"
        icon="chevron_left"
        flat
        size="14pt"
        dense
        v-if="showBackButton"
        style="margin-top: -3px"
        rounded
        color="primary"
      >
        <q-tooltip class="bg-primary">
          {{ $t('back') }}
        </q-tooltip>
      </q-btn>
      <span class="font-14">
        {{ title }}
      </span>
    </div>
    <!--end title section-->

    <!-- Search and actions button -->
    <div
      class="col-12 col-md-8 q-pb-lg text-right"
      :class="{ 'q-mt-lg': $q.screen.lt.md }"
    >
      <section class="row justify-end">
        <div class="col-12 col-md-4 col-lg-3" v-if="showSearch">
          <q-input
            v-model="search"
            outlined
            rounded
            :placeholder="$t('search')"
            style="margin-top: -5px"
            color="primary"
            debounce="1000"
            clearable
            class="full-width"
            @update:model-value="doSearchUser"
            dense
          >
            <template v-slot:append>
              <q-icon name="search" color="primary"></q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="col-12 col-md-3"
          :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
          v-if="utils.validatePermission(permission) && showImportButton"
        >
          <q-btn
            @click="showImportModal"
            rounded
            class="full-width"
            size="12pt"
            style="margin-top: -5px"
            no-caps
            :label="$t('importButtonLabel')"
            color="primary"
            unelevated
          >
            <q-tooltip class="bg-primary">
              {{ $t('importButtonLabel') }} {{ $t('pages') }}
            </q-tooltip>
          </q-btn>
        </div>
        <div
          class="col-12 col-md-3"
          :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
          v-if="utils.validatePermission(permission)"
        >
          <q-btn
            @click="openModalForm"
            rounded
            class="full-width"
            size="12pt"
            style="margin-top: -5px"
            no-caps
            :label="$t('userAddBtn')"
            color="secondary"
            unelevated
          >
            <q-tooltip class="bg-secondary">
              {{ tooltipbtn }}
            </q-tooltip>
          </q-btn>
        </div>
      </section>
    </div>
    <!--End search and actions buttons-->

    <!--Table section-->
    <div class="col-12" v-if="data && data.length > 0">
      <q-card class="round-10 shadow-0">
        <q-card-section>
          <q-table
            flat
            row-key="name"
            :rows="data"
            :columns="rows"
            @request="onRequest"
            class="shadow-0 bg-transparent"
            v-model:pagination="pagination"
            :selection="enableSelected ? 'single' : 'none'"
            v-model:selected="selectedProduct"
          >
            <!--Image td-->
            <template v-slot:body-cell-img="props">
              <q-td class="text-center" style="width: 50px">
                <q-img
                  :src="`${
                    props.row.default_image
                      ? `${apiUrl}/${props.row.default_image.path}`
                      : props.row.image
                      ? `${apiUrl}/${props.row.image}`
                      : props.row.cover
                      ? `${apiUrl}/${props.row.cover}`
                      : '/images/no-image.png'
                  }`"
                  color="secondary"
                  class="text-white"
                  style="width: 30px; height: 30px; border-radius: 5px"
                  square
                  size="8pt"
                >
                </q-img>
              </q-td>
            </template>

            <!--role td-->
            <template v-slot:body-cell-role="props">
              <q-td class="text-center">
                <q-chip color="secondary" class="text-white" square size="8pt">
                  {{ roles[props.row.role] }}
                </q-chip>
              </q-td>
            </template>

            <!--options td-->
            <template v-slot:body-cell-options="props">
              <q-td class="text-center">
                <q-btn
                  icon="edit"
                  flat
                  dense
                  round
                  size="9pt"
                  color="secondary"
                  @click="doEditData(props.row)"
                >
                  <q-tooltip class="bg-secondary">
                    {{ $t('edit') }}
                  </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  dense
                  round
                  size="9pt"
                  icon="photo_library"
                  color="purple-5"
                  v-if="showGaleryButton"
                  @click="doOpenGalery(props.row)"
                >
                  <q-tooltip class="bg-purple-5">
                    {{ $t('defaultImage') }}
                  </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  dense
                  round
                  size="9pt"
                  icon="auto_stories"
                  color="blue-5"
                  v-if="showPagesButton"
                  :to="`/dashboard/catalogs/pages/${props.row._id}?page=1&perPage=16`"
                >
                  <q-tooltip class="bg-blue-5">
                    {{ $t('pages') }}
                  </q-tooltip>
                </q-btn>

                <q-icon
                  size="23pt"
                  v-if="showActiveBtn"
                  class="cursor-pointer"
                  @click="doActiveData(props.row)"
                  :color="!props.row.is_active ? 'red' : 'secondary'"
                  :name="!props.row.is_active ? 'toggle_off' : 'toggle_on'"
                >
                  <q-tooltip
                    :class="!props.row.is_active ? 'bg-red' : 'bg-secondary'"
                  >
                    {{
                      !props.row.is_active ? $t('activate') : $t('desActivate')
                    }}
                  </q-tooltip>
                </q-icon>

                <q-btn
                  flat
                  dense
                  round
                  size="9pt"
                  icon="delete"
                  color="primary"
                  @click="doDeleteData(props.row)"
                >
                  <q-tooltip class="bg-primary">
                    {{ $t('delete') }}
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <!--end table section-->
  </section>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Utils } from 'src/utils/utils';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';

export default defineComponent({
  name: 'TableCreWebComponent',
  props: {
    rows: {
      type: Array as () => any,
      default: () => [],
    },
    title: {
      type: String,
      default: () => '',
    },
    permission: {
      type: String,
      default: () => '',
    },
    tooltipbtn: {
      type: String,
      default: () => 'Agregar',
    },
    data: {
      type: Array as () => any,
      defaullt: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: () => '',
    },
    showImportButton: {
      type: Boolean,
      default: () => false,
    },
    showSearch: {
      type: Boolean,
      default: () => true,
    },
    showBackButton: {
      type: Boolean,
      default: () => false,
    },
    totalRows: {
      type: Number,
      default: () => 1,
    },
    showGaleryButton: {
      type: Boolean,
      default: () => false,
    },
    showActiveBtn: {
      type: Boolean,
      default: () => false,
    },
    showPagesButton: {
      type: Boolean,
      default: () => false,
    },
    perPageProps: {
      type: Number,
      default: () => 0,
    },
    pageProps: {
      type: Number,
      default: () => 0,
    },
    enableSelected: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, { emit }) {
    // data
    const { t } = useI18n();
    const route = useRoute();
    const search = ref<string>('');
    const utils = new Utils('users');
    const apiUrl = process.env.API_URL;
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 1,
    });
    const roles: any = {
      admin: t('admin'),
      employe: t('employe'),
    };
    const selectedProduct = ref([]);

    // watch
    watch(
      () => {
        return props.totalRows;
      },
      (val: number) => {
        pagination.value.rowsNumber = val;
      }
    );

    watch(
      () => {
        return props.perPageProps;
      },
      (val: number) => {
        pagination.value.rowsPerPage = val;
      }
    );

    watch(
      () => {
        return props.pageProps;
      },
      (val: number) => {
        pagination.value.page = val;
      }
    );

    // methods
    const openModalForm = () => {
      emit('open-modal');
    };

    const doSearchUser = () => {
      emit('do-search', search.value);
    };

    const showImportModal = () => {
      emit('show-import-modal');
    };

    const doEditData = (row: any) => {
      emit('do-edit', row);
    };

    const doDeleteData = (row: any) => {
      const index = props.data.findIndex((data: any) => data._id === row._id);
      emit('do-delete', row._id, index);
    };

    const onRequest = (event: any) => {
      const { pagination } = event;
      emit('do-pagination', pagination);
    };

    const doOpenGalery = (row: any) => {
      emit('open-galery', row);
    };

    const doActiveData = (row: any) => {
      emit('do-active', row);
    };

    // life cicle
    onBeforeMount(() => {
      // search query params
      if (route.query.search) {
        search.value = route.query.search as string;
      }
      // search query page
      if (route.query.page) {
        pagination.value.page = route.query.page
          ? parseInt(route.query.page as string)
          : 1;
      }
      // search query per page
      if (route.query.perPage) {
        pagination.value.rowsPerPage = route.query.perPage
          ? parseInt(route.query.perPage as string)
          : 10;
      }
      // totalRows validation
      if (props.totalRows) {
        pagination.value.rowsNumber = props.totalRows;
      }
      // props
      if (props.perPageProps) {
        pagination.value.rowsPerPage = props.perPageProps;
      }
      if (props.pageProps) {
        pagination.value.page = props.pageProps;
      }
    });

    // reuturn statement
    return {
      roles,
      utils,
      search,
      apiUrl,
      onRequest,
      pagination,
      doEditData,
      doOpenGalery,
      doDeleteData,
      doSearchUser,
      doActiveData,
      openModalForm,
      showImportModal,
      selectedProduct,
    };
  },
});
</script>
