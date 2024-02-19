<template>
  <section class="row">
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
            color="secondary"
            debounce="1000"
            clearable
            class="full-width"
            @update:model-value="doSearchUser"
            dense
          >
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>
        <div
          class="col-12 col-md-3"
          :class="{ 'q-pl-md': $q.screen.gt.sm, 'q-mt-lg': $q.screen.lt.md }"
          v-if="utils.validatePermission(permission)"
        >
          <q-btn
            @click="previewCatalog"
            rounded
            class="full-width"
            size="12pt"
            style="margin-top: -5px"
            no-caps
            :label="$t('showCatalog')"
            color="blue-5"
            unelevated
          >
            <q-tooltip class="bg-blue-5">
              {{ $t('showCatalog') }}
            </q-tooltip>
          </q-btn>
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
    <div
      class="col-12 col-sm-6 col-md-4 col-lg-3 q-pa-md"
      v-for="(item, idx) in data"
      :key="idx"
    >
      <q-card v-if="type === 'pages'" class="shadow-1 round-10">
        <q-card-section horizontal class="q-pa-none">
          <q-img
            class="page-img"
            :src="
              !item.images[0].path.includes('s3.us-east-2')
                ? `${apiUrl}${item.images[0].path}`
                : item.images[0].path
            "
          >
            <div class="overflow">
              <div class="row">
                <div class="col-6 q-pr-sm">
                  <q-btn
                    unelevated
                    icon="visibility"
                    dense
                    color="secondary"
                    round
                    @click="doPageConfiguration(item)"
                  >
                    <q-tooltip class="bg-secondary">
                      {{ $t('edit') }}
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="col-6 q-pl-sm">
                  <q-btn
                    @click="doDeletePage(item._id)"
                    icon="delete"
                    dense
                    color="red"
                    unelevated
                    round
                  >
                    <q-tooltip class="bg-red">
                      {{ $t('delete') }}
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-img>
        </q-card-section>
      </q-card>
      <q-card class="my-card shadow-1 round-10" v-if="type === 'products'">
        <q-img
          class="img-card-product"
          :src="
            item.default_image && item.default_image.path
              ? `${apiUrl}${item.default_image.path}`
              : '/images/no-image.png'
          "
        >
          <div class="absolute-bottom font-12 text-center">
            {{ item.name }}
          </div>
        </q-img>
        <q-card-section>
          <q-card-actions horizontal class="justify-around q-pa-none">
            <q-btn
              flat
              round
              color="secondary"
              icon="visibility"
              @click="showData(item)"
            >
              <q-tooltip
                class="bg-secondary"
                self="center left"
                anchor="center right"
                :offset="[20, 0]"
              >
                {{ $t('edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              @click="deleteData(item._id)"
              flat
              round
              color="red"
              icon="delete"
            >
              <q-tooltip
                class="bg-red"
                self="center left"
                anchor="center right"
                :offset="[20, 0]"
              >
                {{ $t('delete') }}
              </q-tooltip>
            </q-btn>
            <q-btn flat round color="primary" icon="more_horiz">
              <q-tooltip
                class="bg-primary"
                self="center left"
                anchor="center right"
                :offset="[20, 0]"
              >
                {{ $t('moreActions') }}
              </q-tooltip>
              <q-menu anchor="top right" self="top left" max-height="130px">
                <q-list>
                  <q-item clickable @click="doSetDefaultImg(item._id)">
                    <q-item-section avatar>
                      <q-icon color="secondary" name="compare"></q-icon>
                    </q-item-section>
                    <q-item-section
                      class="text-secondary font-12 weight-600"
                      :class="{ 'text-red': item.is_active }"
                      style="margin-left: -20px"
                    >
                      {{ $t('defaultImage') }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { PageInterface } from 'src/interfaces/catalogueInterface';
import { Utils } from 'src/utils/utils';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'TableSmart',
  components: {},
  props: {
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
      type: Object as () => any,
      defaullt: () => {
        return {};
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
  },
  emits: [
    'do-search',
    'open-modal',
    'do-delete',
    'do-show',
    'open-preview',
    'show-import-modal',
    'delete-page',
    'do-activation-catalog',
    'delete-data',
    'show-data',
    'action-one',
    'do-page-configuration',
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    // data
    const frontUrl = process.env.FRONT_URL;
    const search = ref<string>('');
    const utils = new Utils('catalogs');
    const apiUrl = process.env.API_URL;
    const route = useRoute();

    // methods
    const doSearchUser = async () => {
      emit('do-search', search.value);
    };

    const openModalForm = () => {
      emit('open-modal');
    };

    const deleteCatalog = (id: string) => {
      emit('do-delete', id);
    };

    const filterCatalog = (item: any) => {
      emit('do-show', item);
    };

    const showImportModal = () => {
      emit('show-import-modal');
    };

    const showOverflow = (e: any) => {
      if (e.originalTarget.lastChild.childNodes.length > 0) {
        if (
          e.originalTarget.lastChild.childNodes[0].style.display === '' ||
          e.originalTarget.lastChild.childNodes[0].style.display === 'none'
        ) {
          e.originalTarget.lastChild.childNodes[0].style.display = 'flex';
        } else {
          e.originalTarget.lastChild.childNodes[0].style.display = 'none';
        }
      }
    };

    const doDeletePage = async (id: string) => {
      emit('delete-page', id);
    };

    const doActivateCatalog = async (id: string) => {
      emit('do-activation-catalog', id);
    };

    const deleteData = async (id: string) => {
      emit('delete-data', id);
    };

    const showData = async (id: string) => {
      emit('show-data', id);
    };

    const doSetDefaultImg = (id: string) => {
      emit('action-one', id);
    };

    const doPageConfiguration = (page: PageInterface) => {
      emit('do-page-configuration', page);
    };

    const previewCatalog = () => {
      emit('open-preview');
    };

    // life cicle
    onBeforeMount(() => {
      if (route.query.search) {
        search.value = route.query.search as string;
      }
    });

    // return
    return {
      search,
      utils,
      apiUrl,
      frontUrl,
      previewCatalog,
      doSetDefaultImg,
      doSearchUser,
      openModalForm,
      deleteCatalog,
      filterCatalog,
      showImportModal,
      showOverflow,
      doDeletePage,
      doActivateCatalog,
      showData,
      deleteData,
      doPageConfiguration,
    };
  },
});
</script>
