<template>
  <q-form ref="formRef" @submit="doSaveUser" class="row">
    <div class="col-12 col-md-12">
      <label for="">{{ $t('name') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.name.$touch"
        lazy-rules
        dense
        outlined
        :error="v$.name.$error"
        placeholder="Jondoe"
        v-model="catalog.name"
      >
        <template #error>
          <span v-if="v$.name.required.$invalid">
            {{ $t('required') }}
          </span>
          <span v-if="v$.name.minLength.$invalid">
            {{ $t('minimumFive') }}
          </span>
          <span v-if="v$.name.maxLength.$invalid">
            {{ $t('maxNinething') }}
          </span>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <label for="">{{ $t('initDate') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.start_date.$touch"
        @focus="openProxy('startDate')"
        lazy-rules
        dense
        mask="####-##-##"
        outlined
        :error="v$.start_date.$error"
        placeholder="2023-14-10"
        v-model="catalog.start_date"
      >
        <template #error>
          <span v-if="v$.start_date.required.$invalid">
            {{ $t('required') }}
          </span>
        </template>
        <template v-slot:append>
          <q-icon
            @click="openProxy('startDate')"
            name="event"
            color="primary"
            class="cursor-pointer"
          >
            <q-popup-proxy
              cover
              ref="proxyStartDate"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                @update:model-value="openProxy('startDate')"
                v-model="catalog.start_date"
              >
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm }">
      <label for="">{{ $t('endDate') }}</label>
      <q-input
        rounded
        color="primary"
        @blur="v$.end_date.$touch"
        @focus="openProxy('endDate')"
        lazy-rules
        dense
        outlined
        mask="####-##-##"
        :error="v$.end_date.$error"
        placeholder="2023-14-10"
        v-model="catalog.end_date"
      >
        <template #error>
          <span v-if="v$.end_date.required.$invalid">
            {{ $t('required') }}
          </span>
        </template>
        <template v-slot:append>
          <q-icon
            @click="openProxy('endDate')"
            name="event"
            color="primary"
            class="cursor-pointer"
          >
            <q-popup-proxy
              cover
              ref="proxyEndtDate"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                @update:model-value="openProxy('endDate')"
                v-model="catalog.end_date"
              >
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-12">
      <label for="">{{ $t('catalogFileSelector') }}</label>
      <q-file
        rounded
        color="primary"
        @blur="v$.cover.$touch"
        lazy-rules
        dense
        ref="fileInput"
        outlined
        :error="v$.cover.$error"
        @update:model-value="doCropImg"
        accept=".png, .jpg, .jpeg, .webp, image"
        v-model="catalog.cover"
      >
        <template #error>
          <span v-if="v$.cover.required.$invalid">
            {{ $t('required') }}
          </span>
        </template>
        <template v-slot:append>
          <q-icon name="cloud_upload" color="primary" class="cursor-pointer" />
        </template>
      </q-file>
    </div>
    <div class="col-12 text-center q-mt-md">
      <q-btn
        type="submit"
        :label="$t('save')"
        :loading="loading"
        rounded
        color="secondary"
        no-caps
        unelevated
      ></q-btn>
    </div>
    <q-dialog v-model="cropImg" @before-hide="clearCrop">
      <q-card class="cropCard round-10" v-if="cropImgUrl">
        <q-card-section>
          <span class="title text-secondary">
            {{ $t('cropImg') }}
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
        <q-card-section>
          <VuePictureCropper
            :boxStyle="{
              width: '500px',
              height: '500px',
              backgroundColor: '#f8f8f8',
              margin: 'auto',
            }"
            :img="cropImgUrl"
            :options="{
              viewMode: 0,
              dragMode: 'crop',
              aspectRatio: 2 / 1.3,
            }"
            @ready="readyToCrop"
          />
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn
            unelevated
            color="secondary"
            no-caps
            @click="getResult"
            rounded
            :label="$t('cutImg')"
          ></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { Catalogue } from 'src/interfaces/CatalogueInterface';
import {
  required,
  minLength,
  maxLength,
  requiredIf,
} from '@vuelidate/validators';
import { Utils } from 'src/utils/utils';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
import { notification } from 'src/boot/notification';
import { useI18n } from 'vue-i18n';
import { useCatalogsStore } from 'src/stores/catalogs';
import { ResponseObj } from 'src/interfaces/Api';
import { date } from 'quasar';

export default defineComponent({
  name: 'CatalogFormComponent',
  components: {
    VuePictureCropper,
  },
  emits: ['close-form'],
  props: {
    catalogue: {
      type: Object as () => Catalogue,
      default: () => {
        return {};
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    // data
    const submit = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const cropImg = ref<boolean>(false);
    const cropImgUrl = ref<string>('');
    const proxyStartDate = ref();
    const proxyEndtDate = ref();
    const fileInput = ref();
    const { t } = useI18n();
    const utils = new Utils('catalogForm');
    const catalog = ref<Catalogue>({
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
      cover: null,
    });
    const catalogStore = useCatalogsStore();

    //validations rules
    const catalogRule = {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(90),
      },
      start_date: {
        required,
      },
      end_date: {
        required,
      },
      is_active: {
        required,
      },
      cover: {
        required: requiredIf(() => {
          return !catalog.value._id;
        }),
      },
    };

    const v$ = useVuelidate(catalogRule, catalog);

    // methods
    const doSaveUser = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        return;
      }
      loading.value = true;
      if (catalog.value._id) {
        await doUpdateCatalog();
        return true;
      }
      try {
        catalog.value.start_date = date.formatDate(
          catalog.value.start_date,
          'YYYY-MM-YY'
        );
        catalog.value.end_date = date.formatDate(
          catalog.value.end_date,
          'YYYY-MM-YY'
        );
        const formData: FormData = utils.transformObjectInFormData(
          catalog.value,
          false,
          null
        );
        const response = (await catalogStore.doSaveCatalog(
          formData
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
          emit('close-form');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const doUpdateCatalog = async () => {
      try {
        const formData: FormData = utils.transformObjectInFormData(
          catalog.value,
          false,
          null
        );
        const response = (await catalogStore.doUpdateCatalog(
          formData,
          catalog.value._id as string
        )) as ResponseObj;
        if (response.success) {
          notification('positive', response.message, 'primary');
          emit('close-form');
        }
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };

    const openProxy = (type: string): boolean => {
      if (type === 'startDate') {
        proxyStartDate.value.toggle();
        return true;
      }
      proxyEndtDate.value.toggle();
      return true;
    };

    const doCropImg = async (fileData: any) => {
      const isValidFile = utils.valdiateFile(fileData);
      if (!isValidFile) {
        catalog.value.cover = null;
        notification('negative', t('noFileImgAccepted'), 'red');
        return false;
      }
      v$.value.start_date.$touch();
      if (v$.value.start_date.$invalid) {
        await clearFile();
        return true;
      }
      v$.value.end_date.$touch();
      if (v$.value.end_date.$invalid) {
        await clearFile();
        return true;
      }
      if (fileData.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          cropImgUrl.value = event.target.result;
        };
        reader.readAsDataURL(fileData);
      }
      cropImg.value = !cropImg.value;
    };

    const getResult = async () => {
      if (!cropper) return;
      const file = await cropper.getFile({
        fileName: `catalogue_${catalog.value.start_date}_${catalog.value.end_date}`,
      });
      cropImgUrl.value = '';
      catalog.value.cover = file ? file : catalog.value.cover;
      cropImg.value = !cropImg.value;
    };

    const clearFile = () => {
      setTimeout(() => {
        catalog.value.cover = null;
        fileInput.value.resetValidation();
      }, 500);
    };

    const clearCrop = async () => {
      if (!cropper) return;
      cropper.clear();
      cropper.reset();
    };

    const readyToCrop = () => {
      console.log('ready to crop');
    };

    // life cicle
    onBeforeMount(() => {
      if (props.catalogue && props.catalogue._id) {
        catalog.value = JSON.parse(JSON.stringify(props.catalogue));
        catalog.value.start_date = props.catalogue.start_date
          .split('T')
          .shift();
        catalog.value.end_date = props.catalogue.end_date.split('T').shift();
      }
    });

    // return
    return {
      catalog,
      submit,
      v$,
      proxyStartDate,
      proxyEndtDate,
      loading,
      cropImg,
      fileInput,
      cropImgUrl,
      cropper,
      doSaveUser,
      openProxy,
      doCropImg,
      getResult,
      clearCrop,
      readyToCrop,
    };
  },
});
</script>

<style scoped>
.cropCard {
  width: 650px;
  height: 670px;
}
</style>
