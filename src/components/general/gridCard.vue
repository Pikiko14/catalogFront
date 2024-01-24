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
            @update:model-value="doSearch"
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
      <SimpleCard
        :idx="idx"
        :data="item"
        :title="item.name"
        :initial="item.name.substring(0, 1)"
        :subtitle="`Total items: 0`"
        @show-data="doShowData"
        @delete-data="doDeleteData"
      />
    </div>
  </section>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { Utils } from 'src/utils/utils';
import { defineComponent, onBeforeMount, ref } from 'vue';
import SimpleCard from './simpleCard.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'GridCard',
  components: {
    SimpleCard,
  },
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
    'show-import-modal',
    'open-modal-form',
    'show-data',
    'delete-data',
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    //data
    const route = useRoute();
    const search = ref<string>('');
    const utils = new Utils('categories');

    // methods
    const doSearch = (value: any) => {
      emit('do-search', value);
    };

    const showImportModal = () => {
      emit('show-import-modal');
    };

    const openModalForm = () => {
      emit('open-modal-form');
    };

    const doShowData = (data: any) => {
      emit('show-data', data);
    };

    const doDeleteData = (data: any) => {
      emit('delete-data', data);
    };

    // life cycle
    onBeforeMount(() => {
      if (route.query.search) {
        search.value = route.query.search as string;
      }
    });

    // return
    return {
      search,
      utils,
      doSearch,
      doShowData,
      doDeleteData,
      openModalForm,
      showImportModal,
    };
  },
});
</script>
