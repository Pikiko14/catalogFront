<template>
  <q-card class="configuration-card">
    <!--header section-->
    <q-bar class="bg-secondary text-white q-py-lg">
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
        :images="configurationPage.images"
      />
    </q-card-section>
    <!--end edition section-->

    <!--Help center-->
    <q-btn class="btn-help shadow-2" icon="help_center" round color="primary">
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
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import {
  ImageInterface,
  PageInterface,
} from 'src/interfaces/catalogueInterface';
import { useCatalogsStore } from 'src/stores/catalogs';
import { defineComponent, ref } from 'vue';
import SimplePage from './pagesTypes/simple.vue';

export default defineComponent({
  name: 'ConfigurationPage',
  components: {},
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
    const loading = ref(false);
    const refComponents = ref();
    const store = useCatalogsStore();
    const { configurationPage } = props;

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
            emit('close-image-configuration');
          }
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    // life cycle

    // return data
    return {
      loading,
      refComponents,
      setButtons,
      renderPageSection,
    };
  },
});
</script>
